import { MGTVClient } from "@/domains/media_profile/mgtv";
import { Request } from "@/types";

export async function handler(req: Request) {
  const {
    query: { keyword },
  } = req;
  const client = new MGTVClient({});
  const resp = await client.search_tv(keyword);
  if (resp.error) {
    throw new Error(resp.error.message);
  }
  return new Response(JSON.stringify(resp.data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
