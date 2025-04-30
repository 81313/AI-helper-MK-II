// 頁面切換動畫與導航列功能
document.addEventListener('DOMContentLoaded', function() {
  // 導航列點擊事件
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      // 若已經在該頁則不重複切換
      if (this.classList.contains('active')) return;

      // 移除所有active狀態
      document.querySelectorAll('.nav-link').forEach(nav => {
        nav.classList.remove('active');
      });
      this.classList.add('active');

      // 切換頁面動畫
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      const currentSection = document.querySelector('.page-section.active');

      if (currentSection) {
        currentSection.classList.remove('active');
        currentSection.classList.add('fade-out');
        setTimeout(() => {
          currentSection.classList.remove('fade-out');
          targetSection.classList.add('active');
        }, 400);
      } else {
        targetSection.classList.add('active');
      }

      // 動態設定標題
      const pageTitles = {
        '#home-section': '首頁 | 系統名稱',
        '#chat-section': '對話框 | 系統名稱',
        '#team-section': '團隊介紹 | 系統名稱',
        '#login-section': '登入 | 系統名稱'
      };
      document.title = pageTitles[targetId] || '系統名稱';

      // URL hash同步
      history.pushState({}, '', targetId);
    });
  });

  // 處理瀏覽器返回按鈕
  window.addEventListener('popstate', function() {
    const currentHash = window.location.hash || '#home-section';
    const targetSection = document.querySelector(currentHash);

    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.remove('active', 'fade-out');
    });
    document.querySelectorAll('.nav-link').forEach(nav => {
      nav.classList.remove('active');
    });

    if (targetSection) {
      targetSection.classList.add('active');
      const nav = document.querySelector(`.nav-link[href="${currentHash}"]`);
      if (nav) nav.classList.add('active');
    }
  });

  // 首次載入時根據hash顯示正確區塊
  (function() {
    const currentHash = window.location.hash || '#home-section';
    const targetSection = document.querySelector(currentHash);
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.remove('active', 'fade-out');
    });
    document.querySelectorAll('.nav-link').forEach(nav => {
      nav.classList.remove('active');
    });
    if (targetSection) {
      targetSection.classList.add('active');
      const nav = document.querySelector(`.nav-link[href="${currentHash}"]`);
      if (nav) nav.classList.add('active');
    }
  })();

  // 亮/暗模式切換
  document.getElementById('darkModeToggle').onclick = function() {
    document.body.classList.toggle('dark-mode');
  };

  // 取得IP
  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
      document.getElementById('ip-address').textContent = data.ip;
    })
    .catch(() => {
      document.getElementById('ip-address').textContent = '取得失敗';
    });

  // 對話框功能
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const fileUpload = document.getElementById('file-upload');
  const chatHistory = document.getElementById('chat-history');

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

  function addMessage(type, content, isTemp = false) {
    // 移除臨時訊息
    if (!isTemp) {
      const tempMsg = document.getElementById('temp-msg');
      if (tempMsg) tempMsg.remove();
    }
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}-message`;
    if (isTemp) {
      msgDiv.id = 'temp-msg';
    }
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

  messageInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend();
  });
  sendBtn.addEventListener('click', handleSend);
});
