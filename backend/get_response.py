import requests
import os
from dotenv import load_dotenv
import logging
from typing import List, Dict, Optional, Any
import json

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 加载环境变量
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env.local'))

# 从环境变量中获取配置
UUID = os.getenv("UUID")
AUTH_KEY = os.getenv("AUTH_KEY")
AUTH_SECRET = os.getenv("AUTH_SECRET")
PLATFORM = os.getenv("PLATFORM")

AUTOAGENTS_HOST_NAME = {
    "uat": "https://uat.agentspro.cn",
    "test": "https://test.agentspro.cn",
    "lingda": "https://lingda.agentspro.cn"
}

def agent_api(query: str, history: Optional[List[Dict[str, str]]] = None):
    """
    从API获取完整响应文本
    
    Args:
        query (str): 用户输入的问题（已经包含历史上下文）
        history (List[Dict[str, str]], optional): 聊天历史，不再使用
        
    Returns:
        str: API返回的完整响应文本
    """
    logger.info(f"Getting response for query (length): {len(query)}")
    if history:
        logger.info(f"With history of {len(history)} messages (not used directly)")
    
    # Step 1: 选择一个平台：uat、test、lingda
    if PLATFORM not in AUTOAGENTS_HOST_NAME:
        logger.error(f"Unsupported platform: {PLATFORM}")
        return f"Unsupported platform: {PLATFORM}"
    
    # Step 2: 准备请求体
    url = f"{AUTOAGENTS_HOST_NAME[PLATFORM]}/openapi/agent/chat/completions/v1"
    headers = {
        "Authorization": f"Bearer {AUTH_KEY}.{AUTH_SECRET}",
        "Content-Type": "application/json"
    }
    
    # 准备请求体 - 使用前端已格式化的提示，不再尝试传递历史
    body: Dict[str, Any] = {
        "agentId": UUID,
        "chatId": None,
        "userChatInput": query,
    }

    logger.info(f"Sending request to: {url}")
    logger.info(f"Full request body length: {len(json.dumps(body))}")
    
    try:
        # 发送POST请求
        response = requests.post(url, headers=headers, json=body, timeout=30)

        # 检查响应状态码
        if response.status_code == 200:
            try: 
                # 尝试将响应解析为JSON
                json_response = response.json()
                logger.info(f"Raw response received")
                result = json_response["choices"][0]["content"]
                logger.info(f"Successfully got response of length: {len(result)}")
                return result
            except (ValueError, KeyError, IndexError) as e:  
                # 处理各种解析错误
                error_msg = f"Failed to parse response: {str(e)}"
                logger.error(error_msg)
                logger.error(f"Raw response: {response.text}")
                return f"Error: {error_msg}"
        else:
            error_msg = f"Request failed with status code {response.status_code}"
            logger.error(error_msg)
            logger.error(f"Response: {response.text}")
            return f"Error: {error_msg}"
            
    except requests.exceptions.RequestException as e:
        error_msg = f"Request exception: {str(e)}"
        logger.error(error_msg)
        return f"Error: {error_msg}"
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        logger.error(error_msg)
        return f"Error: {error_msg}"


if __name__ == "__main__":
    # 本地测试代码
    test_query = "leetcode 1 solution"
    response = agent_api(test_query)
    print(response)