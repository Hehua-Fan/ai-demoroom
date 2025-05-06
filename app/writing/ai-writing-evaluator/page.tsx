"use client";

import React, { useState } from "react";
import EssayContent from "../../../components/essay-content";
import ScoreComments from "../../../components/score-comments";
import SentenceAnalysis from "../../../components/sentence-analysis";
import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
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
      // ❗每次实时获取 userId
      const userId = await fetchCurrentUser();
      // const userId = "testuser1";
      if (!userId) {
        alert("未获取到用户身份，请登录平台后再使用");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/essay_evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: essayText, userId }),
      });

      if (!response.ok) throw new Error("Essay evaluation failed");

      const data = await response.json();
      setEvaluationResult(data);
    } catch (error) {
      console.error("Error evaluating essay:", error);
      alert("文章评估失败，请检查网络或稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* 背景 */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/img/background.jpg')",
          zIndex: -1
        }}
      />
      <div className="relative space-y-6 max-w-screen-xl mx-auto py-3">
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-5 flex flex-col h-full rounded-lg p-4">
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
            <div className="mt-4 p-3 bg-[#F8F8F8] rounded-lg space-y-1.5 text-xs text-gray-600">
              <p>提示：</p>
              <p>1. 快速体验不检测韵题，作文打分公式可根据校实际情况配置</p>
              <p>2. 中式英语表达不一定是错，只是母语使用频率不同</p>
            </div>
          </div>

          <div className="col-span-3 flex flex-col h-full">
            <div className="rounded-lg p-4">
              <ScoreComments evaluationResult={evaluationResult} />
            </div>
          </div>
        </div>

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
