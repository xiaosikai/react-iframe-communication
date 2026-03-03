import { useState } from 'react';
import { useIframeReceiver } from '../hooks';

function IframeApp() {
  const [formData, setFormData] = useState({
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25,
    bio: '这是个人简介',
  });

  const [updateCount, setUpdateCount] = useState(0);

  // 接收并处理父页面的消息
  useIframeReceiver({
    // 获取表单数据
    GET_FORM_DATA: () => {
      console.log('[Iframe] 处理 GET_FORM_DATA 请求');
      return formData;
    },

    // 更新表单数据
    UPDATE_FORM: (data) => {
      console.log('[Iframe] 处理 UPDATE_FORM 请求:', data);
      setFormData(data as typeof formData);
      setUpdateCount((prev) => prev + 1);

      // 通知父页面更新成功
      window.parent.postMessage(
        {
          type: 'FORM_UPDATED',
          data: { success: true, updateCount: updateCount + 1 },
        },
        '*'
      );

      return { success: true, message: '更新成功' };
    },

    // 验证表单数据
    VALIDATE_FORM: (data) => {
      console.log('[Iframe] 处理 VALIDATE_FORM 请求:', data);
      const form = data as typeof formData;

      // 验证逻辑
      const errors: string[] = [];

      if (!form.name || form.name.length < 2) {
        errors.push('姓名至少需要2个字符');
      }

      if (!form.email || !form.email.includes('@')) {
        errors.push('请输入有效的邮箱地址');
      }

      if (!form.age || form.age < 18 || form.age > 100) {
        errors.push('年龄必须在18-100之间');
      }

      if (errors.length > 0) {
        return {
          valid: false,
          errors,
        };
      }

      return {
        valid: true,
        message: '验证通过',
      };
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f4ff',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ color: '#333', marginBottom: '10px' }}>
        🎯 Iframe 页面示例
      </h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        此页面在 iframe 中运行，接收父页面的消息并处理请求
      </p>

      <div
        style={{
          maxWidth: '500px',
          margin: '0 auto',
          padding: '25px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        {/* 状态指示 */}
        <div
          style={{
            padding: '10px 15px',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '18px' }}>✅</span>
          <span>iframe 通信已就绪 | 已更新 {updateCount} 次</span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log('[Iframe] 表单提交:', formData);
            alert('表单数据（查看控制台）: ' + JSON.stringify(formData, null, 2));
          }}
        >
          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              姓名：
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              邮箱：
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              年龄：
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              简介：
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            提交表单（本地）
          </button>
        </form>

        {/* 说明 */}
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e8f4f8',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#495057',
          }}
        >
          <strong style={{ color: '#007bff' }}>💡 提示：</strong>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
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

export default IframeApp;
