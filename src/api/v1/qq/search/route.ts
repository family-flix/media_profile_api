import { QQVideoClient } from "@/domains/media_profile/qq";
import { Request } from "@/types";

export async function GET(req: Request) {
  const {
    query: { keyword },
  } = req;
  const client = new QQVideoClient({});
  const resp = await client.search(keyword);
  if (resp.error) {
    throw new Error(resp.error.message);
  }
  return new Response(JSON.stringify(resp.data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
