export type Role = 'system' | 'user' | 'assistant';

export interface Message {
  role: Role;
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface LLMConfig {
  provider: string;
  apiKey: string;
  apiSecret?: string; // For Baidu Ernie, iFlytek, etc.
  baseURL?: string;
  defaultModel: string;
  appId?: string; // For iFlytek
}

export enum ErrorCode {
  AUTH_ERROR = 'AUTH_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class LLMError extends Error {
  public code: ErrorCode;
  public rawError: any;

  constructor(message: string, code: ErrorCode = ErrorCode.UNKNOWN_ERROR, rawError?: any) {
    super(message);
    this.name = 'LLMError';
    this.code = code;
    this.rawError = rawError;
  }
}
