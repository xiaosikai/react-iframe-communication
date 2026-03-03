/**
 * useIframeSender 单元测试
 */

import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { useIframeSender } from '../src/hooks/useIframeSender';

// Mock postMessage
global.postMessage = vi.fn() as any;

describe('useIframeSender', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确初始化', () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    iframeRef.current = {
      contentWindow: window,
    } as any;

    const { result } = renderHook(() =>
      useIframeSender(iframeRef, {
        targetOrigin: 'http://localhost:3000',
        debug: false,
      })
    );

    expect(result.current).toBeDefined();
    expect(result.current.send).toBeInstanceOf(Function);
    expect(result.current.request).toBeInstanceOf(Function);
  });

  it('应该发送单向消息', () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const mockContentWindow = {
      postMessage: vi.fn(),
    };
    iframeRef.current = {
      contentWindow: mockContentWindow as any,
    } as any;

    const { result } = renderHook(() =>
      useIframeSender(iframeRef, {
        targetOrigin: 'http://localhost:3000',
        debug: false,
      })
    );

    result.current.send({ type: 'TEST_MESSAGE', data: { foo: 'bar' } });

    expect(mockContentWindow.postMessage).toHaveBeenCalledWith(
      { type: 'TEST_MESSAGE', data: { foo: 'bar' } },
      'http://localhost:3000'
    );
  });

  it('应该发送请求并返回 Promise', async () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const mockContentWindow = {
      postMessage: vi.fn(),
    };
    iframeRef.current = {
      contentWindow: mockContentWindow as any,
    } as any;

    const { result } = renderHook(() =>
      useIframeSender(iframeRef, {
        targetOrigin: 'http://localhost:3000',
        debug: false,
        timeout: 5000,
      })
    );

    const requestPromise = result.current.request({ type: 'GET_DATA' });

    // 模拟响应
    const messageEvent = new MessageEvent('message', {
      data: {
        type: 'GET_DATA',
        requestId: expect.any(String),
        success: true,
        data: { result: 'success' },
      },
    });
    window.dispatchEvent(messageEvent);

    const response = await requestPromise;
    expect(response).toEqual({ result: 'success' });
  });
});
