# 📦 在其他项目中使用 react-iframe-communication

## 🚀 快速开始

### 1️⃣ 安装包

```bash
npm install react-iframe-communication
# 或
pnpm add react-iframe-communication
# 或
yarn add react-iframe-communication
```

---

## 📖 使用示例

### Parent 页面（父页面）- 发送消息

```tsx
import { useRef, useState } from 'react';
import { useIframeSender } from 'react-iframe-communication';

function ParentPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [data, setData] = useState<any>(null);

  // 初始化发送器
  const sender = useIframeSender(iframeRef, {
    targetOrigin: 'http://localhost:3001', // iframe 的地址
    debug: true,                            // 开启调试日志
    timeout: 5000                           // 5秒超时
  });

  // 获取 iframe 中的数据
  const handleGetData = async () => {
    try {
      const result = await sender.request({ type: 'GET_DATA' });
      setData(result);
      console.log('获取到的数据:', result);
    } catch (error) {
      console.error('获取失败:', error);
    }
  };

  // 更新 iframe 中的数据
  const handleUpdateData = async () => {
    try {
      await sender.request({
        type: 'UPDATE_DATA',
        data: { name: '张三', age: 30 }
      });
      alert('更新成功!');
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  return (
    <div>
      <h1>父页面</h1>

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src="http://localhost:3001"
        style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
      />

      {/* 控制按钮 */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleGetData}>获取数据</button>
        <button onClick={handleUpdateData}>更新数据</button>
      </div>

      {/* 显示数据 */}
      {data && (
        <div style={{ marginTop: '20px' }}>
          <h3>获取到的数据:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ParentPage;
```

---

### Iframe 页面（iframe）- 接收消息

```tsx
import { useState } from 'react';
import { useIframeReceiver } from 'react-iframe-communication';

function IframePage() {
  const [data, setData] = useState({ name: 'John', age: 25 });

  // 接收并处理父页面的消息
  useIframeReceiver({
    // 获取数据
    GET_DATA: () => {
      console.log('Iframe: 收到 GET_DATA 请求');
      return data;
    },

    // 更新数据
    UPDATE_DATA: (newData) => {
      console.log('Iframe: 收到 UPDATE_DATA 请求:', newData);
      setData(newData as any);
      return { success: true };
    }
  }, {
    debug: true  // 开启调试日志
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Iframe 页面</h2>
      <div>
        <p>姓名: {data.name}</p>
        <p>年龄: {data.age}</p>
      </div>
    </div>
  );
}

export default IframePage;
```

---

## 🔧 完整项目结构示例

### 方案 A: 单个项目（推荐用于测试）

```
my-app/
├── package.json
├── vite.config.ts
├── index.html          # 父页面入口
├── iframe.html         # iframe 页面入口
└── src/
    ├── parent/
    │   └── App.tsx     # 父页面组件
    └── iframe/
        └── App.tsx     # iframe 组件
```

### 方案 B: 两个独立项目（推荐用于生产）

```
parent-app/          # 父页面项目
├── package.json
├── vite.config.ts
└── src/
    └── App.tsx

iframe-app/          # iframe 项目
├── package.json
├── vite.config.ts
└── src/
    └── App.tsx
```

---

## 🌐 跨域配置

如果父页面和 iframe 跨域，需要在 iframe 项目中配置 CORS：

### Vite 配置 (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});
```

---

## 📝 实际项目示例

### 示例 1: 表单编辑器

**场景**: 父页面发送表单数据到 iframe 编辑器

```tsx
// Parent
const handleSave = async () => {
  const result = await sender.request({
    type: 'SAVE_FORM',
    data: formData
  });

  if (result.success) {
    alert('保存成功!');
  }
};

