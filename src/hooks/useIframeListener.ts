import { useEffect, useCallback, useRef } from 'react';
import type { Message, IframeReceiverOptions } from '../types';

type MessageListener = (message: Message) => void;
type MessageListeners = Record<string, MessageListener>;

/**
 * useIframeListener - 父页面使用，监听 iframe 发回的消息
 *
 * @param listeners - 消息监听器映射
 * @param options - 配置选项
 */
export function useIframeListener(
  listeners: MessageListeners,
  options: IframeReceiverOptions = {}
): void {
  const { debug = false } = options;

  const listenersRef = useRef(listeners);
  listenersRef.current = listeners;

  // 调试日志
  const log = useCallback((...args: unknown[]) => {
    if (debug) {
      console.log('[useIframeListener]', ...args);
    }
  }, [debug]);

  // 处理接收到的消息
  const handleMessage = useCallback((event: MessageEvent) => {
    const message = event.data as Message;

    if (!message || !message.type) {
      return;
    }

    log('📥 收到 iframe 消息:', message);

    const listener = listenersRef.current[message.type];
    if (!listener) {
      log('⚠️ 未找到监听器:', message.type);
      return;
    }

    try {
      listener(message);
    } catch (error) {
      log('❌ 处理消息失败:', error);
    }
  }, [log]);

  // 自动监听消息
  useEffect(() => {
    log('🎧 开始监听 iframe 消息');
    window.addEventListener('message', handleMessage);

    return () => {
      log('🔇 停止监听 iframe 消息');
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage, log]);
}
