# HSBC_demo

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | SvelteKit 2 + Svelte 5 (runes mode) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 3 |
| 图表 | Apache ECharts 5 |
| 测试 | Vitest 2 + @testing-library/svelte |
| 覆盖率 | @vitest/coverage-v8 |

## 项目结构

```
demo/
├── src/
│   ├── app.html                          # HTML 模板
│   ├── app.d.ts                          # 类型声明
│   ├── lib/
│   │   ├── components/
│   │   │   ├── WorldMap.svelte           # 世界地图组件（ECharts）
│   │   │   ├── PhoneSimulator.svelte     # 手机模拟器主组件
│   │   │   ├── ChatBubble.svelte         # 聊天气泡组件
│   │   │   └── MessageInput.svelte       # 消息输入框组件
│   │   ├── utils/
│   │   │   ├── mapUtils.ts               # 地图数据处理、国家高亮配置、中英文映射
│   │   │   └── smsUtils.ts               # SMS 消息生成、时间格式化、号码校验
│   │   └── types/
│   │       └── index.ts                  # 共享 TypeScript 类型定义（Message、CountryHighlight）
│   └── routes/
│       ├── +layout.svelte                # 全局布局（导入 layout.css + 渲染子内容）
│       ├── layout.css                    # Tailwind 全局样式
│       └── +page.svelte                  # 首页（侧边栏 + Tab 切换：世界地图 / 手机模拟器）
│
├── tests/
│   ├── mapUtils.test.ts                  # 地图工具函数测试（13 用例）
│   ├── smsUtils.test.ts                  # SMS 工具函数测试（16 用例）
│   ├── page.test.ts                      # 页面路由测试（10 用例）
│   └── components/
│       ├── ChatBubble.test.ts            # 聊天气泡组件测试（7 用例）
│       ├── MessageInput.test.ts          # 消息输入组件测试（7 用例）
│       └── PhoneSimulator.test.ts        # 手机模拟器测试（22 用例）
│
├── static/
│   ├── robots.txt
│   └── coverage/                         # 测试覆盖率报告输出目录
│
├── vite.config.ts                        # Vite + Vitest 配置
├── svelte.config.js                      # SvelteKit 配置
├── tailwind.config.ts                    # Tailwind CSS 配置
├── postcss.config.js                     # PostCSS 配置
├── tsconfig.json                         # TypeScript 配置
├── package.json
└── .gitignore
```

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器访问
# http://localhost:5173
```

## 功能说明

### 🗺️ 世界地图

- 左侧菜单点击「世界地图」进入
- 默认高亮 5 个国家：中国（红）、印度（橙）、巴西（绿）、美国（蓝）、俄罗斯（紫）
- **点击图例项**可切换某个国家的高亮/取消高亮
- 支持鼠标滚轮缩放、拖拽平移、悬停查看国家名称（中文）
- 地图数据源：[johan/world.geo.json](https://github.com/johan/world.geo.json)（180 个国家/地区）

### 📱 手机模拟器

- 左侧菜单点击「手机模拟器」进入
- 模拟真实手机 UI：Dynamic Island 刘海、实时时钟、信号/WiFi/电量图标
- 点击「紧急通知」按钮随机生成 5 种灾害预警短信（`type: 'alert'`）
- 底部输入框支持手动发送消息（`type: 'sms'`）
- 聊天气泡区分用户（蓝色，右对齐）和系统（白色，左对齐）
- 系统欢迎消息标记为 `type: 'info'`

### 📊 测试覆盖率

- 侧边栏底部「查看单元测试覆盖率」链接可打开完整报告
- 报告须先运行 `npm run test:coverage` 生成（输出到 `static/coverage/`，开发服务器可直接访问）

## 运行命令

```bash
npm run dev            # 启动开发服务器
npm run build          # 构建生产版本
npm run preview        # 预览生产构建
npm test               # 运行单元测试
npm run test:coverage  # 运行测试并生成覆盖率报告
npm run check          # TypeScript 类型检查
```

## 测试概况

```bash
# 6 个测试文件，75 个测试用例

✅ tests/mapUtils.test.ts                    13 tests
✅ tests/smsUtils.test.ts                    16 tests
✅ tests/page.test.ts                        10 tests
✅ tests/components/ChatBubble.test.ts        7 tests
✅ tests/components/MessageInput.test.ts      7 tests
✅ tests/components/PhoneSimulator.test.ts   22 tests

# 核心模块覆盖率（整体 87.88%）
✅ src/lib/utils/mapUtils.ts      100%
✅ src/lib/utils/smsUtils.ts      100%
✅ ChatBubble.svelte              100%
✅ MessageInput.svelte            100%
✅ PhoneHomeScreen.svelte         100%
✅ +page.svelte                   100%
✅ PhoneSimulator.svelte         96.84%
🟡 WorldMap.svelte               41.83%
```

## 注意事项

1. **Node.js 版本**：需要 Node.js 20.x 或更高版本
2. **地图加载**：世界地图 GeoJSON 数据从 GitHub CDN 加载，首次加载可能需要几秒，国内网络可能较慢
3. **Telemetry 输出**：测试运行时会输出 `17836... START/COMPLETED` 日志，这是 `svelte-check` 的调试信息，不影响功能
4. **适配器**：当前使用 `adapter-auto`，部署到 Cloudflare/Netlify/Vercel 等平台时会自动匹配；如果部署到 Node.js 服务器，请切换为 `adapter-node`
5. **地图域名**：如果 GeoJSON 数据源 `raw.githubusercontent.com` 不可访问，可以替换 `src/lib/utils/mapUtils.ts` 中的 `WORLD_GEOJSON_URL` 为其他镜像地址
6. **覆盖率报告路径**：覆盖率报告生成在 `static/coverage/` 目录下，开发服务器可直接通过 `/coverage/index.html` 访问，无需额外配置

agagin