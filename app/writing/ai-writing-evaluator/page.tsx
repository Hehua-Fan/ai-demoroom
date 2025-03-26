"use client";

import React, { useState } from "react";
import EssayContent from "../../../components/essay-content";
import ScoreComments from "../../../components/score-comments";
import SentenceAnalysis from "../../../components/sentence-analysis";
import { EvaluationResult } from "@/types/evaluation";

const EssayEvaluator: React.FC = () => {
  const [essayText, setEssayText] = useState<string>("");
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkSpeed, setCheckSpeed] = useState(false);
  const [checkConsistency, setCheckConsistency] = useState(false);
  const [scoreSystem, setScoreSystem] = useState("100");

  const evaluateEssay = async () => {
    if (!essayText.trim()) {
      alert("请输入文章内容");
      return;
    }

    setIsLoading(true);
    try {
      console.log('发送评估请求:', { text: essayText });
      
      const response = await fetch("/api/essay_evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: essayText,
        }),
      });

      if (!response.ok) {
        throw new Error("Essay evaluation request failed");
      }

      const data = await response.json();
      console.log('收到评估结果:', data);
      
      setEvaluationResult(data);
      console.log('设置评估结果后的状态:', { evaluationResult: data });
    } catch (error) {
      console.error("Error evaluating essay:", error);
      alert("文章评估失败，请检查网络或稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/img/background.jpg')",
          zIndex: -1
        }}
      />
      <div className="relative space-y-6 max-w-screen-xl mx-auto py-3">
        {/* 上：左右两栏 */}
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-5 flex flex-col h-full rounded-lg p-4">
            {/* 左侧内容 */}
            <EssayContent
              essayText={essayText}
              setEssayText={setEssayText}
              checkSpeed={checkSpeed}
              setCheckSpeed={setCheckSpeed}
              checkConsistency={checkConsistency}
              setCheckConsistency={setCheckConsistency}
              scoreSystem={scoreSystem}
              setScoreSystem={setScoreSystem}
              isLoading={isLoading}
              onEvaluate={evaluateEssay}
              evaluationResult={evaluationResult}
            />
            
            {/* 提示信息 */}
            <div className="mt-4 p-3 bg-[#F8F8F8] rounded-lg space-y-1.5 text-xs text-gray-600">
              <p>提示：</p>
              <p>1. 快速体验不检测韵题，批改网作文打分公式可根据校实际情况配置</p>
              <p>2. 中式英语指的是在英语母语用户很少使用的表达，如一些中国特色的表达改革开放等，不一定就是错的</p>
              <p>3. 批改网的评分原理是测量作文和语料库之间的距离，所以一些请如莎士比亚的戏曲作品或者古英语小说，有可能得不了高分</p>
              <p>4. 测试作文只支持500单词，超过500单词请注册登录使用</p>
            </div>
          </div>

          <div className="col-span-3 flex flex-col h-full">
            {/* 右侧评分展示 */}
            <div className=" rounded-lg p-4">
              <ScoreComments evaluationResult={evaluationResult} />
            </div>
          </div>
        </div>

        {/* 下：逐句点评（完整宽度） */}
        {evaluationResult && (
          <div className="rounded-lg p-4">
            <SentenceAnalysis evaluationResult={evaluationResult} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EssayEvaluator;