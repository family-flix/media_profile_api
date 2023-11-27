import { IQiyiClient } from "@/domains/media_profile/iqiyi";
import { Request } from "@/types";

export async function handler(req: Request) {
  const {
    query: { keyword },
  } = req;
  const client = new IQiyiClient({});
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
