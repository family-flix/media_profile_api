import { QQVideoClient } from "@/domains/media_profile/qq";
import { Request } from "@/types";

export async function handler(req: Request) {
  const {
    query: { id },
  } = req;
  const client = new QQVideoClient({});
  const resp = await client.fetch_season_profile({ season_number: id });
  if (resp.error) {
    throw new Error(resp.error.message);
  }
  return new Response(JSON.stringify(resp.data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
