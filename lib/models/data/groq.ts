import { openproviders } from "@/lib/openproviders"
import { ModelConfig } from "../types"

const groqModels: ModelConfig[] = [
  {
    id: "qwen2-7b-groq",
    name: "Qwen2-7B (Groq)",
    provider: "Groq",
    providerId: "groq",
    modelFamily: "Qwen",
    baseProviderId: "groq",
    description:
      "Qwen2-7B model hosted on Groq for ultra-fast inference. Free to use with excellent reasoning capabilities.",
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
      openproviders("qwen2-7b-groq" as string, undefined, apiKey),
  },
]

export { groqModels }