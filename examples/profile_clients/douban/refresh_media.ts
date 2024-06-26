import { Application } from "@/domains/application";
// import { User } from "@/domains/user";
// import { MediaProfileClient } from "@/domains/media_profile";
import { DoubanClient } from "@/domains/media_profile/douban";

async function main() {
  console.log("Start");
  const OUTPUT_PATH = process.env.OUTPUT_PATH;
  if (!OUTPUT_PATH) {
    console.error("缺少数据库文件路径");
    return;
  }
  const client = new DoubanClient({});
  const r = await client.fetch_media_profile('');
  if (r.error) {
    console.log(r.error.message);
    return;
  }
  console.log(r.data);
  console.log("Success");
}

main();
