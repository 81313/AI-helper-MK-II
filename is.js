// 頁面切換功能
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(page => {
      page.classList.remove('active');
    });
    document.querySelectorAll('.nav-links a').forEach(nav => {
      nav.classList.remove('active');
    });
    document.getElementById(pageId + '-section').classList.add('active');
    document.getElementById('nav-' + pageId).classlist.add('active');
  }
  
  // 亮暗模式切換
  document.getElementById('darkModeToggle').onclick = function() {
    document.body.classList.toggle('dark-mode');
  };
  
  // IP取得功能
  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
      document.getElementById('ip-address').textContent = data.ip;
    });
  
  // 對話框功能
  document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const fileUpload = document.getElementById('file-upload');
    const chatHistory = document.getElementById('chat-history');
  
    // 訊息發送功能
    function handleSend() {
      const message = messageInput.value.trim();
      if (message) {
        addMessage('user', message);
        messageInput.value = '';
        addMessage('system', '請稍等', true);
        setTimeout(() => {
          addMessage('system', `${getCurrentTime()} 發生錯誤，請重新確認內容`);
        }, 500);
      }
    }
  
    // 檔案上傳處理
    fileUpload.addEventListener('change', function(e) {
      if (e.target.files[0]) {
        const file = e.target.files[0];
        const isValid = file.name.endsWith('.docx') || file.name.endsWith('.csv');
        addMessage('system', `檔案檢測: ${file.name}`, true);
        setTimeout(() => {
          addMessage('system', isValid ? 
            `${getCurrentTime()} 「${file.name}」 上傳成功` : 
            `${getCurrentTime()} 發生錯誤，請重新確認內容`);
        }, 500);
      }
    });
  
    // 輔助函式
    function addMessage(type, content, isTemp = false) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message ${type}-message`;
      msgDiv.innerHTML = content;
      if (!isTemp) {
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = type === 'system' ? '' : getCurrentTime();
        msgDiv.appendChild(timestamp);
      }
      chatHistory.appendChild(msgDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  
    function getCurrentTime() {
      const now = new Date();
      return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    }
  
    // 事件監聽
    messageInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSend();
    });
    sendBtn.addEventListener('click', handleSend);
  });
  