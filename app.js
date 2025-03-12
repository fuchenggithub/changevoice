// DOM 元素
const recordButton = document.getElementById('recordButton');
const textDisplay = document.getElementById('textDisplay');
const copyButton = document.getElementById('copyButton');
const askAIButton = document.getElementById('askAIButton');
const aiResponse = document.getElementById('aiResponse');
const aiContent = aiResponse.querySelector('.ai-content');
const thinkingProcess = aiResponse.querySelector('.thinking-process');
const thinkingContent = aiResponse.querySelector('.thinking-content');
const finalAnswer = aiResponse.querySelector('.final-answer');

// 语音识别设置
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false; // 改为非连续模式
recognition.interimResults = false; // 只返回最终结果
recognition.lang = 'zh-CN';
recognition.maxAlternatives = 1; // 只返回最可能的结果

let isRecording = false;
let currentTranscript = ''; // 用于存储当前识别的文本
let isSpaceKeyPressed = false; // 用于跟踪空格键状态

// 初始化
function init() {
    // 检查浏览器支持
    if (!SpeechRecognition) {
        alert('您的浏览器不支持语音识别功能，请使用最新版本的 Chrome 浏览器。');
        recordButton.disabled = true;
        return;
    }

    // 设置事件监听器
    setupEventListeners();
}

// 设置事件监听器
function setupEventListeners() {
    // 录音按钮事件
    recordButton.addEventListener('mousedown', startRecording);
    recordButton.addEventListener('mouseup', stopRecording);
    recordButton.addEventListener('mouseleave', stopRecording);
    
    // 移动设备触摸事件
    recordButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startRecording();
    });
    recordButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopRecording();
    });

    // 键盘事件
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // 复制按钮事件
    copyButton.addEventListener('click', copyText);
    
    // AI 问答按钮事件
    askAIButton.addEventListener('click', askAI);

    // 语音识别事件
    recognition.addEventListener('result', handleRecognitionResult);
    recognition.addEventListener('error', handleRecognitionError);
    recognition.addEventListener('end', handleRecognitionEnd);

    // 自动调整文本框高度
    textDisplay.addEventListener('input', adjustTextareaHeight);

    // 窗口失焦时停止录音
    window.addEventListener('blur', stopRecording);
}

// 处理键盘按下事件
function handleKeyDown(event) {
    // 如果是空格键且未处于录音状态
    if (event.code === 'Space' && !isSpaceKeyPressed && !event.repeat && document.activeElement !== textDisplay) {
        event.preventDefault(); // 阻止页面滚动
        isSpaceKeyPressed = true;
        startRecording();
    }
}

// 处理键盘松开事件
function handleKeyUp(event) {
    // 如果是空格键且正在录音
    if (event.code === 'Space' && isSpaceKeyPressed) {
        event.preventDefault();
        isSpaceKeyPressed = false;
        stopRecording();
    }
}

// 开始录音
function startRecording() {
    if (isRecording) return;
    
    isRecording = true;
    recordButton.classList.add('recording');
    recordButton.innerHTML = `
        <svg class="mic-icon" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
        <span class="button-text">
            正在录音...
            <small class="shortcut-hint">[空格键]</small>
        </span>
    `;
    
    currentTranscript = ''; // 重置当前识别的文本
    
    try {
        recognition.start();
    } catch (error) {
        console.error('语音识别启动失败:', error);
        stopRecording();
    }
}

// 停止录音
function stopRecording() {
    if (!isRecording) return;
    
    isRecording = false;
    recordButton.classList.remove('recording');
    recordButton.innerHTML = `
        <svg class="mic-icon" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
        <span class="button-text">
            按住说话
            <small class="shortcut-hint">[空格键]</small>
        </span>
    `;
    
    try {
        recognition.stop();
    } catch (error) {
        console.error('语音识别停止失败:', error);
    }
}

// 处理语音识别结果
function handleRecognitionResult(event) {
    if (!event.results || !event.results.length) return;

    const result = event.results[event.results.length - 1];
    if (!result.isFinal) return; // 只处理最终结果

    const transcript = result[0].transcript.trim();
    if (!transcript) return;

    // 在当前光标位置插入文字
    const cursorPosition = textDisplay.selectionStart;
    const currentText = textDisplay.value;
    const beforeText = currentText.substring(0, cursorPosition);
    const afterText = currentText.substring(cursorPosition);
    
    textDisplay.value = beforeText + transcript + afterText;
    
    // 更新光标位置
    const newPosition = cursorPosition + transcript.length;
    textDisplay.setSelectionRange(newPosition, newPosition);
    textDisplay.focus(); // 保持焦点在文本框
    
    // 调整文本框高度
    adjustTextareaHeight();
}

// 处理语音识别结束
function handleRecognitionEnd() {
    if (isRecording) {
        // 如果仍在录音状态，则重新开始录音
        try {
            recognition.start();
        } catch (error) {
            console.error('语音识别重新启动失败:', error);
            stopRecording();
        }
    }
}

// 处理语音识别错误
function handleRecognitionError(event) {
    console.error('语音识别错误:', event.error);
    stopRecording();
    
    // 显示错误提示
    if (event.error === 'no-speech') {
        alert('没有检测到语音，请重试。');
    } else if (event.error === 'audio-capture') {
        alert('无法访问麦克风，请确保已授予麦克风权限。');
    } else if (event.error === 'not-allowed') {
        alert('麦克风权限被拒绝，请在浏览器设置中允许访问麦克风。');
    } else {
        alert('语音识别出错，请重试。');
    }
}

// 复制文字
async function copyText() {
    const text = textDisplay.value.trim();
    if (!text) {
        alert('没有可复制的文字');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        const originalText = copyButton.textContent;
        copyButton.textContent = '已复制！';
        
        // 清空文本
        textDisplay.value = '';
        adjustTextareaHeight();
        
        setTimeout(() => {
            copyButton.innerHTML = `
                <svg class="button-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                复制文字
            `;
        }, 2000);
    } catch (err) {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    }
}

// 调用 AI 回答
async function askAI() {
    const text = textDisplay.value.trim();
    if (!text) {
        alert('请先录入一些文字');
        return;
    }

    // 显示 AI 回答区域和思考过程
    aiResponse.classList.remove('hidden');
    thinkingProcess.classList.remove('hidden');
    finalAnswer.classList.add('hidden');
    thinkingContent.textContent = '正在思考...';
    
    try {
        const response = await fetch('/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            throw new Error('AI 服务响应失败');
        }

        const data = await response.json();
        
        // 显示思考过程
        if (data.thinking_process) {
            thinkingContent.textContent = data.thinking_process;
        } else {
            thinkingProcess.classList.add('hidden');
        }

        // 显示最终答案
        finalAnswer.classList.remove('hidden');
        aiContent.innerHTML = marked.parse(data.response);
    } catch (error) {
        console.error('AI 回答出错:', error);
        thinkingProcess.classList.add('hidden');
        finalAnswer.classList.remove('hidden');
        aiContent.textContent = '抱歉，AI 回答出现错误，请稍后再试。';
    }
}

// 自动调整文本框高度
function adjustTextareaHeight() {
    textDisplay.style.height = 'auto';
    textDisplay.style.height = Math.max(200, textDisplay.scrollHeight) + 'px';
}

// 初始化应用
init(); 