[<img alt="幽头" src="src/assets/avatar.jpg" style="border-radius: 50%; border: pink solid 3px; width: 150px;"></img>](https://u0song.com/)

幽灵车尔尼桑的直播歌单。支持关键字搜索、标签 / 价格快捷筛选、随机点歌与双击复制点歌指令，纯静态、可离线托管。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端框架 | React 19 + TypeScript 5.9 |
| 构建 / 开发服务器 | Vite 8 |
| UI 组件库 | Ant Design 6 + @ant-design/icons 6 |
| 部署 | Cloudflare Workers 静态资源（边缘 CDN + Git 构建） |
| 数据生成 | Python 3：openpyxl + pypinyin，Excel → JSON |

## 代码架构

```
.
├─ index.html                 # Vite 入口 HTML
├─ src/
│  ├─ main.tsx                # 应用挂载
│  ├─ App.tsx                 # 页面编排、主题与状态聚合
│  ├─ components/
│  │  ├─ HeroSection.tsx      # 头像、标题、标签、搜索框、随机点歌
│  │  ├─ SongTable.tsx        # 歌单表格（金额色阶 / 歌切链接 / 标签）
│  │  ├─ ProfileDrawer.tsx    # 主播介绍与各平台入口
│  │  └─ BackToTopButton.tsx  # 回到顶部（像素小人）
│  ├─ hooks/
│  │  ├─ useSongQuery.ts      # 搜索词防抖 + 过滤
│  │  └─ useCopySong.ts       # 复制点歌指令 + 消息反馈
│  ├─ lib/
│  │  ├─ songs.ts             # 数据模型、金额配色、查询语法、文案
│  │  └─ clipboard.ts         # Clipboard API + execCommand 兜底
│  ├─ assets/                 # data.json、头像、背景等图片
│  ├─ App.css / index.css
│  └─ vite-env.d.ts
├─ public/                    # 原样拷贝到产物根目录
│  ├─ _headers                # 响应头（缓存 / 安全），Workers 静态资源同样支持
│  ├─ data_hash.txt           # 歌单数据指纹
│  ├─ favicon.jpg / robots.txt
├─ trans.py                   # Excel → JSON
├─ wrangler.jsonc             # Cloudflare Workers 项目配置（assets.directory 指向 dist）
├─ vite.config.ts
├─ tsconfig.json              # 引用 app / node 两套配置
└─ eslint.config.js
```

搜索语法：空格 / 逗号分隔多个条件（同时满足），`!T:标签` 按标签精确匹配，`!M:金额` 按点歌金额精确匹配，其余按歌名、歌手、拼音备注模糊匹配。

## 本地开发

```bash
# 环境要求：Node >= 22.12
npm install

# 开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建，产物在 dist/
npm run build
npm run preview   # 本地预览构建产物

npm run lint      # ESLint
```

## 歌单数据

修改根目录的 `幽灵歌单整理.xlsx` 后重新生成 JSON（会同时更新 `public/data_hash.txt`）：

```bash
pip install -r requirements.txt
python trans.py          # 等价于 npm run data
```

`trans.py` 会过滤掉标签为「学习中」的曲目，并根据首字拼音生成首字母标签。

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
- `public/_headers`：`/assets/*` 一年强缓存（文件名带 hash）、入口 HTML `must-revalidate`、基础安全响应头；Workers 静态资源同样解析这个文件（对 Worker 代码自己构造的响应不生效，本项目无 Worker 代码，不受影响）；
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

- 托管方式由 Cloudflare Pages 的 `pages_build_output_dir` 改为 Workers 静态资源（`assets.directory`），SPA 回退改用 `not_found_handling` 并移除 `_redirects`（该 catch-all 在 Workers 上会拦截 `/assets/*`）；
- `public/_headers` 补上入口 HTML 的 `must-revalidate`；
- 构建工具由 Create React App（react-scripts 5）迁移到 Vite 8，React 升级到 19，Ant Design 升级到 6；
- 移除 MQTT 在线聊天室（在线人数、广播消息、公告），不再依赖公共 MQTT Broker，页面变为纯静态；
- 单文件 `App.tsx` 拆分到 `components` / `hooks` / `lib`；
- 部署目标由 4everland 调整为 Cloudflare。

## LICENSE

要求不多，标注来源即可。

## 提交歌单

欢迎幽灵车尔尼桑的单推人们 PR 提交歌单。
