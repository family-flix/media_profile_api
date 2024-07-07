import { Application } from "@/domains/application";
import { DoubanRankClient } from "@/domains/media_rank/douban";

async function main() {
  console.log("Start");
  const app = new Application({
    root_path: "",
  });
  const $douban = new DoubanRankClient({ app });
  const client = $douban;
  const r = await client.fetch_rank({ type: "tv" });
  if (r.error) {
    console.log(`获取详情失败，因为 ${r.error.message}`);
    return;
  }
  console.log(r.data);
  console.log("Success");
}

main();
