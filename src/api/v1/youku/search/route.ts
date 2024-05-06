import { NextRequest } from "next/server";

import { YoukuClient } from "@/domains/media_profile/youku";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  // const {
  //   query: { keyword },
  // } = req;
  const client = new YoukuClient({});
  const resp = await client.search(query.keyword);
  if (resp.error) {
    throw new Error(resp.error.message);
  }
  return Response.json(resp.data);
}
