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
  const client1 = new MGTVClient({});
  const client2 = new IQiyiClient({});
  const client3 = new YoukuClient({});
  const client4 = new QQVideoClient({});

  const { keyword } = query;
  const CLIENT_NAME = ["芒果TV", "爱奇艺", "优酷", "腾讯视频"];
  const resp = await Result.All([
    client1.search(keyword),
    client2.search(keyword),
    client3.search(keyword),
    client4.search(keyword),
  ]);
  console.log(resp);
  return Response.json(
    resp
      .map((r, i) => {
        if (r.error) {
          return null;
        }
        return {
          name: CLIENT_NAME[i],
          list: r.data.list,
        };
      })
      .filter(Boolean)
  );
}
