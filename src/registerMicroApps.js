import { registerMicroApps, start } from "qiankun";

const isDev = process.env.NODE_ENV == "development";

registerMicroApps([
  {
    name: "zs-screen", // 子应用名称
    entry: isDev ? "//localhost:8888" : "https://views.het8023.top/c/", // 子应用运行服务地址（就是npm run dev时的那个地址）
    container: "#container", // 挂载容器（id=container）
    activeRule: "/big-screen", // 激活路由(在哪个路由下加载子应用,需要和子应用的路由名称对应)
  },
]);

start();
