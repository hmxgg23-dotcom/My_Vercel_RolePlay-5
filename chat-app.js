// AI Chat Application with Puter.js v2 Integration

const state = {
    provider: 'puter',
    modelId: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    topK: 40,
    promptTemplate: 'chatml',
    messages: [],
    isLoading: false
};

// DOM Elements
const elements = {
    providerSelect: document.getElementById('providerSelect'),
    modelInput: document.getElementById('modelInput'),
    fetchModelsBtn: document.getElementById('fetchModelsBtn'),
    modelsList: document.getElementById('modelsList'),
    puterStatus: document.getElementById('puterStatus'),
    puterUsername: document.getElementById('puterUsername'),
    temperature: document.getElementById('temperature'),
    maxTokens: document.getElementById('maxTokens'),
    topP: document.getElementById('topP'),
    topK: document.getElementById('topK'),
    promptTemplate: document.getElementById('promptTemplate'),
    tempValue: document.getElementById('tempValue'),
    maxTokensValue: document.getElementById('maxTokensValue'),
    topPValue: document.getElementById('topPValue'),
    topKValue: document.getElementById('topKValue'),
    topPGroup: document.getElementById('topPGroup'),
    topKGroup: document.getElementById('topKGroup'),
    promptTemplateGroup: document.getElementById('promptTemplateGroup'),
    chatContainer: document.getElementById('chatContainer'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    clearChatBtn: document.getElementById('clearChatBtn')
};

// Initialize the application
function init() {
    setupEventListeners();
    updateProviderUI();
    loadSavedState();
}

// Setup all event listeners
function setupEventListeners() {
    // Provider selection
    elements.providerSelect.addEventListener('change', (e) => {
        state.provider = e.target.value;
        updateProviderUI();
        saveState();
    });

    // Model input
    elements.modelInput.addEventListener('input', (e) => {
        state.modelId = e.target.value;
        saveState();
    });

    // Fetch models button
    elements.fetchModelsBtn.addEventListener('click', fetchModels);

    // Generation parameters
    elements.temperature.addEventListener('input', (e) => {
        state.temperature = parseFloat(e.target.value);
        elements.tempValue.textContent = state.temperature;
        saveState();
    });

    elements.maxTokens.addEventListener('input', (e) => {
        state.maxTokens = parseInt(e.target.value);
        elements.maxTokensValue.textContent = state.maxTokens;
        saveState();
    });

    elements.topP.addEventListener('input', (e) => {
        state.topP = parseFloat(e.target.value);
        elements.topPValue.textContent = state.topP;
        saveState();
    });

    elements.topK.addEventListener('input', (e) => {
        state.topK = parseInt(e.target.value);
        elements.topKValue.textContent = state.topK;
        saveState();
    });

    elements.promptTemplate.addEventListener('change', (e) => {
        state.promptTemplate = e.target.value;
        saveState();
    });

    // Send message
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Clear chat
    elements.clearChatBtn.addEventListener('click', clearChat);

    // Auto-resize textarea
    elements.messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

// Update UI based on selected provider
async function updateProviderUI() {
    const isPuter = state.provider === 'puter';

    // Show/hide unsupported settings for Puter
    elements.topPGroup.classList.toggle('hidden', isPuter);
    elements.topKGroup.classList.toggle('hidden', isPuter);
    elements.promptTemplateGroup.classList.toggle('hidden', isPuter);

    // Show/hide Puter status
    if (isPuter) {
        elements.puterStatus.classList.remove('hidden');
        await checkPuterAuth();
    } else {
        elements.puterStatus.classList.add('hidden');
    }

    // Update fetch models button visibility
    elements.fetchModelsBtn.style.display = isPuter ? 'block' : 'none';
}

// Check Puter authentication status
async function checkPuterAuth() {
    if (typeof puter === 'undefined') {
        elements.puterUsername.textContent = 'SDK not loaded';
        return;
    }

    try {
        const user = await puter.auth.getUser();
        if (user && user.username) {
            elements.puterUsername.textContent = `Connected as ${user.username}`;
        } else {
            elements.puterUsername.textContent = 'Not signed in';
        }
    } catch (error) {
        console.error('Auth check error:', error);
        elements.puterUsername.textContent = 'Not signed in';
    }
}

// Fetch available models from Puter
async function fetchModels() {
    if (typeof puter === 'undefined') {
        alert('Puter SDK is not loaded');
        return;
    }

    elements.fetchModelsBtn.disabled = true;
    elements.fetchModelsBtn.textContent = 'Fetching...';

    try {
        const models = await puter.ai.listModels();
        console.log('Available models:', models);

        displayModelsList(models);

        elements.fetchModelsBtn.textContent = 'Fetch Available Models';
    } catch (error) {
        console.error('Error fetching models:', error);
        alert('Failed to fetch models: ' + error.message);
        elements.fetchModelsBtn.textContent = 'Fetch Available Models';
    } finally {
        elements.fetchModelsBtn.disabled = false;
    }
}

// Display models list
function displayModelsList(models) {
    elements.modelsList.innerHTML = '';

    if (!models || models.length === 0) {
        elements.modelsList.innerHTML = '<div style="padding: 12px; color: #94a3b8;">No models available</div>';
        elements.modelsList.classList.remove('hidden');
        return;
    }

    models.forEach(model => {
        const modelId = typeof model === 'string' ? model : (model.id || model.name || 'Unknown');
        const modelDiv = document.createElement('div');
        modelDiv.className = 'model-item';
        modelDiv.textContent = modelId;
        modelDiv.addEventListener('click', () => {
            elements.modelInput.value = modelId;
            state.modelId = modelId;
            elements.modelsList.classList.add('hidden');
            saveState();
        });
        elements.modelsList.appendChild(modelDiv);
    });

    elements.modelsList.classList.remove('hidden');
}

// Send message
async function sendMessage() {
    const content = elements.messageInput.value.trim();
    if (!content || state.isLoading) return;

    // Add user message to chat
    addMessage('user', content);
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';

    // Disable send button
    state.isLoading = true;
    elements.sendBtn.disabled = true;
    elements.sendBtn.textContent = 'Sending...';

    try {
        let response;

        if (state.provider === 'puter') {
            response = await sendPuterMessage(content);
        } else {
            response = await sendGenericMessage(content);
        }

        addMessage('assistant', response);
    } catch (error) {
        console.error('Error sending message:', error);
        addMessage('assistant', `Error: ${error.message}`);
    } finally {
        state.isLoading = false;
        elements.sendBtn.disabled = false;
        elements.sendBtn.textContent = 'Send';
    }
}

// Send message via Puter
async function sendPuterMessage(content) {
    if (typeof puter === 'undefined') {
        throw new Error('Puter SDK is not loaded');
    }

    // Check authentication
    if (!puter.auth.isSignedIn()) {
        await puter.auth.signIn();
        await checkPuterAuth();
    }

    // Build messages array for context
    const messages = [
        ...state.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        })),
        { role: 'user', content: content }
    ];

    // Send request to Puter AI
    const result = await puter.ai.chat(messages, {
        model: state.modelId || 'gpt-4o',
        temperature: state.temperature,
        max_tokens: state.maxTokens
    });

    // Extract response text
    if (typeof result === 'string') {
        return result;
    } else if (result.message && result.message.content) {
        return result.message.content;
    } else if (result.content) {
        return result.content;
    } else {
        return String(result);
    }
}

