# Puter.js Integration Guide

## Overview

VelvetCore now supports **Puter.js** as a primary AI provider, enabling you to access multiple AI models through Puter's unified API with automatic authentication and credit management.

## Features

### 1. **Automatic Authentication**
- No manual API key setup required
- Puter SDK handles authentication popup automatically
- Seamless login experience via OAuth

### 2. **Editable Model Selection (Combobox)**
- Manually type any model ID (e.g., `gpt-4o`, `claude-3.5-sonnet`, `mistralai/mixtral-8x7b-instruct`)
- Support for any model available through Puter's AI service
- Quick access via dropdown when you fetch models

### 3. **Fetch Models Button**
- Click "Fetch" next to the model input to retrieve available models
- Automatically calls `puter.ai.listModels()`
- Populates dropdown with all available model IDs
- Results are logged to console for debugging

### 4. **User Status Display**
- Shows currently logged-in Puter user
- Displays username or email
- Green status badge when connected
- Automatic status refresh

### 5. **Smart Error Handling**
- Detects quota/credit limit errors
- Shows friendly messages for rate limits
- Clear authentication error messages
- Handles network issues gracefully

## How to Use

### Step 1: Enable Puter Provider

1. Open Settings (gear icon in top-right)
2. Go to **Generation** tab
3. Under **Provider Configuration**, click **PUTER**

### Step 2: Authenticate

When you first select Puter as a provider, the SDK will automatically handle authentication:

- A popup window will appear asking you to sign in to Puter
- Complete the authentication process
- The popup will close automatically
- Your status will show as "Connected"

### Step 3: Select a Model

**Option A: Manual Entry**
- Type the model ID directly into the input field
- Examples:
  - `gpt-4o`
  - `gpt-4o-mini`
  - `claude-3.5-sonnet`
  - `mistralai/mixtral-8x7b-instruct`
  - `meta-llama/llama-3.3-70b`

**Option B: Fetch and Select**
1. Click the **Fetch** button (download icon)
2. Wait for models to load (logged to console)
3. A dropdown will appear with available models
4. Click on any model to select it

### Step 4: Start Chatting

- Select or create a character
- Send messages as normal
- Puter will use the selected model for generation
- Streaming is supported (enable in settings)

## Error Messages

### Quota Exceeded
```
PUTER_QUOTA_EXCEEDED: You have reached your free credit limit on Puter.
Please wait or upgrade your account.
```

**Solution:** Wait for your credits to refresh or upgrade your Puter account.

### Authentication Required
```
PUTER_AUTH_REQUIRED: Please authenticate with Puter to use this provider.
```

**Solution:** Re-select Puter as the provider to trigger the authentication popup.

### SDK Not Loaded
```
Puter SDK not loaded. Please ensure the Puter.js script is included in your HTML.
```

**Solution:** This should not happen in normal use. If it does, refresh the page.

## Technical Details

### API Integration

The integration uses Puter's unified AI API:

```javascript
puter.ai.chat(messages, {
  model: modelId,
  temperature: 0.9,
  max_tokens: 2048,
  stream: true
})
```

### Supported Features

- Full conversation history with system prompts
- Temperature and token limit controls
- Streaming responses (real-time generation)
- Lorebook/context injection
- Character personality preservation
- Smart context trimming (8192 token limit)

### Model Format

Models are specified by ID:
- OpenAI models: `gpt-4o`, `gpt-4o-mini`
- Anthropic models: `claude-3.5-sonnet`, `claude-3.5-haiku`
- Mistral models: `mistralai/mixtral-8x7b-instruct`
- Meta models: `meta-llama/llama-3.3-70b`
- And more as supported by Puter

### Authentication Flow

1. User selects Puter as provider
2. SDK checks authentication status via `puter.auth.getUser()`
3. If not authenticated, SDK triggers login popup
4. User completes OAuth flow
5. SDK returns user info and session
6. Status component displays connection state

## Troubleshooting

### Models Not Loading

If the "Fetch" button doesn't work:
1. Check browser console for errors
2. Ensure you're authenticated (status shows "Connected")
3. Try refreshing the page
4. Verify internet connection

### Messages Not Generating

If messages fail to send:
1. Check the error message displayed
2. Verify model ID is correct (no typos)
3. Ensure you haven't exceeded rate limits
4. Try switching to a different model

### Status Shows "Not Connected"

If authentication status is unclear:
1. Refresh the page to re-check status
2. Click away from Puter provider and back to trigger re-auth
3. Clear browser cache if issues persist

## Benefits of Using Puter

- **No API Key Management:** Puter handles credentials securely
- **Multiple Models:** Access various AI providers through one interface
- **Free Credits:** Start using immediately with free tier
- **Unified Billing:** One account for multiple AI services
- **Automatic Updates:** New models become available automatically

## Links

- [Puter Official Website](https://puter.com)
- [Puter SDK Documentation](https://docs.puter.com)
- [Get Started with Puter](https://puter.com/signup)

---

Enjoy seamless AI roleplay with Puter integration!
