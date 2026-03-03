# 📖 使用示例

## 📦 安装

```bash
npm install react-iframe-communication
# 或
pnpm add react-iframe-communication
# 或
yarn add react-iframe-communication
```

---

## 🎯 场景 1: Parent 页面（父页面）

父页面负责**发送消息**到 iframe 并**接收响应**。

### 完整示例

```tsx
import { useRef, useState } from 'react';
import { useIframeSender, useIframeListener } from 'react-iframe-communication';

function ParentPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 初始化发送器
  const sender = useIframeSender(iframeRef, {
    targetOrigin: 'http://localhost:3001', // iframe 的 URL
    debug: true,                            // 开启调试模式
    timeout: 5000                           // 5秒超时
  });

  // 监听 iframe 的主动推送
  useIframeListener({
    DATA_CHANGED: (message) => {
      console.log('iframe 数据已变化:', message.data);
    },
    IFRAME_READY: () => {
      console.log('iframe 已准备就绪');
    }
  }, { debug: true });

  // 获取 iframe 中的数据
  const handleGetData = async () => {
    setLoading(true);
    try {
      const result = await sender.request({ type: 'GET_FORM_DATA' });
      setData(result);
      console.log('获取到的数据:', result);
    } catch (error) {
      console.error('获取数据失败:', error);
      alert('获取数据失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 更新 iframe 中的数据
  const handleUpdateData = async () => {
    try {
      await sender.request({
        type: 'UPDATE_FORM_DATA',
        data: { name: '张三 (已更新)', age: 30 }
      });
      alert('数据已更新!');
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败: ' + (error as Error).message);
    }
  };

  // 验证 iframe 中的表单
  const handleValidateForm = async () => {
    try {
      const result = await sender.request({
        type: 'VALIDATE_FORM'
      });
      alert(result.valid ? '✅ 表单有效' : '❌ 表单无效');
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  // 发送单向消息（不需要响应）
  const handleSave = () => {
    sender.send({
      type: 'SAVE_DATA',
      data: { name: 'John', age: 25 }
    });
    console.log('保存指令已发送');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎛️ 父页面控制台</h1>

      {/* Iframe 容器 */}
      <div style={{ border: '2px solid #007bff', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
        <iframe
          ref={iframeRef}
          src="http://localhost:3001"
          style={{
            width: '100%',
            height: '400px',
            border: 'none'
          }}
          title="Iframe Page"
        />
      </div>

      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={handleGetData}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ 加载中...' : '📥 获取表单数据'}
        </button>

        <button
          onClick={handleUpdateData}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✏️ 更新表单
        </button>

        <button
          onClick={handleValidateForm}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✓ 验证表单
        </button>

        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          💾 保存（单向）
        </button>
      </div>

      {/* 显示获取的数据 */}
      {data && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          <h3>📊 获取到的数据：</h3>
          <pre style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* 调试信息 */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <p style={{ margin: 0 }}>
          💡 <strong>提示：</strong>打开浏览器控制台查看详细的消息通信日志
        </p>
      </div>
    </div>
  );
}

export default ParentPage;
```

---

## 🎯 场景 2: Iframe 页面

Iframe 页面负责**接收消息**、**处理请求**并**返回响应**。

### 完整示例

