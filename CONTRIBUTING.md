# 贡献指南

感谢你对 `react-iframe-communication` 的关注！我们欢迎各种形式的贡献。

## 📋 目录

- [开发环境设置](#开发环境设置)
- [项目结构](#项目结构)
- [开发流程](#开发流程)
- [测试](#测试)
- [发布流程](#发布流程)

## 🛠️ 开发环境设置

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/react-iframe-communication.git
cd react-iframe-communication
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看示例。

## 📁 项目结构

```
react-iframe-communication/
├── src/
│   ├── hooks/              # 核心 hooks
│   │   ├── useIframeSender.ts
│   │   ├── useIframeReceiver.ts
│   │   └── useIframeListener.ts
│   ├── types/              # TypeScript 类型定义
│   └── index.ts            # 入口文件
├── dist/                   # 构建产物
├── tests/                  # 测试文件
└── docs/                   # 文档
```

## 🔄 开发流程

### 1. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 进行开发

- 修改代码
- 添加/更新测试
- 更新文档（如需要）

### 3. 运行测试

```bash
# 类型检查
pnpm type-check

# 运行测试
pnpm test

# 构建
pnpm build
```

### 4. 提交代码

```bash
git add .
git commit -m "feat: add xyz feature"
# 或
git commit -m "fix: fix abc bug"
```

**提交消息格式：**

- `feat:` - 新功能
- `fix:` - 修复 bug
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 重构
- `test:` - 测试相关
- `chore:` - 构建/工具相关

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
pnpm test

# 测试 UI 模式
pnpm test:ui

# 监听模式
pnpm test --watch
```

### 编写测试

测试文件位于 `tests/` 目录：

```typescript
import { renderHook } from '@testing-library/react';
import { useIframeSender } from '../src/hooks/useIframeSender';

describe('useIframeSender', () => {
  it('should send message correctly', () => {
    // 测试代码
  });
});
```

## 📦 发布流程

### 1. 更新版本号

```bash
# 补丁版本 (0.1.0 → 0.1.1)
npm version patch

# 次版本 (0.1.0 → 0.2.0)
npm version minor

# 主版本 (0.1.0 → 1.0.0)
npm version major
```

### 2. 构建

```bash
pnpm build
```

### 3. 发布到 npm

**首次发布需要设置 npm token：**

1. 访问 https://www.npmjs.com/settings/tokens
2. 创建 Granular Access Token
3. 勾选 "Automation" 和 "Bypass 2FA for publishing"
4. 复制 token 并保存到 `.npmrc`（不要提交到 git）

```bash
# 配置 token
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN" > .npmrc

# 发布
npm publish --access public
```

### 4. 推送到 GitHub

```bash
git push origin main --tags
```

## 📝 代码规范

### TypeScript

- 使用 TypeScript 编写所有代码
- 导出的函数必须有类型定义
- 避免使用 `any` 类型

### 代码风格

- 使用 2 空格缩进
- 使用单引号
- 每行最大长度 100 字符

### 注释

- 导出的函数必须有 JSDoc 注释
- 复杂逻辑需要添加注释说明

## 🐛 报告 Bug

请通过 [GitHub Issues](https://github.com/yourusername/react-iframe-communication/issues) 报告 bug。

报告 bug 时请包含：

- 复现步骤
- 期望行为
- 实际行为
- 环境信息（React 版本、浏览器等）

## 💡 功能建议

欢迎通过 [GitHub Issues](https://github.com/yourusername/react-iframe-communication/issues) 提交功能建议。

建议功能时请描述：

- 使用场景
- 期望的 API
- 是否愿意实现该功能

## 📜 许可证

提交代码即表示你同意将代码以 [MIT License](LICENSE) 发布。

## 🙏 致谢

感谢所有贡献者！

---

有任何问题？欢迎通过 [Issue](https://github.com/yourusername/react-iframe-communication/issues) 联系我们。
