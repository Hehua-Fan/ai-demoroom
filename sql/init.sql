-- MySQL版
CREATE TABLE english_writing_review (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  user_id VARCHAR(255) NOT NULL COMMENT '用户ID或邮箱',
  essay_text TEXT NOT NULL COMMENT '用户提交的原始作文内容',
  review_json JSON NOT NULL COMMENT '批改后的完整JSON结果',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='英语作文评估记录表';

-- OceanBase版
CREATE TABLE english_writing_review (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  user_id VARCHAR(255) NOT NULL COMMENT '用户ID或平台身份标识',
  essay_text TEXT NOT NULL COMMENT '用户提交的作文内容',
  review_json TEXT NOT NULL COMMENT '完整评估结果（JSON字符串）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI英语作文批改记录表（兼容版）';