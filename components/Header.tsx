"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  NotebookPen,
  BarChart,
  Image as ImageIcon,
  FileText,
  FolderTree,
  ScrollText,
  LineChart,
  Bot,
  Stethoscope,
  ImagePlus,
  PenTool,
  Code2,
  Terminal,
  Globe,
  Box,
} from "lucide-react";

type TranslationKeys =
  | "Writing"
  | "Data Analysis"
  | "AI Service"
  | "Multimodal"
  | "Code"
  | "Essay Evaluation"
  | "Document Writing"
  | "Directory Writing"
  | "Long Article"
  | "Financial Report"
  | "Medical Assistant"
  | "Text to Image"
  | "Image Writing"
  | "Code Assistant"
  | "Web Generator"
  | "Sandbox";

const translations: Record<TranslationKeys, string> = {
  "Writing": "写作类",
  "Data Analysis": "数据分析类",
  "AI Service": "智能客服类",
  "Multimodal": "多模态类",
  "Code": "代码类",
  "Essay Evaluation": "作文批改",
  "Document Writing": "文档写作",
  "Directory Writing": "目录写作",
  "Long Article": "长文章写作",
  "Financial Report": "金融财报分析",
  "Medical Assistant": "医疗问诊助手",
  "Text to Image": "文生图",
  "Image Writing": "看图写作",
  "Code Assistant": "代码助手",
  "Web Generator": "一键生成网页",
  "Sandbox": "沙盒环境"
};

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      name: "Writing",
      path: "/writing",
      icon: NotebookPen,
      subItems: [
        { name: "Essay Evaluation", path: "/writing/ai-writing-evaluator", icon: NotebookPen },
        { name: "Document Writing", path: "/writing/document", icon: FileText },
        { name: "Directory Writing", path: "/writing/directory", icon: FolderTree },
        { name: "Long Article", path: "/writing/long-article", icon: ScrollText },
      ],
    },
    {
      name: "Data Analysis",
      path: "/data-analysis",
      icon: BarChart,
      subItems: [
        { name: "Financial Report", path: "/data-analysis/financial-report", icon: LineChart },
      ],
    },
    {
      name: "AI Service",
      path: "/ai-service",
      icon: Bot,
      subItems: [
        { name: "Medical Assistant", path: "/ai-service/medical-assistant", icon: Stethoscope },
      ],
    },
    {
      name: "Multimodal",
      path: "/multimodal",
      icon: ImageIcon,
      subItems: [
        { name: "Text to Image", path: "/multimodal/text-to-image", icon: ImagePlus },
        { name: "Image Writing", path: "/multimodal/image-writing", icon: PenTool },
      ],
    },
    {
      name: "Code",
      path: "/code",
      icon: Code2,
      subItems: [
        { name: "Code Assistant", path: "/code/assistant", icon: Terminal },
        { name: "Web Generator", path: "/code/web-generator", icon: Globe },
        { name: "Sandbox", path: "/code/sandbox", icon: Box },
      ],
    },
  ];

  const handleTabClick = (path: string) => {
    setActiveMenu(null);
    router.push(path);
  };

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="flex items-center justify-between px-12 py-4 bg-white shadow-sm">
      <Link href="/" className="flex items-center">
        <Image
          src="/img/logo.png"
          alt="Logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      </Link>

      <nav className="flex-1 flex justify-center" ref={navRef}>
        <div className="flex bg-gray-50 rounded-lg">
          {menuItems.map((item) => (
            <div key={item.name} className="relative">
              <button
                className={`flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-all duration-300 ease-in-out transform cursor-pointer ${
                  pathname.includes(item.path)
                    ? "text-white bg-[#706eff] shadow-md"
                    : "text-gray-700 hover:text-[#706eff] hover:bg-blue-50"
                }`}
                onClick={() => item.subItems ? toggleMenu(item.name) : handleTabClick(item.path)}
              >
                <div className="flex items-center space-x-[0.5px]">
                  <item.icon
                    className={`inline-block w-4 h-4 mr-2 align-middle ${
                      pathname.includes(item.path) ? "scale-110" : ""
                    }`}
                  />
                  <span className="align-middle">
                    {translations[item.name as TranslationKeys]}
                  </span>
                  {item.subItems && (
                    <ChevronDown
                      className={`ml-3 w-4 h-4 transition-transform duration-200 ${
                        activeMenu === item.name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>
              </button>

              {item.subItems && (
                <div
                  className={`absolute left-0 mt-1 py-2 w-48 bg-white rounded-lg shadow-lg z-20 ${
                    activeMenu === item.name ? "block" : "hidden"
                  }`}
                >
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.name}
                      className={`flex items-center w-full px-4 py-3 text-sm cursor-pointer ${
                        pathname === subItem.path
                          ? "text-[#706eff] bg-blue-50"
                          : "text-gray-700 hover:text-[#706eff] hover:bg-blue-50"
                      } transition-colors duration-200`}
                      onClick={() => handleTabClick(subItem.path)}
                    >
                      <subItem.icon className="w-4 h-4 mr-2" />
                      {translations[subItem.name as TranslationKeys]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;