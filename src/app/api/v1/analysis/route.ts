import { NextRequest } from "next/server";

import { MGTVClient } from "@/domains/media_profile/mgtv";
import { IQiyiClient } from "@/domains/media_profile/iqiyi";
import { YoukuClient } from "@/domains/media_profile/youku";
import { QQVideoClient } from "@/domains/media_profile/qq";
import { TMDBClient } from "@/domains/media_profile/tmdb";
import { Result } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  const { url } = query;
  const u = decodeURIComponent(url);

  if (u.startsWith("https://www.iqiyi.com/")) {
    const client = new IQiyiClient({});
    const r = await client.fetch_profile_with_seasons(u);
    if (r.error) {
      return Response.json({
        code: 1002,
        msg: r.error.message,
        data: null,
      });
    }
    return Response.json({
      code: 0,
      msg: "",
      data: {
        platform: "iqiyi",
        ...r.data,
      },
    });
  }
  //   const client1 = new MGTVClient({});
  //   const client3 = new YoukuClient({});
  //   const client4 = new QQVideoClient({});
  return Response.json({
    code: 1001,
    msg: "未知类型的 url",
    data: null,
  });

  //   const { keyword } = query;
  //   const CLIENT_NAME = ["芒果TV", "爱奇艺", "优酷", "腾讯视频"];
  //   const resp = await Result.All([
  //     client1.search(keyword),
  //     client3.search(keyword),
  //     client4.search(keyword),
  //   ]);
}
