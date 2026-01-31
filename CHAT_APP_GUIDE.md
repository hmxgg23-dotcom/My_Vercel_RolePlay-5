# AI Chat App - Quick Start Guide

## 🚀 How to Use

### Opening the App
1. Open `chat-app.html` in your browser
2. The app will load with a clean chat interface

### Features Implemented

#### 1. **Core Setup** ✅
- Puter.js v2 SDK loaded via CDN
- Clean sidebar for settings
- Main chat area with message history
- Responsive and modern UI

#### 2. **Provider & Settings Logic** ✅
- **Provider Dropdown**: Select between Puter, OpenAI, Anthropic, or Custom API
- **Conditional Settings Display**:
  - When "Puter" is selected: Only shows Temperature and Max Tokens
  - When other providers are selected: Shows all parameters (Top P, Top K, Prompt Templates)
- **Generation Parameters**:
  - Temperature (0-2)
  - Max Tokens (100-4096)
  - Top P (0-1) - Hidden for Puter
  - Top K (0-100) - Hidden for Puter
  - Prompt Templates (ChatML, Alpaca, Vicuna, Llama 3, Mistral) - Hidden for Puter

#### 3. **Puter Integration** ✅
- **Model ID Field**: Enter any model ID manually (e.g., gpt-4o, claude-3.5-sonnet)
- **Fetch Models Button**: Click to retrieve available models from `puter.ai.listModels()`
- **Authentication**: Automatically checks `puter.auth.isSignedIn()` and prompts login if needed
- **Chat Functionality**: Uses `puter.ai.chat()` with proper parameters
- **User Status**: Displays "Connected as [username]" when authenticated

#### 4. **UI/UX** ✅
- Clean, modern dark theme
- Smooth animations for messages
- Auto-scrolling chat
- Persistent state (saves your settings and chat history)
- Responsive design
- Visual feedback for loading states

## 🎯 Usage Flow

### First Time Setup
1. Open `chat-app.html`
2. Select "Puter" as provider (default)
3. Click "Fetch Available Models" to see what's available
4. Select a model or type one manually (default: gpt-4o)
5. Adjust Temperature and Max Tokens if needed
6. Start chatting!

### Authentication
- When you send your first message with Puter, you'll be prompted to sign in
- After signing in, you'll see "Connected as [your-username]" in the sidebar
- Authentication persists across sessions

### Switching Providers
- Select a different provider from the dropdown
- Notice how the settings panel adapts:
  - **Puter**: Only Temperature & Max Tokens visible
  - **Other Providers**: All settings visible (Top P, Top K, Prompt Templates)

### Chat Features
- Type your message in the input box
- Press Enter to send (Shift+Enter for new line)
- View conversation history in the main area
- Click "Clear Chat History" to start fresh

## 🔧 Technical Details

### Puter.js Integration
```javascript
// Authentication check
if (!puter.auth.isSignedIn()) {
    await puter.auth.signIn();
}

// Fetch models
const models = await puter.ai.listModels();

// Send chat message
const response = await puter.ai.chat(messages, {
    model: modelId,
    temperature: temperature,
    max_tokens: maxTokens
});
```

### Settings Persistence
- Uses localStorage to save:
  - Provider selection
  - Model ID
  - Generation parameters
  - Full chat history
- Automatically restores on page reload

### Error Handling
- Authentication errors are caught and user is prompted to sign in
- Network errors display helpful error messages
- Invalid responses are handled gracefully

## 🎨 UI Features

### Sidebar
- Provider selection
- Model configuration
- Generation parameters (adaptive based on provider)
- Clear chat button

### Chat Area
- Message bubbles with avatars
- User messages (right, purple gradient)
- AI messages (left, pink gradient)
- Smooth slide-in animations
- Auto-scroll to latest message

### Input Area
- Auto-expanding textarea
- Send button with loading state
- Keyboard shortcuts (Enter to send)

## 📱 Responsive Design
- Works on desktop and mobile
- Scrollable chat history
- Scrollable settings sidebar
- Touch-friendly buttons

## 🔒 Privacy
- All data stored locally in browser
- No external tracking
- Puter authentication handled securely by Puter SDK

## 🐛 Troubleshooting

### "Puter SDK is not loaded"
- Check internet connection
- Ensure `https://js.puter.com/v2/` is accessible
- Try refreshing the page

### "Not signed in" status
- Click anywhere in the app or try sending a message
- The sign-in popup should appear automatically
- Complete the authentication flow

### Models not loading
- Ensure you're signed in to Puter
- Check browser console for error messages
- Try clicking "Fetch Available Models" again

### Other provider errors
- Currently only Puter is fully implemented
- OpenAI/Anthropic/Custom providers show "not yet implemented" message
- You can extend the code to add these providers

## 🚀 Next Steps

To add more providers:
1. Open `chat-app.js`
2. Find the `sendGenericMessage()` function
3. Add your API implementation for OpenAI/Anthropic/etc.
4. Update the error message

---

**Enjoy your AI Chat experience!** 🎉
