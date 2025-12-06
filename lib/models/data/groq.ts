import { createOpenAI } from "@ai-sdk/openai"
import { ModelConfig } from "../types"

const groqModels: ModelConfig[] = [
  {
    id: "qwen3-32b-groq",
    name: "Qwen3-32B (Groq)",
    provider: "Groq",
    providerId: "groq",
    modelFamily: "Qwen",
    baseProviderId: "groq",
    description:
      "Alibaba Cloud's Qwen3-32B model hosted on Groq for ultra-fast inference. Free to use.",
    tags: ["free", "fast", "qwen", "32b", "groq-hosted"],
    contextWindow: 32768,
    inputCost: 0.0,
    outputCost: 0.0,
    priceUnit: "per 1M tokens",
    vision: false,
    tools: true,
    audio: false,
    reasoning: true,
    openSource: true,
    speed: "Fast",
    intelligence: "High",
    website: "https://groq.com",
    apiDocs: "https://console.groq.com/docs",
    modelPage: "https://huggingface.co/Qwen/Qwen2-32B",
    releasedAt: "2024-06-01",
    icon: "groq",
    apiSdk: (apiKey?: string) =>
      createOpenAI({
        apiKey: apiKey || process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
        compatibility: "strict",
      })("qwen/qwen3-32b"),
  },
]

export { groqModels }