// Iframe
useIframeReceiver({
  SAVE_FORM: async (data) => {
    // 保存到数据库
    await api.saveForm(data);
    return { success: true };
  }
});
```

### 示例 2: 身份验证

**场景**: 父页面检查 iframe 的登录状态

```tsx
// Parent
const checkAuth = async () => {
  const result = await sender.request({ type: 'CHECK_AUTH' });

  if (!result.authenticated) {
    // 跳转到登录页
    window.location.href = '/login';
  }
};

// Iframe
useIframeReceiver({
  CHECK_AUTH: () => {
    const token = localStorage.getItem('token');
    return {
      authenticated: !!token,
      user: getUserFromToken(token)
    };
  }
});
```

### 示例 3: 文件上传

**场景**: 父页面通知 iframe 上传文件

```tsx
// Parent
const handleUpload = async (file: File) => {
  const result = await sender.request({
    type: 'UPLOAD_FILE',
    data: { name: file.name, size: file.size }
  });

  console.log('上传完成:', result.url);
};

// Iframe
useIframeReceiver({
  UPLOAD_FILE: async (data) => {
    // 处理文件上传
    const url = await uploadService.upload(data);
    return { url };
  }
});
```

---

## 🎯 TypeScript 支持

包已经包含完整的 TypeScript 类型定义：

```typescript
import type {
  Message,
  RequestMessage,
  ResponseMessage,
  IframeSender,
  IframeReceiver,
  IframeSenderOptions,
  IframeReceiverOptions
} from 'react-iframe-communication';

// 自定义消息类型
interface MyMessageType {
  name: string;
  value: number;
}

// 使用泛型获得类型提示
const data = await sender.request<MyMessageType, { success: boolean }>({
  type: 'MY_ACTION',
  data: { name: 'test', value: 123 }
});
```

---

## 🔐 安全建议

**⚠️ 生产环境必须指定 targetOrigin：**

```typescript
// ❌ 不安全
const sender = useIframeSender(iframeRef, {
  targetOrigin: '*'  // 允许任何来源
});

// ✅ 安全
const sender = useIframeSender(iframeRef, {
  targetOrigin: 'https://your-iframe-domain.com'  // 指定具体域名
});
```

---

## 🐛 调试技巧

### 开启调试模式

```typescript
// Parent
const sender = useIframeSender(iframeRef, {
  debug: true  // 会打印所有消息日志
});

// Iframe
useIframeReceiver({}, {
  debug: true
});
```

### 查看控制台日志

```
[useIframeSender] 📤 发送请求: {type: "GET_DATA", requestId: "..."}
[useIframeReceiver] 📥 收到消息: {type: "GET_DATA", requestId: "..."}
[useIframeReceiver] 📤 发送响应: {success: true, data: {...}}
[useIframeSender] 📥 收到响应: {success: true, data: {...}}
```

---

## 📚 API 快速参考

### useIframeSender (父页面)

```typescript
const sender = useIframeSender(iframeRef, options);

// 发送单向消息
sender.send({ type: 'MESSAGE', data: {...} });

// 发送请求并等待响应
const response = await sender.request({ type: 'REQUEST', data: {...} });
```

### useIframeReceiver (iframe)

```typescript
useIframeReceiver({
  MESSAGE_TYPE: (data) => {
    // 处理消息
    return responseData;  // 可选
  }
}, options);
```

### useIframeListener (父页面监听 iframe 主动推送)

```typescript
useIframeListener({
  EVENT_FROM_IFRAME: (message) => {
    console.log('iframe 发来的事件:', message.data);
  }
}, options);
```

---

## 💡 最佳实践

1. **类型安全**: 定义消息类型接口
2. **错误处理**: 使用 try-catch 包裹 request
3. **超时设置**: 为请求设置合理的超时时间
4. **调试模式**: 开发时开启 debug，生产时关闭
5. **安全配置**: 生产环境必须指定 targetOrigin

---

## 🎉 完成！

现在你可以在任何 React 项目中使用 `react-iframe-communication` 来实现父子页面通信了！

有问题？查看完整文档：
- https://www.npmjs.com/package/react-iframe-communication
- https://github.com/yourusername/react-iframe-communication
