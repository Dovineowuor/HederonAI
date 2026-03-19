import { NextRequest, NextResponse } from "next/server";
import { create } from 'kubo-rpc-client';
import { uploadToIPFS, uploadDirectoryToIPFS } from '@/lib/ipfs';

// Kilo Gateway configuration
const KILO_GATEWAY_URL = 'https://gateway.kiloai.ai/v1';
const KILO_MODELS = {
  'minimax-8b': {
    name: 'MiniMax M2.1 (free)',
    description: 'Fast, efficient model for quick responses',
    maxTokens: 4096,
    capabilities: ['text', 'code', 'analysis']
  },
  'z-ai-glama-3b': {
    name: 'Z.AI GLM 3B (free)',
    description: 'Balanced model for general tasks',
    maxTokens: 4096,
    capabilities: ['text', 'analysis', 'reasoning']
  },
  'qwen-2.5-7b': {
    name: 'Qwen 2.5-7B (free)',
    description: 'Efficient model for various tasks',
    maxTokens: 4096,
    capabilities: ['text', 'analysis', 'coding']
  },
  'gemma2-9b-it': {
    name: 'Gemma 2-9B IT (free)',
    description: 'Lightweight model for quick responses',
    maxTokens: 4096,
    capabilities: ['text', 'analysis']
  }
};

// Initialize Kilo Gateway client
let kiloClient: any;

async function initializeKiloClient() {
  try {
    kiloClient = create({
      url: KILO_GATEWAY_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.KILO_API_KEY || ''}`
      }
    });
    console.log('Connected to Kilo Gateway');
    return kiloClient;
  } catch (error) {
    console.error('Failed to initialize Kilo Gateway:', error);
    throw new Error(`Kilo Gateway initialization failed: ${(error as Error).message}`);
  }
}

// Call Kilo model with fallback
export async function callKiloModel(
  prompt: string,
  model: string = 'minimax-8b',
  options: any = {}
): Promise<string> {
  try {
    const client = await initializeKiloClient();
    
    const response = await client.chat.completions({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: KILO_MODELS[model as keyof typeof KILO_MODELS]?.maxTokens || 4096,
      temperature: 0.7,
      ...options
    });
    
    const result = response.choices[0]?.message?.content || '';
    console.log(`Kilo model ${model} response:`, result.substring(0, 100) + '...');
    
    return result;
  } catch (error) {
    console.error('Kilo model call failed:', error);
    throw new Error(`Kilo model call failed: ${(error as Error).message}`);
  }
}

// Get available models
export function getAvailableModels(): string[] {
  return Object.keys(KILO_MODELS);
}

// Check if model supports specific capability
export function modelSupportsCapability(model: string, capability: string): boolean {
  const modelCapabilities = KILO_MODELS[model as keyof typeof KILO_MODELS]?.capabilities || [];
  return modelCapabilities.includes(capability);
}

export async function POST(req: NextRequest) {
  const { prompt, model = 'minimax-8b', options = {} } = await req.json();

  try {
    const result = await callKiloModel(prompt, model, options);
    
    return NextResponse.json({
      success: true,
      model,
      prompt,
      response: result,
      usage: {
        model,
        maxTokens: KILO_MODELS[model as keyof typeof KILO_MODELS]?.maxTokens || 4096,
        capabilities: KILO_MODELS[model as keyof typeof KILO_MODELS]?.capabilities || []
      }
    });
  } catch (error) {
    console.error('Kilo API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Kilo model call failed: ${error.message}` 
      },
      { status: 500 }
    );
  }
}
