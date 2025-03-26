#!/bin/bash

# 确保在backend目录中
cd "$(dirname "$0")"

# 启动后端服务
echo "启动后端服务，访问 http://localhost:8000"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload 