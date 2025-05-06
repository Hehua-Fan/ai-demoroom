import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// #region 类型定义
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
  词汇运用: { 得分: number; 评价: string };
  句子结构: { 得分: number; 评价: string };
  文章结构: { 得分: number; 评价: string };
  内容相关性: { 得分: number; 评价: string };
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
// #endregion

const prisma = new PrismaClient();

const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
};

/**
 * 清理可能包含Markdown代码块的JSON字符串
 */
function cleanJsonString(jsonString: string): string {
  let cleaned = jsonString.replace(/^```(?:json)?\n/, '');
  cleaned = cleaned.replace(/\n```$/, '');
  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    const uuid = process.env.UUID;
    const authKey = process.env.AUTH_KEY;
    const authSecret = process.env.AUTH_SECRET;

    if (!uuid || !authKey || !authSecret) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    // ✅ 加上 userId 的解析
    const { text, userId } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing essay text' }, { status: 400 });
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
    }

    // 🔗 远程调用大模型接口
    const url = "http://10.16.4.181:50351/openapi/agent/chat/completions/v1";
    // const url = "https://uat.agentspro.cn/openapi/agent/chat/completions/v1";
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
    const cleanedContent = cleanJsonString(data.choices[0].content);

    // ✅ JSON 解析 + 写入数据库
    try {
      // 先解析为普通对象，然后转回字符串再转回对象
      // 这样可以确保对象可以安全地作为JSON存储
      const parsedResult = JSON.parse(cleanedContent);
      
      // 使用这种方式处理，避免类型错误
      const result = parsedResult as EvaluationResult;
      
      logger.info(`Parsed result: ${JSON.stringify(result, null, 2)}`);

      await prisma.english_writing_review.create({
        data: {
          user_id: userId,
          essay_text: text,
          // 先将对象转换为字符串，再转回对象，确保适合作为JSON存储
          review_json: JSON.parse(JSON.stringify(result)),
        },
      });

      logger.info(`Saved evaluation result for user: ${userId}`);
      return NextResponse.json(result);
    } catch (error) {
      logger.error("JSON parse error: " + String(error));
      return NextResponse.json({ error: 'Failed to parse model response' }, { status: 500 });
    }

  } catch (err) {
    logger.error(`Evaluation failed: ${err}`);
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}
