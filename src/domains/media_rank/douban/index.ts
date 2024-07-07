/**
 * @doc https://movie.douban.com/
 */
import axios, { AxiosError } from "axios";
import cheerio from "cheerio";

import { Application } from "@/domains/application";
import { Result } from "@/types";
import { query_stringify } from "@/utils";

type DoubanRankClientProps = {
  app: Application<any>;
};

export class DoubanRankClient {
  app: Application<any>;

  constructor(props: DoubanRankClientProps) {
    const { app } = props;

    this.app = app;
  }

  async fetch(values: { day?: string }) {
    const url = "https://movie.douban.com/";
    try {
      const response = await axios.get<string>("https://movie.douban.com/", {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
          "cache-control": "max-age=0",
          cookie:
            'll="118172"; bid=5Xl9IozntGw; _pk_id.100001.4cf6=bf22ae92b28a206b.1695618434.; _vwo_uuid_v2=D957497ABA9DF829CC64A873BCBE82F04|ab904a7d9bbbae8c70206562cd807822; __yadk_uid=l3xj8dXBn5ReXm0jeHma2hELqDzfPsVe; Hm_lvt_16a14f3002af32bf3a75dfe352478639=1699629142; douban-fav-remind=1; __utmc=30149280; __utmc=223695111; __utmz=30149280.1713675404.131.38.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utmz=223695111.1713675404.119.86.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); FCNEC=%5B%5B%22AKsRol9sN3_Q_zWZx0ye34qao8Spy1EiIE_n5hes8Kuq-WgAFGhaZtIy35-0N0WNsa8tGTLjKSsahbci88-iTMI7Sno6v-sScWiWb9ugViAu_7ag5lUjavPw4X5sXqLaxMMqgjLsNIgU8DttcV8muJOq0ZsvjCyuXA%3D%3D%22%5D%5D; __gads=ID=9bb5d251828b5555:T=1711775652:RT=1715569745:S=ALNI_MaodknbcGS8JUR4MNMrEW2OKvwfdg; __gpi=UID=00000d7804225160:T=1711775652:RT=1715569745:S=ALNI_MZt3YSiDl9PKGP_3Uup3r3iAazHzA; __eoi=ID=43e80f218d7b92ad:T=1711775652:RT=1715569745:S=AA-AfjYFr3u7wyfErfrxzvPdCRx5; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1715589226%2C%22https%3A%2F%2Fwww.google.com.hk%2F%22%5D; _pk_ses.100001.4cf6=1; ap_v=0,6.0; __utma=30149280.95808197.1695618434.1715569745.1715589226.143; __utmb=30149280.0.10.1715589226; __utma=223695111.489190197.1695618434.1715569745.1715589226.129; __utmt=1; __utmb=223695111.1.10.1715589226',
          priority: "u=0, i",
          "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      });
      const html = response.data;
      const $ = cheerio.load(html);
      //       const $list = $(".result-list>.result");
      return Result.Ok({});
    } catch (err) {
      const e = err as AxiosError;
      return Result.Err(e.message);
    }
  }
  async fetch_rank(opt: { type: "tv" | "movie" }) {
    const { type } = opt;
    try {
      const browser = await this.app.startBrowser();
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
      );
      const params = {
        type,
        tag: "热门",
        page_limit: "50",
        page_start: "0",
      };
      await page.goto(["https://movie.douban.com/j/search_subjects", query_stringify(params)].join("?"));
      const html = await page.content();
      const content_string = html.match(/<pre>(.*)<\/pre>/)?.[1];
      if (!content_string) {
        return Result.Err("没有 json 内容");
      }
      const data: {
        subjects: {
          /** 集数描述 */
          episodes_info: string;
          /** 评分 */
          rate: string;
          cover_x: number;
          /** 影视剧名称 */
          title: string;
          /** 详情地址 */
          url: string;
          /** 是否可播放 */
          playable: boolean;
          /** 封面地址 */
          cover: string;
          /** 豆瓣ID */
          id: string;
          cover_y: number;
          /** 是否新上映 */
          is_new: boolean;
        }[];
      } = JSON.parse(content_string);
      return Result.Ok({
        list: data.subjects.map((record, index) => {
          const { title, episodes_info, rate, id } = record;
          return {
            name: title,
            order: index + 1,
            rate: rate ? Number(rate) : null,
            extra_text: episodes_info || null,
            douban_id: id,
          };
        }),
      });
    } catch (err) {
      const e = err as AxiosError;
      return Result.Err(e.message);
    }
  }
}
