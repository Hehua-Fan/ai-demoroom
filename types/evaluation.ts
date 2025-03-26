export interface EvaluationResult {
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
    [key: string]: {
      [key: string]: {
        句子: string;
        评论: string[];
        修改建议?: string;
      };
    };
  };
} 