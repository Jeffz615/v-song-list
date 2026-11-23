[<img alt="幽头" src="src/assets/avatar.jpg" style="border-radius: 50%; border: pink solid 3px; width: 150px;"></img>](https://u0song.com/)

幽灵车尔尼桑的直播歌单。支持关键字搜索、标签筛选（分类多选 / 首字单选）、随机点歌与双击复制点歌指令，纯静态、可离线托管，可作为 PWA 安装到桌面。

## 功能

- **关键字搜索**：按歌名、歌手、拼音备注模糊匹配，输入 200ms 防抖
- **标签筛选**：分类标签（免费 / 流行 / 日语…）多选，首字标签（A-Z / 假名）单选，均为「点击筛选、再点取消」
- **筛选条件条**：当前生效条件逐条可点掉，也可一键清除
- **金额筛选**：点歌金额徽章按色阶着色，点击即筛该价位
- **复制点歌指令**：双击歌曲行或点复制按钮，复制「点歌 XXX」并提示所需金额
- **随机点歌**：在当前筛选结果里随机，复制的同时滚到该曲并高亮
- **歌切视频**：有歌切的曲目可直接跳转 B 站
- **主播资料**：点头像打开简介与各平台入口
- **PWA**：生产构建注册 Service Worker，首次访问后离线可用；支持添加到主屏幕

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端框架 | React 19 + TypeScript 5.9 |
| 构建 / 开发服务器 | Vite 8 |
| 样式 | 原生 CSS（CSS 变量主题 + Grid/Flex 布局，无 UI 组件库） |
| 部署 | Cloudflare Workers 静态资源（边缘 CDN + Git 构建） |
| 数据生成 | Python 3：openpyxl + pypinyin，Excel → JSON |

## 代码架构

```
.
├─ index.html                 # Vite 入口 HTML（含 manifest / theme-color 等 PWA 声明）
├─ src/
│  ├─ main.tsx                # 应用挂载 + 生产环境注册 Service Worker
│  ├─ App.tsx                 # 页面编排：筛选状态、随机点歌、弹层与 toast
│  ├─ components/
│  │  ├─ HeroSection.tsx      # 头像、标题、结果计数、操作提示
│  │  ├─ SearchToolbar.tsx    # 吸顶工具栏：关键字搜索 + 随机一个
│  │  ├─ TagFilter.tsx        # 分类 / 首字标签筛选（点击切换）
│  │  ├─ FilterBar.tsx        # 当前筛选条件，单条可移除
│  │  ├─ SongList.tsx         # 歌单列表：桌面网格行 / 移动卡片
│  │  ├─ ProfileDialog.tsx    # 主播资料（原生 dialog）
│  │  ├─ BackToTopButton.tsx  # 回到顶部（像素小人）
│  │  └─ Toast.tsx            # 复制结果提示
│  ├─ hooks/
│  │  ├─ useSongFilter.ts     # 关键字防抖 + 标签/金额筛选 + 条件条 tokens
│  │  ├─ useCopySong.ts       # 复制点歌指令 + 反馈文案
│  │  └─ useToast.ts          # toast 状态与自动消失
│  ├─ lib/
│  │  ├─ songs.ts             # 数据模型、金额色阶、筛选与复制文案
│  │  ├─ profile.ts           # 主播简介与平台入口配置
│  │  └─ clipboard.ts         # Clipboard API + execCommand 兜底
│  ├─ assets/                 # data.json、头像、背景等图片
│  ├─ App.css / index.css     # 组件样式 / 主题变量与基础样式
│  └─ vite-env.d.ts
├─ public/                    # 原样拷贝到产物根目录
│  ├─ manifest.webmanifest    # PWA 清单（standalone + 图标）
│  ├─ sw.js                   # Service Worker（运行时缓存，离线可用）
│  ├─ icons/                  # 192 / 512 / maskable 图标
│  ├─ _headers                # 响应头（缓存 / 安全），Workers 静态资源同样支持
│  ├─ data_hash.txt           # 歌单数据指纹
│  ├─ favicon.jpg / robots.txt
├─ trans.py                   # Excel → JSON
├─ wrangler.jsonc             # Cloudflare Workers 项目配置（assets.directory 指向 dist）
├─ vite.config.ts
├─ tsconfig.json              # 引用 app / node 两套配置
└─ eslint.config.js
```

## 本地开发

```bash
# 环境要求：Node >= 22.12
npm install

# 开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建，产物在 dist/
npm run build
npm run preview   # 本地预览构建产物（Service Worker 需要这一步才能生效）

npm run lint      # ESLint
```

## 歌单数据

修改根目录的 `幽灵歌单整理.xlsx` 后重新生成 JSON（会同时更新 `public/data_hash.txt`）：

```bash
pip install -r requirements.txt
python trans.py          # 等价于 npm run data
```

`trans.py` 会过滤掉标签为「学习中」的曲目，并根据首字拼音生成首字母标签。生成的 `src/assets/data.json` 在构建时被打包进业务 chunk，因此更新歌单需要重新构建；`data_hash.txt` 是给需要判断数据新鲜度的场景留的指纹。

## PWA 说明

- `public/manifest.webmanifest` 决定应用名、图标、主题色与 `standalone` 显示模式；
- `public/sw.js` 采用**运行时缓存**：构建产物文件名带 hash，无法静态列出预缓存清单，所以首次在线访问时把页面与资源写入缓存，之后离线可用；页面导航走网络优先、失败回退缓存 HTML；
- 发版后若需强制刷新客户端缓存，递增 `sw.js` 里的 `CACHE_VERSION`；
- 安装能力需要 **HTTPS**（或 localhost），`u0song.com` 已满足；裸 HTTP 内网地址只能浏览、不能安装。

## Cloudflare Workers 部署

站点以 **Workers + 静态资源**（assets）方式托管：`wrangler.jsonc` 的 `assets.directory` 指向 `dist`，项目里没有 Worker 脚本，Cloudflare 直接把构建产物当静态资源分发到边缘节点。

### 方式一：Git 集成（推荐）

1. 将仓库推送到 GitHub / GitLab；
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Workers** → **Connect to Git**，选择本仓库；
3. 构建设置（三项都要填，留空会提示"必填"）：
   - 项目名称：`v-song-list`（与 `wrangler.jsonc` 的 `name` 一致）
   - 构建命令：`npm run build`
   - 部署命令：`npx wrangler deploy`
   - 预览命令：`npx wrangler dev`
   - Node 版本：仓库根目录的 `.nvmrc` 已指定 `22`，无需额外配置；
4. 部署，此后每次 push 自动构建；分支构建会生成预览 URL。

### 方式二：本地直传

```bash
npx wrangler login     # 首次需授权
npm run deploy         # 构建 + wrangler deploy
```

项目名与产物目录已在 `wrangler.jsonc` 中声明（`name` / `assets.directory`），改名时同步修改该文件与 `package.json` 的 `deploy` 脚本。

### 自定义域名

Workers 项目 → **Settings** → **Domains & Routes** → **Add custom domain**，填 `u0song.com`。域名已托管在同一 Cloudflare 账号下时会自动创建 CNAME，不需要仓库内的 `CNAME` 文件。

### 部署相关说明

- `assets.not_found_handling: single-page-application`：未命中静态资源的路径返回 `index.html` 且状态码 200，即 SPA 回退；
- **不要**再写 `_redirects` 里的 `/* /index.html 200`：Workers 上这条 catch-all 会把 `/assets/*.js` 也拦成 HTML 导致白屏（Pages 才有"静态资源优先命中"的行为），本项目已删除该文件；
- `public/_headers`：`/assets/*` 一年强缓存（文件名带 hash）、入口 HTML `must-revalidate`、`/sw.js` 强制 `no-cache`（保证发版后 SW 能更新）、基础安全响应头；Workers 静态资源同样解析这个文件（对 Worker 代码自己构造的响应不生效，本项目无 Worker 代码，不受影响）；
- 构建产物为纯静态文件，无服务端依赖。

### 与 Pages 的差异（迁移备忘）

| | Pages | Workers 静态资源 |
| --- | --- | --- |
| 产物声明 | `pages_build_output_dir` | `assets.directory` |
| SPA 回退 | `_redirects` 的 `/* /index.html 200` | `assets.not_found_handling` |
| 部署命令 | 留空（自动发布 output directory） | `npx wrangler deploy` |
| 预览命令 | 无 | `npx wrangler dev` |
| 自定义域名 | Custom domains | Domains & Routes |

## 更新记录

- **v2 视觉与交互重构**：换掉 Ant Design，改为原生 CSS 的「星空紫 × 粉丝绒」主题；分类标签多选、首字单选，均为点击切换；搜索框只做关键字匹配，移除 `!T:` / `!M:` 命令语法，新增筛选条件条；移动端改为卡片式列表；接入 PWA（manifest + Service Worker），去掉依赖公共 MQTT 的历史包袱；
- 托管方式由 Cloudflare Pages 的 `pages_build_output_dir` 改为 Workers 静态资源（`assets.directory`），SPA 回退改用 `not_found_handling` 并移除 `_redirects`（该 catch-all 在 Workers 上会拦截 `/assets/*`）；
- `public/_headers` 补上入口 HTML 的 `must-revalidate`；
- 构建工具由 Create React App（react-scripts 5）迁移到 Vite 8，React 升级到 19；
- 移除 MQTT 在线聊天室（在线人数、广播消息、公告），不再依赖公共 MQTT Broker，页面变为纯静态；
- 单文件 `App.tsx` 拆分到 `components` / `hooks` / `lib`；
- 部署目标由 4everland 调整为 Cloudflare。

## LICENSE

要求不多，标注来源即可。

## 提交歌单

欢迎幽灵车尔尼桑的单推人们 PR 提交歌单。
