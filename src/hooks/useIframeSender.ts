import { useRef, useCallback, RefObject } from 'react';
import type {
  IframeSender,
  IframeSenderOptions,
  Message,
  RequestMessage,
  ResponseMessage,
} from '../types';

/**
 * useIframeSender - 父页面使用，发送消息到 iframe
 *
 * @param iframeRef - iframe 元素的 ref
 * @param options - 配置选项
 * @returns IframeSender 实例
 */
export function useIframeSender(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  options: IframeSenderOptions = {}
): IframeSender {
  const { targetOrigin = '*', debug = false, timeout = 5000 } = options;

  // 存储待处理的请求
  const pendingRequests = useRef<Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
    timer: ReturnType<typeof setTimeout>;
  }>>(new Map());

  // 调试日志
  const log = useCallback((...args: unknown[]) => {
    if (debug) {
      console.log('[useIframeSender]', ...args);
    }
  }, [debug]);

  // 发送消息到 iframe
  const send = useCallback(<T = unknown>(message: Message<T>): void => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) {
      log('❌ iframe 不可用');
      return;
    }

    try {
      iframe.contentWindow.postMessage(message, targetOrigin);
      log('📤 发送消息:', message);
    } catch (error) {
      log('❌ 发送消息失败:', error);
    }
  }, [iframeRef, targetOrigin, log]);

  // 发送请求并等待响应
  const request = useCallback(<TRequest = unknown, TResponse = unknown>(
    message: Message<TRequest>,
    customTimeout?: number
  ): Promise<TResponse> => {
    return new Promise<TResponse>((resolve, reject) => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      const requestMessage: RequestMessage<TRequest> = {
        ...message,
        requestId,
      };

      const timeoutMs = customTimeout ?? timeout;

      log('📤 发送请求:', requestMessage, `超时: ${timeoutMs}ms`);

      // 设置响应监听器
      const handleMessage = (event: MessageEvent) => {
        const response = event.data as ResponseMessage<TResponse>;

        if (response.requestId === requestId) {
          log('📥 收到响应:', response);

          // 清理
          window.removeEventListener('message', handleMessage);
          const pending = pendingRequests.current.get(requestId);
          if (pending) {
            clearTimeout(pending.timer);
            pendingRequests.current.delete(requestId);
          }

          // 处理响应
          if (response.success) {
            resolve(response.data as TResponse);
          } else {
            reject(new Error(response.error || 'Request failed'));
          }
        }
      };

      // 设置超时
      const timer = setTimeout(() => {
        log('⏰ 请求超时:', requestId);
        window.removeEventListener('message', handleMessage);
        pendingRequests.current.delete(requestId);
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      // 保存请求信息
      pendingRequests.current.set(requestId, { resolve, reject, timer });

      // 监听响应
      window.addEventListener('message', handleMessage);

      // 发送请求
      send(requestMessage);
    });
  }, [send, timeout, log]);

  return {
    send,
    request,
  };
}
