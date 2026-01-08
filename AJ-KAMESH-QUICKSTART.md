# 🚀 AJ KAMESH AI - Quick Start Guide

## Welcome, AJ KAMESH!

Your personal AI chat interface is now fully configured and ready to use. This guide will help you get started quickly.

---

## ✅ What's Been Customized

1. **Branding**: All references updated to "AJ KAMESH AI"
2. **Metadata**: SEO and social media tags personalized for you
3. **System Prompt**: AI assistant tuned for your personal use
4. **Configuration**: Environment file ready for your API keys
5. **Dependencies**: All packages installed and ready

---

## 🎯 Getting Started

### Step 1: Add Your API Keys

Open the `.env.local` file and add your API keys:

```env
# Start with at least one of these (recommended):
OPENAI_API_KEY=sk-your_key_here          # For GPT models
ANTHROPIC_API_KEY=sk-ant-your_key_here  # For Claude models
GOOGLE_GENERATIVE_AI_API_KEY=your_key   # For Gemini models
```

**Get API Keys:**
- OpenAI: https://platform.openai.com/api-keys
- Anthropic (Claude): https://console.anthropic.com/settings/keys
- Google (Gemini): https://aistudio.google.com/app/apikey
- xAI (Grok): https://console.x.ai/
- Mistral: https://console.mistral.ai/api-keys/
- Perplexity: https://www.perplexity.ai/settings/api
- OpenRouter (100+ models): https://openrouter.ai/keys

### Step 2: Start the Development Server

```powershell
cd "e:\AJ STUDIOZ\zola"
npm run dev
```

### Step 3: Open Your Browser

Go to: http://localhost:3000

---

## 🤖 Available AI Models

Your interface supports multiple AI providers:

### **OpenAI**
- GPT-4o, GPT-4o-mini, GPT-4 Turbo, O1, O1 mini

### **Anthropic**
- Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku

### **Google**
- Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 2.5 Flash Lite

### **xAI**
- Grok 2, Grok 3, Grok 3 Mini

### **Other Providers**
- Mistral AI models
- Perplexity (with web search)
- Groq (fast inference)
- OpenRouter (access to 100+ models)
- Ollama (local models - FREE)

---

## 💻 Local AI with Ollama (No API Keys Needed!)

Want to run AI models locally without any API keys?

### Install Ollama:

**Windows:**
Download from: https://ollama.ai/download/windows

**After Installation:**
```powershell
# Pull some popular models
ollama pull llama3.2       # Meta's Llama 3.2
ollama pull mistral        # Mistral 7B
ollama pull codellama      # Code-specialized model
ollama pull gemma2         # Google's Gemma 2

# Start your app - it will auto-detect Ollama models!
cd "e:\AJ STUDIOZ\zola"
npm run dev
```

---

## 📝 Useful Scripts

```powershell
npm run dev          # Start development server (with hot reload)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run code linting
npm run type-check   # TypeScript type checking
```

---

## 🎨 Features Included

✅ **Multi-Model Chat** - Switch between different AI models in one interface
✅ **File Uploads** - Attach images and documents (with auth)
✅ **Dark/Light Theme** - Automatic theme switching
✅ **Conversation History** - Save and manage your chats
✅ **Custom System Prompts** - Personalize AI behavior
✅ **Web Search** - Enhanced responses with web search (Perplexity)
✅ **Code Highlighting** - Beautiful syntax highlighting for code
✅ **Markdown Support** - Rich text formatting in responses
✅ **Responsive Design** - Works on desktop, tablet, and mobile

---

## 🔒 Optional: Setup Authentication & Storage

For features like conversation history, file uploads, and multi-device sync:

1. Create a free Supabase account: https://supabase.com
2. Create a new project
3. Get your credentials from Project Settings > API
4. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE=your_service_role_key
   ```
5. Run the database setup script (see INSTALL.md)

---

## 🚨 Troubleshooting

### Issue: "API key not found"
**Solution**: Make sure you've added at least one API key to `.env.local`

### Issue: "Failed to load models"
**Solution**: Check that your API keys are valid and have credits

### Issue: Port 3000 already in use
**Solution**: Either:
- Stop the other process using port 3000
- Or run: `npm run dev -- -p 3001` (uses port 3001 instead)

### Issue: Ollama models not showing
**Solution**: 
- Make sure Ollama is running: `ollama list`
- Check OLLAMA_BASE_URL in .env.local (default: http://localhost:11434)

---

## 📚 Additional Documentation

- **[INSTALL.md](./INSTALL.md)** - Detailed installation guide with auth setup
- **[PRODUCTION-SETUP-GUIDE.md](./PRODUCTION-SETUP-GUIDE.md)** - Deploy to production

---

## 🎉 You're All Set!

Your personal AI assistant is ready. Just add your API keys and start the dev server!

```powershell
cd "e:\AJ STUDIOZ\zola"
npm run dev
```

Then open http://localhost:3000 and start chatting!

---

**Made for AJ KAMESH by AJ STUDIOZ** 🚀

For questions or issues, check the documentation or contact AJ KAMESH.
