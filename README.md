[<img alt="幽头" src="src/assets/avatar.jpg" style="border-radius: 50%; border: pink solid 3px; width: 150px;"></img>](https://u0song.com/)

幽灵车尔尼桑的直播歌单。支持关键字搜索、标签 / 价格快捷筛选、随机点歌与双击复制点歌指令，纯静态、可离线托管。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端框架 | React 19 + TypeScript 5.9 |
| 构建 / 开发服务器 | Vite 8 |
| UI 组件库 | Ant Design 6 + @ant-design/icons 6 |
| 部署 | Cloudflare Pages（静态资源 + 边缘缓存） |
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
│  ├─ _headers                # Cloudflare Pages 响应头（缓存 / 安全）
│  ├─ _redirects              # 单页应用回退
│  ├─ data_hash.txt           # 歌单数据指纹
│  ├─ favicon.jpg / robots.txt
├─ trans.py                   # Excel → JSON
├─ wrangler.jsonc             # Cloudflare Pages 项目配置
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

## Cloudflare Pages 部署

### 方式一：Git 集成（推荐）

1. 将仓库推送到 GitHub / GitLab；
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**，选择本仓库；
3. 构建设置：
   - Framework preset：`None`
   - Build command：`npm run build`
   - Build output directory：`dist`
   - Node 版本：仓库根目录的 `.nvmrc` 已指定 `22`，无需额外配置；
4. 保存并部署，此后每次 push 自动构建。

### 方式二：Wrangler 直传

```bash
npx wrangler login     # 首次需授权
npm run deploy         # 构建后上传 dist 到 v-song-list 项目
```

项目名与产物目录已在 `wrangler.jsonc` 中声明（`name` / `pages_build_output_dir`），如需改名同步修改该文件与 `package.json` 的 `deploy` 脚本。

### 自定义域名

Pages 项目 → **Custom domains** → 添加 `u0song.com`，按提示在 DNS 中添加 CNAME 记录。自定义域名在控制台配置即可，不再需要仓库内的 `CNAME` 文件。

### 部署相关说明

- `public/_headers`：`/assets/*` 长期强缓存（文件名带 hash），HTML 不缓存，附带基础安全响应头；
- `public/_redirects`：`/* /index.html 200`，保证任意路径都能命中单页应用；
- 构建产物为纯静态文件，无服务端依赖。

## 更新记录

- 构建工具由 Create React App（react-scripts 5）迁移到 Vite 8，React 升级到 19，Ant Design 升级到 6；
- 移除 MQTT 在线聊天室（在线人数、广播消息、公告），不再依赖公共 MQTT Broker，页面变为纯静态；
- 单文件 `App.tsx` 拆分到 `components` / `hooks` / `lib`；
- 部署目标由 4everland 调整为 Cloudflare Pages。

## LICENSE

要求不多，标注来源即可。

## 提交歌单

欢迎幽灵车尔尼桑的单推人们 PR 提交歌单。
