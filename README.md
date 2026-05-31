# 一起玩 · 双人对战游戏

和对方异地联网对战:五子棋、中国象棋、井字棋、黑白棋。一方创建房间拿到 4 位房间码 + 邀请链接,另一方加入即可开局。所有走子由服务端权威校验并实时同步。

## 本地运行

```bash
npm install
npm install --prefix client
npm run dev
```

打开 http://localhost:5173 。测试双人:开两个标签页(各自是独立座位),一个选游戏创建房间,另一个用房间码加入。

## 打包 / 部署形态

```bash
npm run build   # 打包前端到 client/dist
npm start       # 单进程:Express 托管前端 + Socket.IO,监听 PORT(默认 3001)
```

打包后只需跑一个 Node 进程,前端和实时通信同源。

### 部署到公网(Render 为例)

1. 推到 GitHub,在 [Render](https://render.com) 新建 **Web Service** 指向仓库。
2. Build Command:`npm install && npm run build`
3. Start Command:`npm start`
4. Render 自动注入 `PORT`,部署完成后把网址发给对方即可一起玩。

> Railway / Fly.io 等同理,关键是 build 跑 `npm run build`、start 跑 `npm start`。

## 说明与取舍

- **中国象棋**:实现七种棋子完整走法(含蹩马腿、隔山打牛、塞象眼、九宫/河界约束),胜负采用「吃掉对方将/帅即获胜」的简化,不做完整将军/将死判定 —— 休闲对战足够。
- **黑白棋**:无合法落点时自动跳过,双方均无子可下时按子数判胜负。
- **刷新重连**:座位绑定在浏览器标签页的持久 id 上,刷新页面用同一房间码可回到原座位。
- **安全**:无账号系统,房间码是唯一访问门槛,适合两人私下玩;走子一律服务端校验,客户端无法伪造非法步。

## 加新游戏

在 `server/games/` 下新增一个模块,实现 `createInitialState / validateMove / applyMove / checkResult` 接口并在 `server/games/index.js` 注册,再加一个对应的 Board 组件即可。
