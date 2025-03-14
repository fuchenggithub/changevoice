# 语音转文字助手

一个优雅的网页应用，支持实时语音转文字，并提供 AI 智能问答功能。采用现代化的双栏布局设计，左侧进行语音输入，右侧显示 AI 回答。

## 功能特点

### 语音识别
- 实时语音转文字功能
- 支持按住说话（鼠标或空格键）
- 自动将语音转换为文字
- 支持连续输入，自动在光标位置插入

### AI 问答
- 一键发送文字内容给 AI
- 实时显示 AI 思考过程
- 清晰展示最终答案
- 支持 Markdown 格式化显示

### 界面设计
- 现代简约的双栏布局
- 左右两栏高度一致，视觉平衡
- 响应式设计，适配移动设备
- 优雅的滚动条和动画效果

### 快捷操作
- 空格键快捷控制录音
- 一键复制文字内容
- 文本区域自动调整高度
- 智能光标位置管理

## 使用方法

1. **语音输入**
   - 按住"按住说话"按钮或按住空格键开始录音
   - 松开按钮或空格键结束录音
   - 语音将自动转换为文字显示在输入框中

2. **文字操作**
   - 点击"复制文字"按钮复制当前内容
   - 复制后文本区域会自动清空
   - 可以直接在文本框中编辑文字

3. **AI 问答**
   - 输入文字后点击"问 AI"按钮
   - 右侧会显示 AI 的思考过程
   - 最终答案会格式化显示在下方
   - 超长内容支持滚动查看

## 技术实现

- 使用原生 JavaScript 开发，无需框架依赖
- 采用 Web Speech API 进行语音识别
- 使用 Flex 布局实现响应式设计
- 集成 marked.js 处理 Markdown 格式

## 浏览器支持

- 推荐使用最新版本的 Chrome 浏览器
- 需要浏览器支持 Web Speech API
- 需要授予麦克风使用权限

## 本地开发

1. 克隆项目：
```bash
git clone https://github.com/fuchenggithub/changevoice.git
```

2. 使用 HTTP 服务器运行项目：
```bash
# 使用 Python 的简单 HTTP 服务器
python -m http.server 8000

# 或使用 Node.js 的 http-server
npx http-server
```

3. 在浏览器中访问 `http://localhost:8000`

## 注意事项

- 首次使用需要授予麦克风权限
- 建议在安静的环境中使用
- 语音识别准确度可能受环境噪音影响
- 移动端使用时注意网络状态
