import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import dayjs from "dayjs";

import { brand } from "./utils/text";
import { app } from "./store/index";
import { static_serve } from "./middlewares/static";
import { YoukuClient } from "./domains/media_profile/youku";
import { IQiyiClient } from "./domains/media_profile/iqiyi";
import { MaoyanClient } from "./domains/media_rank/maoyan";

const DEFAULT_PORT = 3201;

async function main() {
  const server = new Hono<{ Bindings: {}; Variables: {} }>();
  // server.use(logger());
  server.use(
    "/profile/*",
    static_serve({
      root: "./",
      rewriteRequestPath(path) {
        if (path.includes("assets")) {
          return path;
        }
        return "./profile/index.html";
      },
    })
  );
  server.use(
    "/poster/*",
    static_serve({
      root: app.assets,
    })
  );
  server.use(
    "/thumbnail/*",
    static_serve({
      root: app.assets,
    })
  );
  server.use(
    "/subtitle/*",
    static_serve({
      root: app.assets,
    })
  );
  server.use(
    "/logs/*",
    static_serve({
      root: app.root_path,
    })
  );
  // server.use(async (c, next) => {
  //   c.env.store = store;
  //   await next();
  // });

  server.get("/api/ping", async (c) => {
    return c.json({
      code: 0,
      msg: "ok",
      data: null,
    });
  });
  server.post("/media_profile/v1/analysis", async (c) => {
    const { url } = await c.req.json();
    const u = decodeURIComponent(url);
    if (u.startsWith("https://www.iqiyi.com/")) {
      const client = new IQiyiClient({});
      const r = await client.fetch_profile_with_seasons(u);
      if (r.error) {
        return c.json({
          code: 1002,
          msg: r.error.message,
          data: null,
        });
      }
      return c.json({
        code: 0,
        msg: "",
        data: r.data,
      });
    }
    if (u.startsWith("https://v.youku.com/")) {
      const client = new YoukuClient({});
      const r = await client.fetch_profile_with_seasons(u);
      if (r.error) {
        return c.json({
          code: 1002,
          msg: r.error.message,
          data: null,
        });
      }
      return c.json({
        code: 0,
        msg: "",
        data: r.data,
      });
    }
    //   const client1 = new MGTVClient({});
    //   const client3 = new YoukuClient({});
    //   const client4 = new QQVideoClient({});
    return c.json({
      code: 1001,
      msg: "未知类型的 url",
      data: null,
    });
  });
  server.post("/api/v1/season_profile", async (c) => {
    const { id, platform } = await c.req.json();
    const u = decodeURIComponent(id);
    if (platform === "iqiyi") {
      const client = new IQiyiClient({});
      const r = await client.fetch_season_profile(u);
      if (r.error) {
        return c.json({
          code: 1002,
          msg: r.error.message,
          data: null,
        });
      }
      return c.json({
        code: 0,
        msg: "",
        data: r.data,
      });
    }
    if (platform === "youku") {
      const client = new YoukuClient({});
      const r = await client.fetch_season_profile(u);
      if (r.error) {
        return c.json({
          code: 1002,
          msg: r.error.message,
          data: null,
        });
      }
      return c.json({
        code: 0,
        msg: "",
        data: r.data,
      });
    }
    return c.json({
      code: 1001,
      msg: "未知的 platform",
      data: null,
    });
  });
  server.post("/api/v1/media_rank", async (c) => {
    const client = new MaoyanClient();
    const r = await client.fetch({ day: dayjs().format("YYYYMMDD") });
    if (r.error) {
      return c.json({
        code: 101,
        msg: r.error.message,
        data: null,
      });
    }
    return c.json({
      code: 0,
      msg: "",
      data: r.data,
    });
  });

  serve(
    {
      fetch: server.fetch,
      port: (() => {
        if (app.env.PORT) {
          return Number(app.env.PORT);
        }
        if (app.args.port) {
          return app.args.port;
        }
        return DEFAULT_PORT;
      })(),
    },
    (info) => {
      const { address, port } = info;
      brand();
      console.log("Env");
      console.log("----------");
      console.log();
      const env_keys = ["ROOT_DIR", "PORT"];
      Object.keys(app.env)
        .filter((key) => env_keys.includes(key))
        .forEach((key) => {
          console.log(`${key}    ${app.env[key as keyof typeof app.env]}`);
        });
      console.log("Args");
      console.log("----------");
      Object.keys(app.args).forEach((key) => {
        console.log(`${key.toUpperCase()}    ${app.args[key as keyof typeof app.args]}`);
      });
      console.log();
      console.log("Paths");
      console.log("----------");
      console.log("Assets", app.assets);
      console.log("Database ", app.database_path);
      console.log();
      console.log();
      console.log();
      const pathname = "/profile/home/index";
      console.log(`> Ready on http://${address}:${port}${pathname}`);
    }
  );
}
main();
