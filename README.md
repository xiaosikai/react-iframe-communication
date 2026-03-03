# react-iframe-communication

> React hooks for iframe communication with request-response pattern

[![npm version](https://badge.fury.io/js/react-iframe-communication.svg)](https://www.npmjs.com/package/react-iframe-communication)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个简单、类型安全的 React iframe 通信库，支持请求-响应模式。

## ✨ 特性

- 🚀 **简单易用** - 直观的 API，快速上手
- 📡 **请求-响应模式** - 类似 HTTP 的请求响应机制
- 🔒 **类型安全** - 完整的 TypeScript 支持
- ⚡ **轻量级** - 仅 9.5KB (gzipped)
- 🐛 **调试友好** - 内置调试模式
- 🛡️ **错误处理** - 自动超时和错误处理

## 📦 安装

```bash
npm install react-iframe-communication
# 或
pnpm add react-iframe-communication
# 或
yarn add react-iframe-communication
```

## ⚡ 快速开始

### Parent 页面（父页面）

```tsx
import { useRef } from 'react';
import { useIframeSender } from 'react-iframe-communication';

function ParentApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sender = useIframeSender(iframeRef, {
    targetOrigin: 'http://localhost:3001', // iframe 的地址
    debug: true
  });

  const getData = async () => {
    const data = await sender.request({ type: 'GET_DATA' });
    console.log(data);
  };

  return (
    <>
      <iframe ref={iframeRef} src="http://localhost:3001" />
      <button onClick={getData}>获取数据</button>
    </>
  );
}
```

### Iframe 页面

```tsx
import { useState } from 'react';
import { useIframeReceiver } from 'react-iframe-communication';

function IframeApp() {
  const [data] = useState({ name: 'John' });

  useIframeReceiver({
    GET_DATA: () => {
      return data; // 返回数据给父页面
    }
  });

  return <div>Iframe 内容</div>;
}
```

## 📚 文档

- 📖 [安装和使用指南](./INSTALLATION_GUIDE.md) - 详细的安装和使用教程
- 💡 [完整示例](./USAGE_EXAMPLES.md) - Parent 和 Iframe 页面的完整示例
- 🤝 [贡献指南](./CONTRIBUTING.md) - 开发、测试和发布指南

## 🎯 API

### `useIframeSender(iframeRef, options)`

父页面使用，发送消息到 iframe。

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `iframeRef` | `RefObject<HTMLIFrameElement>` | ✅ | - | iframe 元素的 ref |
| `options.targetOrigin` | `string` | ❌ | `'*'` | 目标 origin（生产环境必须指定） |
| `options.debug` | `boolean` | ❌ | `false` | 是否启用调试模式 |
| `options.timeout` | `number` | ❌ | `5000` | 默认超时时间（毫秒） |

**返回值：**

```typescript
{
  send: <T>(message: Message<T>) => void;           // 发送单向消息
  request: <TReq, TRes>(message: Message<TReq>, timeout?: number) => Promise<TRes>  // 发送请求
}
```

### `useIframeReceiver(handlers, options)`

iframe 使用，接收父页面的消息。

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `handlers` | `Record<string, (data?: unknown) => unknown>` | ✅ | - | 消息处理器映射 |
| `options.debug` | `boolean` | ❌ | `false` | 是否启用调试模式 |

**返回值：**

```typescript
{
  start: () => void;   // 开始监听
  stop: () => void;    // 停止监听
}
```

### `useIframeListener(listeners, options)`

父页面使用，监听 iframe 发回的消息。

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `listeners` | `Record<string, (message: Message) => void>` | ✅ | - | 消息监听器映射 |
| `options.debug` | `boolean` | ❌ | `false` | 是否启用调试模式 |

## 📖 消息格式

```typescript
// 请求消息
{
  type: string;        // 消息类型
  data?: unknown;      // 消息数据
  requestId?: string;  // 请求 ID（自动生成）
}

// 响应消息
{
  type: string;        // 消息类型
  requestId: string;   // 对应的请求 ID
  success: boolean;    // 是否成功
  data?: unknown;      // 响应数据
  error?: string;      // 错误信息
}
```

## 🔐 安全性

**⚠️ 生产环境必须指定 `targetOrigin`：**

```typescript
// ❌ 不安全：允许任何来源
useIframeSender(iframeRef, {
  targetOrigin: '*'
});

// ✅ 安全：指定具体的 origin
useIframeSender(iframeRef, {
  targetOrigin: 'https://your-iframe-domain.com'
});
```

## 💡 使用场景

- 📝 **表单编辑器** - 父页面控制 iframe 中的表单
- 🔐 **身份验证** - 检查 iframe 的登录状态
- 📤 **文件上传** - 父页面通知 iframe 上传文件
- 🎨 **可视化编辑器** - 父页面与 iframe 编辑器通信

## 🌟 TypeScript 支持

此包完全使用 TypeScript 编写，提供完整的类型定义：

```typescript
import type {
  Message,
  RequestMessage,
  ResponseMessage,
  IframeSender,
  IframeReceiver,
  IframeSenderOptions,
  IframeReceiverOptions,
} from 'react-iframe-communication';
```

## 🧪 本地开发

```bash
# 克隆项目
git clone https://github.com/yourusername/react-iframe-communication.git

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000
```

## 📝 License

[MIT](LICENSE)

## 👨‍💻 作者

[xiaosaikai](https://github.com/xiaosaikai)

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](./CONTRIBUTING.md)

---

**Made with ❤️ by [xiaosaikai](https://github.com/xiaosaikai)**
