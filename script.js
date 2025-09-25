// Navigation Functions
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.add('hidden'));

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }

    // Update navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Update URL without page reload
    window.history.pushState({page: pageId}, '', `?page=${pageId}`);
}

// Initialize page from URL
function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'dashboard';
    showPage(page);
}

// API Connection Status
async function checkApiStatus() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/health');
        const data = await response.json();
        updateStatusIndicator(true, 'API Connected');
    } catch (error) {
        updateStatusIndicator(false, 'API Disconnected');
    }
}

function updateStatusIndicator(connected, message) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
        if (connected) {
            statusIndicator.className = 'w-2 h-2 bg-green-400 rounded-full animate-pulse';
            statusText.textContent = message;
        } else {
            statusIndicator.className = 'w-2 h-2 bg-red-400 rounded-full animate-pulse';
            statusText.textContent = message;
        }
    }
}

// Chat Functions
function addMessageToChat(message, sender) {
    const chatContainer = document.querySelector('.chat-container');
    if (!chatContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `flex space-x-4 ${sender === 'user' ? 'justify-end' : ''}`;

    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl rounded-tr-none px-6 py-4 max-w-3xl">
                <p>${message}</p>
            </div>
            <div class="w-10 h-10 glass rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-lg">👤</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="w-10 h-10 glass rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-lg">🤖</span>
            </div>
            <div class="bg-gradient-to-r from-zinc-700 to-zinc-800 text-white rounded-2xl rounded-tl-none px-6 py-4 max-w-3xl">
                <p>${message}</p>
            </div>
        `;
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const input = document.querySelector('.chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    addMessageToChat(message, 'user');
    input.value = '';

    try {
        const response = await fetch('http://localhost:3000/api/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        addMessageToChat(data.response, 'ai');
    } catch (error) {
        addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
    }
}

// QVB Demo Function
function runQvbDemo() {
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = "⚛️ Processing...";
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = "✅ Demo Complete";
        button.className = "bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-300";
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.className = "btn-primary px-6 py-3 rounded-lg";
        }, 2000);
    }, 3000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    checkApiStatus();
    
    // Set up chat input enter key
    const chatInput = document.querySelector('.chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Set up navigation links
    const navLinks = document.querySelectorAll('[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.dataset.page);
        });
    });
});
