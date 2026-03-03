import { useRef, useState } from 'react';
import { useIframeSender, useIframeListener } from '../hooks';

function ParentApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // 添加日志
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  // 初始化 iframe 发送器
  const sender = useIframeSender(iframeRef, {
    targetOrigin: '*', // 自测环境使用 *
    debug: true,
    timeout: 5000,
  });

  // 监听 iframe 发回的消息
  useIframeListener({
    FORM_SAVED: (message) => {
      addLog(`✅ 表单保存成功: ${JSON.stringify(message.data)}`);
      alert('表单保存成功！');
    },
  });

  // 获取表单数据
  const handleGetFormData = async () => {
    setLoading(true);
    addLog('📤 发送 GET_FORM_DATA 请求...');

    try {
      const data = await sender.request({ type: 'GET_FORM_DATA' });
      addLog(`📥 收到表单数据: ${JSON.stringify(data)}`);
      setFormData(data);
    } catch (error) {
      addLog(`❌ 获取表单数据失败: ${(error as Error).message}`);
      alert('获取表单数据失败：' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 更新表单数据
  const handleUpdateForm = async () => {
    if (!formData) {
      alert('请先获取表单数据');
      return;
    }

    setLoading(true);
    const newData = { ...formData, name: formData.name + ' (已更新)' };
    addLog(`📤 发送 UPDATE_FORM 请求...`);

    try {
      const result = await sender.request({
        type: 'UPDATE_FORM',
        data: newData,
      });
      addLog(`📥 更新成功: ${JSON.stringify(result)}`);
      setFormData(newData);
    } catch (error) {
      addLog(`❌ 更新失败: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // 验证表单
  const handleValidateForm = async () => {
    setLoading(true);
    addLog('📤 发送 VALIDATE_FORM 请求...');

    try {
      const result = await sender.request(
        { type: 'VALIDATE_FORM', data: formData },
        3000
      );
      addLog(`📥 验证结果: ${JSON.stringify(result)}`);

      if (result.valid) {
        alert('验证通过！');
      } else {
        alert('验证失败：' + result.errors.join(', '));
      }
    } catch (error) {
      addLog(`❌ 验证超时或失败: ${(error as Error).message}`);
      alert('验证超时或失败');
    } finally {
      setLoading(false);
    }
  };

  // 清空日志
  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>
        🚀 react-iframe-communication 自测
      </h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        父页面 - 发送消息到 iframe 并接收响应
      </p>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={handleGetFormData}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {loading ? '加载中...' : '📥 获取表单数据'}
        </button>

        <button
          onClick={handleUpdateForm}
          disabled={loading || !formData}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: loading || !formData ? 'not-allowed' : 'pointer',
            backgroundColor: loading || !formData ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {loading ? '更新中...' : '✏️ 更新表单'}
        </button>

        <button
          onClick={handleValidateForm}
          disabled={loading || !formData}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: loading || !formData ? 'not-allowed' : 'pointer',
            backgroundColor: loading || !formData ? '#ccc' : '#ffc107',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {loading ? '验证中...' : '✓ 验证表单'}
        </button>

        <button
          onClick={handleClearLogs}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          🗑️ 清空日志
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Iframe 内容 */}
        <div style={{ flex: '1', minWidth: '400px' }}>
          <h3 style={{ marginBottom: '10px' }}>Iframe 内容：</h3>
          <iframe
            ref={iframeRef}
            src="/iframe.html"
            style={{
              width: '100%',
              height: '500px',
              border: '2px solid #007bff',
              borderRadius: '8px',
            }}
          />
        </div>

        {/* 右侧信息 */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          {/* 表单数据 */}
          <div
            style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: '10px' }}>📋 表单数据：</h4>
            {formData ? (
              <pre
                style={{
                  margin: 0,
                  padding: '10px',
                  backgroundColor: 'white',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(formData, null, 2)}
              </pre>
            ) : (
              <p style={{ color: '#6c757d', margin: 0 }}>暂无数据，请先获取表单数据</p>
            )}
          </div>

          {/* 日志 */}
          <div
            style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: '10px' }}>📜 操作日志：</h4>
            <div
              style={{
                height: '200px',
                overflowY: 'auto',
                padding: '10px',
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {logs.length === 0 ? (
                <p style={{ color: '#6c757d', margin: 0 }}>暂无日志</p>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    style={{ marginBottom: '5px', fontFamily: 'monospace' }}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentApp;
