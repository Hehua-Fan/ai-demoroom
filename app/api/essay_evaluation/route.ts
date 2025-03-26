import { NextRequest, NextResponse } from 'next/server';

interface AgentResponse {
  choices: Array<{
    content: string;
  }>;
}

interface SentenceError {
  句子: string;
  评论: string[];
  修改建议?: string;
}

interface ParagraphComments {
  [key: string]: SentenceError;
}

interface EvaluationResult {
  总体评分: number;
  词汇运用: {
    得分: number;
    评价: string;
  };
  句子结构: {
    得分: number;
    评价: string;
  };
  文章结构: {
    得分: number;
    评价: string;
  };
  内容相关性: {
    得分: number;
    评价: string;
  };
  语言复杂度统计: {
    总词数: number;
    总句子数: number;
    平均单词长度: string;
    平均句子长度: string;
  };
  CEFR词汇等级: {
    A级词汇占比: string;
    B级词汇占比: string;
    C级词汇占比: string;
    词汇评价: string;
    作文中使用到的C2词汇: string[];
    作文中使用到的C1词汇: string[];
    作文中使用到的B2词汇: string[];
    作文中使用到的B1词汇: string[];
    作文中使用到的A2词汇: string[];
    作文中使用到的A1词汇: string[];
  };
  逐句点评: {
    [key: string]: ParagraphComments;
  };
}

const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
};

/**
 * 清理可能包含Markdown代码块的JSON字符串
 * @param jsonString 可能包含Markdown代码块的JSON字符串
 * @returns 清理后的JSON字符串
 */
function cleanJsonString(jsonString: string): string {
  // 移除开头的```json或```标记
  let cleaned = jsonString.replace(/^```(?:json)?\n/, '');
  // 移除结尾的```标记
  cleaned = cleaned.replace(/\n```$/, '');
  // 移除可能存在的其他Markdown格式
  cleaned = cleaned.trim();
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const uuid = process.env.UUID;
    const authKey = process.env.AUTH_KEY;
    const authSecret = process.env.AUTH_SECRET;

    if (!uuid || !authKey || !authSecret) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing essay text' }, { status: 400 });
    }

    const url = "https://uat.agentspro.cn/openapi/agent/chat/completions/v1";
    const headers = {
      'Authorization': `Bearer ${authKey}.${authSecret}`,
      'Content-Type': 'application/json',
    };
    const body = {
      agentId: uuid,
      chatId: null,
      userChatInput: text,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const raw = await response.text();
      return NextResponse.json({ error: 'API Error', raw }, { status: 500 });
    }

    const data: AgentResponse = await response.json();
    
    // 清理并解析 JSON
    const cleanedContent = cleanJsonString(data.choices[0].content);
    
    try {
      const result = JSON.parse(cleanedContent) as EvaluationResult;
      logger.info(`Parsed result: ${JSON.stringify(result, null, 2)}`);
      
      // 直接返回原始结果，保持中文字段结构
      return NextResponse.json(result);
    } catch (error) {
      throw error;
    }
  } catch (err) {
    logger.error(`Evaluation failed: ${err}`);
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}
