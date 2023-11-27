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

  const { id, platform } = query;
  const u = decodeURIComponent(id);

  if (platform === "iqiyi") {
    const client = new IQiyiClient({});
    const r = await client.fetch_season_profile(u);
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
      data: r.data,
    });
  }
  return Response.json({
    code: 1001,
    msg: "未知的 platform",
    data: null,
  });
}
