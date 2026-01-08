# AJ KAMESH AI Chat Interface

**Personal AI Chat Platform for AJ KAMESH**

A powerful, customized multi-model AI chat interface built exclusively for AJ KAMESH's personal use.

![AI Chat Interface](./public/cover_zola.jpg)

## 🚀 Features

- **Multi-Model Support**: Access OpenAI GPT-4, Claude, Gemini, Grok, Perplexity, Mistral, and more
- **Local AI with Ollama**: Run models locally with automatic detection
- **Bring Your Own API Key (BYOK)**: Support via OpenRouter for additional models
- **File Uploads**: Attach and process files in conversations
- **Modern UI**: Clean, responsive design with light/dark themes
- **Customizable**: User system prompts, multiple layout options
- **Self-Hostable**: Complete control over your data
- **Built with Latest Tech**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **MCP Support**: Full Model Context Protocol integration (WIP)

## 🎯 Quick Start for AJ KAMESH

### Option 1: With Multiple AI Models (Recommended)

```bash
cd "e:\AJ STUDIOZ\zola"
npm install

# Create .env.local file with your API keys
# See .env.example for all available options

npm run dev
```

Your personal AI chat will be available at http://localhost:3000

### Option 2: With Ollama (Local AI)

```bash
# Install and start Ollama (Windows)
# Download from: https://ollama.ai/download/windows

# Pull your preferred models
ollama pull llama3.2
ollama pull mistral
ollama pull codellama

# Start the application
cd "e:\AJ STUDIOZ\zola"
npm install
npm run dev
```

### Option 3: Docker with Ollama

```bash
cd "e:\AJ STUDIOZ\zola"
docker-compose -f docker-compose.ollama.yml up
```

## 🔧 Configuration

1. Copy `.env.example` to `.env.local`
2. Add your API keys for the models you want to use:
   - `OPENAI_API_KEY` - For GPT models
   - `ANTHROPIC_API_KEY` - For Claude models
   - `GOOGLE_GENERATIVE_AI_API_KEY` - For Gemini models
   - `XAI_API_KEY` - For Grok models
   - `PERPLEXITY_API_KEY` - For Perplexity models
   - `MISTRAL_API_KEY` - For Mistral models
   - `OPENROUTER_API_KEY` - For additional models via OpenRouter
   - `GROQ_API_KEY` - For Groq models

3. Optional configurations:
   - `OLLAMA_BASE_URL` - For local Ollama (default: http://localhost:11434)
   - Supabase settings for auth and storage
   - Additional developer tools

## 🛠️ Built With

- [Next.js 15](https://nextjs.org/) — React framework
- [React 19](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [Vercel AI SDK](https://vercel.com/ai) — AI model integration
- [prompt-kit](https://prompt-kit.com/) — AI components
- [motion-primitives](https://motion-primitives.com) — Animations
- [Supabase](https://supabase.com) — Auth and storage

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🎨 Customization

This interface is fully customized for AJ KAMESH with:
- Personalized branding and metadata
- Custom SEO optimization
- Tailored user experience
- AJ STUDIOZ theming

## 🔐 Security

- All API keys are stored securely in environment variables
- Encryption support for user API key storage
- CSRF protection enabled
- Secure authentication with Supabase

## 📚 Documentation

For detailed setup instructions including:
- Database setup
- Production deployment
- Supabase configuration
- Vercel deployment

See:
- [INSTALL.md](./INSTALL.md) - Complete installation guide
- [PRODUCTION-SETUP-GUIDE.md](./PRODUCTION-SETUP-GUIDE.md) - Production deployment

## 🌟 Made For

**AJ KAMESH** - Personal AI Assistant Platform

Powered by AJ STUDIOZ

---

## License

Apache License 2.0

## Notes

This is a customized version for personal use. The interface supports multiple AI models and can be extended with additional features as needed.

For issues or customization requests, contact AJ KAMESH.
