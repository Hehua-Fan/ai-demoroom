import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { EvaluationResult } from "@/types/evaluation";

interface ScoreCommentsProps {
  evaluationResult: EvaluationResult | null;
}

const ScoreComments: React.FC<ScoreCommentsProps> = ({ evaluationResult }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="text-green-600 mr-2" />;
    if (score >= 60) return <AlertCircle className="text-yellow-600 mr-2" />;
    return <XCircle className="text-red-600 mr-2" />;
  };

  return (
    <Card className="shadow-sm border border-[#E6F4FF] h-full">
      <CardHeader className="bg-white">
        <CardTitle className="text-xl font-semibold text-gray-800">
          分数评语
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {evaluationResult ? (
          <div className="space-y-4">
            {/* 总分展示 */}
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(evaluationResult.总体评分)}`}>
                  {evaluationResult.总体评分}
                </div>
                <div className="text-gray-600 mt-1 text-xs">总分</div>
              </div>
            </div>

            {/* 分项得分 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "词汇", score: evaluationResult?.词汇运用?.得分 ?? 0, comment: evaluationResult?.词汇运用?.评价 ?? '' },
                { label: "句子", score: evaluationResult?.句子结构?.得分 ?? 0, comment: evaluationResult?.句子结构?.评价 ?? '' },
                { label: "篇章结构", score: evaluationResult?.文章结构?.得分 ?? 0, comment: evaluationResult?.文章结构?.评价 ?? '' },
                { label: "内容相关性", score: evaluationResult?.内容相关性?.得分 ?? 0, comment: evaluationResult?.内容相关性?.评价 ?? '' }
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    {getScoreIcon(item.score)}
                    <span className={`text-xl font-bold ${getScoreColor(item.score)}`}>
                      {item.score}
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs">{item.label}</div>
                  <div className="mt-2 text-xs text-gray-600 line-clamp-3">{item.comment}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {/* 语言复杂度统计 */}
              {evaluationResult?.语言复杂度统计 && (
                <div className="bg-white rounded-lg p-3 border border-[#E6F4FF]">
                  <h3 className="text-sm font-semibold mb-3 text-[#00A0E9]">语言复杂度统计</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#706eff]">
                        {evaluationResult.语言复杂度统计.总词数 ?? 0}
                      </div>
                      <div className="text-xs text-gray-600">总词数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#706eff]">
                        {evaluationResult.语言复杂度统计.总句子数 ?? 0}
                      </div>
                      <div className="text-xs text-gray-600">总句子数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#706eff]">
                        {evaluationResult.语言复杂度统计.平均单词长度 ?? '0.0'}
                      </div>
                      <div className="text-xs text-gray-600">平均单词长度</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#706eff]">
                        {evaluationResult.语言复杂度统计.平均句子长度 ?? '0.0'}
                      </div>
                      <div className="text-xs text-gray-600">平均句子长度</div>
                    </div>
                  </div>
                </div>
              )}

              {/* CEFR词汇等级分布 */}
              {evaluationResult?.CEFR词汇等级 && (
                <div className="bg-white rounded-lg p-3 border border-[#E6F4FF]">
                  <h3 className="text-sm font-semibold mb-3 text-[#00A0E9]">CEFR词汇等级分布</h3>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-300">
                        {evaluationResult.CEFR词汇等级.A级词汇占比 ?? '0%'}
                      </div>
                      <div className="text-xs text-gray-600">A级词汇</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-500">
                        {evaluationResult.CEFR词汇等级.B级词汇占比 ?? '0%'}
                      </div>
                      <div className="text-xs text-gray-600">B级词汇</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-700">
                        {evaluationResult.CEFR词汇等级.C级词汇占比 ?? '0%'}
                      </div>
                      <div className="text-xs text-gray-600">C级词汇</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {evaluationResult.CEFR词汇等级.词汇评价 ?? ''}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400">
            <FileText className="h-12 w-12 mb-3" />
            <p className="text-xs">点击"开始批改"按钮进行分析！</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreComments; 