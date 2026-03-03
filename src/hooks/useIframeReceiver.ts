import { useEffect, useCallback, useRef } from 'react';
import type { IframeReceiverOptions, IframeReceiver, Message, ResponseMessage } from '../types';

type MessageHandler = (data: unknown) => unknown;
type MessageHandlers = Record<string, MessageHandler>;

/**
 * useIframeReceiver - iframe 使用，接收父页面消息
 *
 * @param handlers - 消息处理器映射
 * @param options - 配置选项
 * @returns IframeReceiver 实例
 */
export function useIframeReceiver(
  handlers: MessageHandlers,
  options: IframeReceiverOptions = {}
): IframeReceiver {
  const { debug = false } = options;

  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  // 调试日志
  const log = useCallback((...args: unknown[]) => {
    if (debug) {
      console.log('[useIframeReceiver]', ...args);
    }
  }, [debug]);

  // 处理接收到的消息
  const handleMessage = useCallback(async (event: MessageEvent) => {
    const message = event.data as Message;

    if (!message || !message.type) {
      return;
    }

    log('📥 收到消息:', message);

    const handler = handlersRef.current[message.type];
    if (!handler) {
      log('⚠️ 未找到处理器:', message.type);
      return;
    }

    try {
      // 执行处理器
      const result = await handler(message.data);

      // 如果有 requestId，说明是请求，需要返回响应
      if ('requestId' in message && message.requestId) {
        const response: ResponseMessage = {
          type: message.type,
          requestId: message.requestId,
          success: true,
          data: result,
        };

        log('📤 发送响应:', response);
        event.source?.postMessage(response, { targetOrigin: event.origin });
      }
    } catch (error) {
      log('❌ 处理消息失败:', error);

      // 发送错误响应
      if ('requestId' in message && message.requestId) {
        const response: ResponseMessage = {
          type: message.type,
          requestId: message.requestId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };

        log('📤 发送错误响应:', response);
        event.source?.postMessage(response, { targetOrigin: event.origin });
      }
    }
  }, [log]);

  // 开始监听
  const start = useCallback(() => {
    log('🎧 开始监听父页面消息');
    window.addEventListener('message', handleMessage);
  }, [handleMessage, log]);

  // 停止监听
  const stop = useCallback(() => {
    log('🔇 停止监听父页面消息');
    window.removeEventListener('message', handleMessage);
  }, [handleMessage, log]);

  // 自动开始监听
  useEffect(() => {
    start();
    return () => {
      stop();
    };
  }, [start, stop]);

  return {
    start,
    stop,
  };
}
