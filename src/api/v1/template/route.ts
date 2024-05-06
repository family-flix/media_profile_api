import { YoukuClient } from "@/domains/media_profile/youku";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const client = new YoukuClient({});
  const r = await client.fetch_token();
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
