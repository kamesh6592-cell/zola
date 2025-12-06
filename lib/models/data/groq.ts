import { openproviders } from "@/lib/openproviders"
import { ModelConfig } from "../types"

const groqModels: ModelConfig[] = [
  {
    id: "llama-3.1-8b-groq",
    name: "Llama 3.1 8B (Groq)",
    provider: "Groq",
    providerId: "groq",
    modelFamily: "Llama",
    baseProviderId: "groq",
    description:
      "Llama 3.1 8B model hosted on Groq for ultra-fast inference. Free to use with excellent reasoning capabilities.",
    tags: ["free", "fast", "qwen", "7b", "groq-hosted", "reasoning"],
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
    modelPage: "https://huggingface.co/Qwen/Qwen2-7B",
    releasedAt: "2024-06-01",
    icon: "groq",
    apiSdk: (apiKey?: string) =>
      openproviders("llama-3.1-8b-instant" as string, undefined, apiKey),
  },
]

export { groqModels }