```tsx
import { useState } from 'react';
import { useIframeReceiver } from 'react-iframe-communication';

// 表单数据类型
interface FormData {
  name: string;
  age: number;
  email?: string;
}

function IframePage() {
  const [formData, setFormData] = useState<FormData>({
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com'
  });

  // 接收并处理父页面的消息
  useIframeReceiver({
    // 获取表单数据
    GET_FORM_DATA: () => {
      console.log('[Iframe] 处理 GET_FORM_DATA 请求');
      return formData;
    },

    // 更新表单数据
    UPDATE_FORM_DATA: (data) => {
      console.log('[Iframe] 处理 UPDATE_FORM_DATA 请求:', data);
      setFormData(prev => ({ ...prev, ...(data as FormData) }));
      return { success: true, message: '数据已更新' };
    },

    // 验证表单
    VALIDATE_FORM: () => {
      console.log('[Iframe] 处理 VALIDATE_FORM 请求');
      const isValid = formData.name.length > 0 && formData.age >= 18;
      return {
        valid: isValid,
        errors: isValid ? [] : ['姓名不能为空', '年龄必须大于等于18岁']
      };
    },

    // 保存数据（单向消息）
    SAVE_DATA: (data) => {
      console.log('[Iframe] 处理 SAVE_DATA 请求:', data);
      // 这里可以调用 API 保存数据
      setFormData(data as FormData);
      return { success: true };
    }
  }, {
    debug: true  // 开启调试模式
  });

  // 主动通知父页面数据已变化
  const notifyDataChanged = () => {
    setFormData(prev => ({ ...prev, age: prev.age + 1 }));
    // 注意：这里需要手动发送消息到父页面
    window.parent.postMessage({
      type: 'DATA_CHANGED',
      data: { age: formData.age + 1 }
    }, '*');
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#007bff', marginBottom: '20px' }}>
          📝 Iframe 表单
        </h1>

        {/* 表单 */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              姓名：
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              年龄：
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: +e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              邮箱：
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="button"
            onClick={notifyDataChanged}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            🔔 通知父页面数据已变化
          </button>
        </form>

        {/* 当前数据预览 */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>当前数据：</h3>
          <pre style={{
            margin: 0,
            fontSize: '12px',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>

        {/* 提示信息 */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px',
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#495057'
        }}>
          <strong style={{ color: '#007bff' }}>💡 提示：</strong>
          <ul style={{ margin: '10px 0, paddingLeft: '20px' }}>
            <li>点击父页面的"获取表单数据"按钮获取当前内容</li>
            <li>点击"更新表单"按钮修改数据并同步到 iframe</li>
            <li>点击"验证表单"按钮验证数据有效性</li>
            <li>所有消息都会在浏览器控制台显示</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default IframePage;
```

---

## 🔗 跨域配置

### Parent 页面配置

如果 iframe 和 parent 跨域，需要在 **iframe 页面**的服务器设置 CORS：

```javascript
// Vite 配置示例 (vite.config.ts)
export default defineConfig({
  server: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});
```

### Security: 生产环境建议

**⚠️ 生产环境必须指定 `targetOrigin`：**

```tsx
// ❌ 不安全：允许任何来源
const sender = useIframeSender(iframeRef, {
  targetOrigin: '*'  // 生产环境不要使用!
});

// ✅ 安全：指定具体的 origin
const sender = useIframeSender(iframeRef, {
  targetOrigin: 'https://your-iframe-domain.com'
});
```

---

## 🧪 测试通信

### 1. 启动两个开发服务器

```bash
# Parent 端口 3000
cd parent-app
pnpm dev --port 3000

# Iframe 端口 3001
cd iframe-app
pnpm dev --port 3001
```

### 2. 打开浏览器控制台

查看消息日志：
```
[useIframeSender] 📤 发送请求: {type: "GET_FORM_DATA", requestId: "req_..."}
[useIframeReceiver] 📥 收到消息: {type: "GET_FORM_DATA", requestId: "req_..."}
[useIframeReceiver] 📤 发送响应: {type: "GET_FORM_DATA", requestId: "req_...", success: true, ...}
[useIframeSender] 📥 收到响应: {type: "GET_FORM_DATA", requestId: "req_...", success: true, ...}
```

---

## 🎯 更多使用场景

### 场景 1: 表单提交

```tsx
// Parent
const handleSubmit = async () => {
  const result = await sender.request({
    type: 'SUBMIT_FORM',
    data: formData
  });
  if (result.success) {
    alert('提交成功!');
  }
};

// Iframe
useIframeReceiver({
  SUBMIT_FORM: async (data) => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  }
});
```

### 场景 2: 文件上传

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
    // 处理文件上传逻辑
    return { url: 'https://example.com/file.pdf' };
  }
});
```

### 场景 3: 身份验证

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
      user: token ? getUserFromToken(token) : null
    };
  }
});
```

---

## 📚 API 参考

详细 API 文档请查看 [README.md](./README.md)