// Send message via generic API (placeholder for other providers)
async function sendGenericMessage(content) {
    // This is a placeholder for OpenAI/Anthropic/Custom implementations
    // In a real app, you would implement the actual API calls here

    throw new Error(`${state.provider} provider is not yet implemented. Please use Puter for now.`);
}

// Add message to chat
function addMessage(role, content) {
    const message = { role, content, timestamp: Date.now() };
    state.messages.push(message);

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? 'U' : 'AI';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);

    elements.chatContainer.appendChild(messageDiv);
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;

    saveState();
}

// Clear chat history
function clearChat() {
    if (!confirm('Are you sure you want to clear the chat history?')) return;

    state.messages = [];
    elements.chatContainer.innerHTML = `
        <div class="message assistant">
            <div class="message-avatar">AI</div>
            <div class="message-content">
                Hello! I'm your AI assistant. How can I help you today?
            </div>
        </div>
    `;
    saveState();
}

// Save state to localStorage
function saveState() {
    try {
        localStorage.setItem('aiChatState', JSON.stringify({
            provider: state.provider,
            modelId: state.modelId,
            temperature: state.temperature,
            maxTokens: state.maxTokens,
            topP: state.topP,
            topK: state.topK,
            promptTemplate: state.promptTemplate,
            messages: state.messages
        }));
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

// Load state from localStorage
function loadSavedState() {
    try {
        const saved = localStorage.getItem('aiChatState');
        if (saved) {
            const data = JSON.parse(saved);

            state.provider = data.provider || 'puter';
            state.modelId = data.modelId || 'gpt-4o';
            state.temperature = data.temperature || 0.7;
            state.maxTokens = data.maxTokens || 2048;
            state.topP = data.topP || 0.9;
            state.topK = data.topK || 40;
            state.promptTemplate = data.promptTemplate || 'chatml';
            state.messages = data.messages || [];

            // Update UI
            elements.providerSelect.value = state.provider;
            elements.modelInput.value = state.modelId;
            elements.temperature.value = state.temperature;
            elements.maxTokens.value = state.maxTokens;
            elements.topP.value = state.topP;
            elements.topK.value = state.topK;
            elements.promptTemplate.value = state.promptTemplate;

            elements.tempValue.textContent = state.temperature;
            elements.maxTokensValue.textContent = state.maxTokens;
            elements.topPValue.textContent = state.topP;
            elements.topKValue.textContent = state.topK;

            // Restore messages
            if (state.messages.length > 0) {
                elements.chatContainer.innerHTML = '';
                state.messages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${msg.role}`;

                    const avatar = document.createElement('div');
                    avatar.className = 'message-avatar';
                    avatar.textContent = msg.role === 'user' ? 'U' : 'AI';

                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'message-content';
                    contentDiv.textContent = msg.content;

                    messageDiv.appendChild(avatar);
                    messageDiv.appendChild(contentDiv);
                    elements.chatContainer.appendChild(messageDiv);
                });
            }
        }
    } catch (error) {
        console.error('Error loading state:', error);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
