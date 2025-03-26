import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check } from "lucide-react";
import { EvaluationResult } from "@/types/evaluation";

interface EssayContentProps {
  essayText: string;
  setEssayText: (text: string) => void;
  checkSpeed: boolean;
  setCheckSpeed: (checked: boolean) => void;
  checkConsistency: boolean;
  setCheckConsistency: (checked: boolean) => void;
  scoreSystem: string;
  setScoreSystem: (value: string) => void;
  isLoading: boolean;
  onEvaluate: () => void;
  evaluationResult: EvaluationResult | null;
}

const getLevelColor = (level: string) => {
  const colors = {
    'A1': 'text-[#9BA7AF]',
    'A2': 'text-[#077015]',
    'B1': 'text-[#0072E4]',
    'B2': 'text-[#710882]',
    'C1': 'text-[#D4AC0D]',
    'C2': 'text-[#DE682C]',
    'other': 'text-black'
  } as const;
  
  return colors[level as keyof typeof colors] || colors.other;
};

const ColorCodedText: React.FC<{ text: string; evaluationResult: EssayContentProps['evaluationResult'] }> = ({ text, evaluationResult }) => {
  const [copied, setCopied] = React.useState(false);

  console.log('ColorCodedText 渲染:', {
    hasEvaluationResult: !!evaluationResult,
    hasCEFRData: !!evaluationResult?.CEFR词汇等级,
    C1Words: evaluationResult?.CEFR词汇等级?.作文中使用到的C1词汇,
    text: text
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 清理单词，去除标点符号
  const cleanWord = (word: string) => {
    return word.toLowerCase().replace(/[.,!?;:"']/g, '');
  };

  // 创建词汇级别映射
  const wordLevelMap = React.useMemo(() => {
    if (!evaluationResult?.CEFR词汇等级) {
      console.log('没有CEFR词汇等级数据');
      return new Map<string, string>();
    }
    
    const map = new Map<string, string>();
    const processedWords = new Set<string>();
    
    console.log('开始构建词汇映射表');
    console.log('C1词汇列表:', evaluationResult.CEFR词汇等级.作文中使用到的C1词汇);
    
    // 按照从高到低的顺序添加词汇，确保高级词汇优先级更高
    const wordLevels: [string, string[]][] = [
      ['C2', evaluationResult.CEFR词汇等级.作文中使用到的C2词汇],
      ['C1', evaluationResult.CEFR词汇等级.作文中使用到的C1词汇],
      ['B2', evaluationResult.CEFR词汇等级.作文中使用到的B2词汇],
      ['B1', evaluationResult.CEFR词汇等级.作文中使用到的B1词汇],
      ['A2', evaluationResult.CEFR词汇等级.作文中使用到的A2词汇],
      ['A1', evaluationResult.CEFR词汇等级.作文中使用到的A1词汇],
    ];

    wordLevels.forEach(([level, words]) => {
      words.forEach((word: string) => {
        const key = cleanWord(word);
        // 只有当这个词还没有被处理过时才添加到映射表中
        if (!processedWords.has(key)) {
          map.set(key, level);
          processedWords.add(key);
          console.log(`映射${level}词汇: ${word} (${key}) -> ${level}`);
        }
      });
    });
    
    console.log('词汇映射表构建完成:', Object.fromEntries(map));
    
    return map;
  }, [evaluationResult]);

  return (
    <div className="relative min-h-[200px] p-4 border rounded-md border-[#E6F4FF] bg-white">
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="space-y-6 mt-8 mb-12">
        {text.split('\n').map((paragraph, i) => (
          <p key={i} className="text-sm">
            {paragraph.split(/([.,!?;:"'\s]+)/).map((word, j) => {
              if (!word.trim()) return word;
              const cleanedWord = cleanWord(word);
              const level = wordLevelMap.get(cleanedWord) || 'other';
              console.log(`单词处理: "${word}" (${cleanedWord}) → ${level}`);
              return (
                <span key={j} className={`${getLevelColor(level)}`}>
                  {word}
                </span>
              );
            })}
          </p>
        ))}
      </div>
      <div className="absolute bottom-2 right-2">
        <div className="flex items-center justify-center rounded-lg border px-3 py-1 text-sm font-semibold">
          <div className="flex flex-row gap-3 text-center">
            <span className="text-black">-∞</span>
            <span className="text-[#9BA7AF]">A1</span>
            <span className="text-[#077015]">A2</span>
            <span className="text-[#0072E4]">B1</span>
            <span className="text-[#710882]">B2</span>
            <span className="text-[#D4AC0D]">C1</span>
            <span className="text-[#DE682C]">C2</span>
            <span className="text-[#CB0752]">+∞</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EssayContent: React.FC<EssayContentProps> = ({
  essayText,
  setEssayText,
  checkSpeed,
  setCheckSpeed,
  checkConsistency,
  setCheckConsistency,
  scoreSystem,
  setScoreSystem,
  isLoading,
  onEvaluate,
  evaluationResult,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    if (evaluationResult && !isLoading) {
      setIsEditing(false);
    }
  }, [evaluationResult, isLoading]);

  const handleEvaluate = () => {
    if (evaluationResult && !isEditing) {
      setIsEditing(true);
    } else {
      onEvaluate();
    }
  };

  const shouldShowColoredText = evaluationResult && !isEditing && !isLoading;

  return (
    <Card className="shadow-sm border border-[#E6F4FF]">
      <CardHeader className="bg-white">
        <CardTitle className="text-xl font-semibold text-gray-800">
          作文内容
        </CardTitle>
      </CardHeader>
      <CardContent>
        {shouldShowColoredText ? (
          <ColorCodedText text={essayText} evaluationResult={evaluationResult} />
        ) : (
          <Textarea
            placeholder="请输入您的文章内容..."
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            className="min-h-[200px] border-[#E6F4FF] text-sm"
            disabled={isLoading}
          />
        )}
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <label className="flex items-center space-x-2">
              <Checkbox 
                checked={checkSpeed}
                onCheckedChange={(checked: boolean) => setCheckSpeed(checked)}
                disabled={isLoading}
              />
              <span>检查语速动词</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={checkConsistency}
                onCheckedChange={(checked: boolean) => setCheckConsistency(checked)}
                disabled={isLoading}
              />
              <span>检查语态一致</span>
            </label>
            
            <span className="text-[#00A0E9] cursor-pointer">知识点定制</span>
            
            <div className="flex items-center space-x-2">
              <span>分制:</span>
              <Select value={scoreSystem} onValueChange={setScoreSystem} disabled={isLoading}>
                <SelectTrigger className="w-[80px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100分制</SelectItem>
                  <SelectItem value="25">25分制</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleEvaluate}
            disabled={isLoading || !essayText.trim()}
            className="w-full bg-[#706eff] hover:bg-[#5a58cc] text-white shadow-sm transition-all duration-200 h-8 text-sm"
          >
            {isLoading ? "正在批改..." : (shouldShowColoredText ? "重新批改" : "开始批改")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EssayContent; 