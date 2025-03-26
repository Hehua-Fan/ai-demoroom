from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
import json
from get_response import agent_api
import asyncio
import html
from typing import List, Dict, Optional

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源，生产环境应该限制
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def Home():
    return {"text": "Welcome to Backend API"}

@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        prompt = data.get("prompt", "")
        history = data.get("history", [])  # 获取聊天历史，但不再直接使用
        
        logger.info(f"Received chat request with prompt (length): {len(prompt)}")
        logger.info(f"Chat history has {len(history)} messages (not used directly)")
        
        if not prompt or prompt.strip() == "":
            return JSONResponse(
                content={"text": "请输入有效的问题"},
                status_code=400
            )
            
        # 获取完整响应，传入prompt（已包含历史上下文）
        response_text = agent_api(prompt, None)  # 不再传递历史
        
        # 检查响应是否为空或无效
        if not response_text:
            response_text = "抱歉，无法获取回答。"
            
        logger.info(f"Got response of length: {len(response_text)}")
        
        # 使用生成器以流式方式发送响应
        async def stream_response():
            # 使用更小的块大小以获得更自然的流式效果
            chunk_size = 5  # 减小块大小
            
            # 确保响应文本被正确处理
            try:
                for i in range(0, len(response_text), chunk_size):
                    chunk = response_text[i:i+chunk_size]
                    # 确保只发送数据，SSE格式要求前缀为 "data: "
                    # 使用 json.dumps 确保特殊字符被正确处理
                    yield f"data: {json.dumps(chunk)}\n\n"
                    await asyncio.sleep(0.05)  # 添加一点延迟以模拟流式效果
            except Exception as e:
                logger.error(f"Error during streaming: {e}")
                # 在出错时发送错误信息
                error_msg = f"处理响应时出错: {str(e)}"
                yield f"data: {json.dumps(error_msg)}\n\n"
        
        # 使用标准的 SSE 媒体类型
        return StreamingResponse(
            stream_response(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream"
            }
        )
        
    except Exception as e:
        logger.error(f"Error handling request: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# 健康检查端点
@app.get("/health")
async def health_check():
    return {"status": "ok", "backend": "running"}

# 启动说明
# 使用以下命令启动：
# cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload