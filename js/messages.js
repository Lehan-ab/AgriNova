document.addEventListener('DOMContentLoaded', () => {
    // Add realistic mock messaging behaviors
    const sendBtn = document.getElementById('sendBtn');
    const msgInput = document.getElementById('messageInput');
    const chatWindow = document.getElementById('chatWindow');
    const quickChips = document.querySelectorAll('.quick-chip');

    // Mobile Navigation logic
    const chatSidebar = document.getElementById('chatSidebar');
    const chatArea = document.getElementById('chatArea');
    const backBtn = document.getElementById('backToListBtn');

    // Setup mobile view toggle
    if (window.innerWidth < 768) {
        chatArea.classList.add('hidden');
    }

    // Open chat when a conversation is clicked on mobile
    const conversations = document.querySelectorAll('#conversationList > div');
    conversations.forEach(conv => {
        conv.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                chatSidebar.classList.add('hidden');
                chatArea.classList.remove('hidden');
                chatArea.classList.add('flex');
            }
        });
    });

    // Back to list on mobile
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            chatArea.classList.add('hidden');
            chatArea.classList.remove('flex');
            chatSidebar.classList.remove('hidden');
        });
    }

    function appendMessage(text, isSent) {
        const div = document.createElement('div');
        div.className = `flex items-end gap-2 fade-in ${isSent ? 'justify-end' : ''}`;

        let innerHtml = '';
        if (isSent) {
            innerHtml = `
                <div class="bg-primary text-white p-3 rounded-2xl rounded-br-sm max-w-[75%] shadow-sm text-sm">
                    ${text}
                </div>
            `;
        } else {
            innerHtml = `
                <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600 shrink-0 mb-1">G</div>
                <div class="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm max-w-[75%] shadow-sm text-sm text-gray-800">
                    ${text}
                </div>
            `;
        }

        div.innerHTML = innerHtml;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function sendMessage() {
        const text = msgInput.value.trim();
        if (text) {
            appendMessage(text, true);
            msgInput.value = '';

            // Auto response mock
            setTimeout(() => {
                appendMessage("Thanks for your message! I will review and reply shortly.", false);
            }, 1000);
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (msgInput) {
        msgInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Quick chips behavior
    quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
            msgInput.value = chip.textContent;
            msgInput.focus();
        });
    });
});
