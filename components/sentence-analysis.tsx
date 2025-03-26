import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageCircle } from "lucide-react";
import { EvaluationResult } from "@/types/evaluation";

interface SentenceAnalysisProps {
  evaluationResult: EvaluationResult | null;
}

const SentenceAnalysis: React.FC<SentenceAnalysisProps> = ({ evaluationResult }) => {
  if (!evaluationResult || !evaluationResult.逐句点评) return null;

  const paragraphs = evaluationResult.逐句点评 ?? {};
  
  return (
    <Card className="shadow-sm border border-[#E6F4FF] w-full">
      <CardHeader className="bg-white">
        <CardTitle className="text-xl font-semibold text-gray-800">
          逐句分析
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          {Object.entries(paragraphs).map(([paragraphNum, sentences]) => (
            <div key={paragraphNum} className="mb-6 last:mb-0">
              <h4 className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b border-gray-100">
                {paragraphNum}
              </h4>
              <div className="space-y-4">
                {Object.entries(sentences || {}).map(([sentenceNum, data]) => (
                  <div key={sentenceNum} className="border border-gray-100 rounded-lg overflow-hidden">
                    <div className="bg-white p-4">
                      {/* 原句 */}
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700 mr-2">{sentenceNum}</span>
                        {data.句子}
                      </div>

                      {/* 评论内容 */}
                      <div className="bg-yellow-50 p-4 mt-3 rounded">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageCircle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-yellow-700">错误分析</span>
                        </div>
                        <div className="space-y-1.5">
                          {data.评论.map((comment, index) => (
                            <div key={index} className="text-sm text-yellow-700">{comment}</div>
                          ))}
                        </div>
                      </div>

                      {/* 修改建议 */}
                      {data.修改建议 && (
                        <div className="bg-blue-50 p-4 mt-3 rounded">
                          <div className="flex items-center space-x-2 mb-2">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">修改建议</span>
                          </div>
                          <div className="text-sm text-blue-600">
                            {data.修改建议}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SentenceAnalysis; 