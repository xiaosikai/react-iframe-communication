/**
 * 消息类型定义
 */

export interface Message<T = unknown> {
  type: string;
  data?: T;
  requestId?: string;
}

export interface RequestMessage<T = unknown> extends Message<T> {
  requestId: string;
}

export interface ResponseMessage<T = unknown> extends Message<T> {
  requestId: string;
  success: boolean;
  error?: string;
}

export interface IframeSenderOptions {
  /** 目标 iframe 的 origin，生产环境应该指定具体值 */
  targetOrigin?: string;
  /** 是否启用调试模式 */
  debug?: boolean;
  /** 默认请求超时时间（毫秒） */
  timeout?: number;
}

export interface IframeReceiverOptions {
  /** 是否启用调试模式 */
  debug?: boolean;
}

export interface IframeSender {
  /** 发送消息到 iframe */
  send<T = unknown>(message: Message<T>): void;
  /** 发送请求并等待响应 */
  request<TRequest = unknown, TResponse = unknown>(
    message: Message<TRequest>,
    timeout?: number
  ): Promise<TResponse>;
}

export interface IframeReceiver {
  /** 开始监听父页面消息 */
  start: () => void;
  /** 停止监听父页面消息 */
  stop: () => void;
}
