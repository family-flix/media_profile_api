/**
 * @file 国漫
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";

import { describe, expect, test } from "vitest";
import { parse_profile_page_html } from "../utils";

describe("详情解析", () => {
  test("颜心记", () => {
    // const html = fs.readFileSync(path.resolve(__dirname, '../profile.html'), 'utf-8');
    const html = `
	<h1>
	<span property="v:itemreviewed">颜心记</span>
		<span class="year">(2024)</span>
	</h1>
	<div id="mainpic" class="">
	    <a class="nbgnbg" href="https://movie.douban.com/subject/36295511/photos?type=R" title="点击看更多海报">
		<img src="https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2909713609.webp" title="点击看更多海报" alt="颜心记" rel="v:image" />
	   </a>
			    <p class="gact">
				<a href="https://movie.douban.com/subject/36295511/edit">
				    更新描述或海报
				</a>
			    </p>
	</div>
	<div id="info">
		<span><span class='pl'>导演</span>: <span class='attrs'><a href="https://www.douban.com/personage/27484596/" rel="v:directedBy">于中中</a></span></span><br/>
		<span><span class='pl'>编剧</span>: <span class='attrs'><a href="https://www.douban.com/personage/30469492/">胡蓉</a></span></span><br/>
		<span><span class='pl'>主演</span>: <span class='attrs'><a href="https://www.douban.com/personage/27484598/" rel="v:starring">罗云熙</a> / <a href="https://www.douban.com/personage/27547938/" rel="v:starring">宋轶</a> / <a href="https://www.douban.com/personage/27573312/" rel="v:starring">陈瑶</a> / <a href="https://www.douban.com/personage/30203880/" rel="v:starring">丞磊</a> / <a href="https://www.douban.com/personage/27588310/" rel="v:starring">黄日莹</a> / <a href="https://www.douban.com/personage/34866735/" rel="v:starring">古子成</a> / <a href="https://www.douban.com/personage/33418477/" rel="v:starring">管梓净</a> / <a href="https://www.douban.com/personage/30408656/" rel="v:starring">邓凯</a> / <a href="https://www.douban.com/personage/27480776/" rel="v:starring">唐曾</a> / <a href="https://www.douban.com/personage/27548901/" rel="v:starring">黄小蕾</a> / <a href="https://www.douban.com/personage/27588555/" rel="v:starring">洪尧</a> / <a href="https://www.douban.com/personage/27495338/" rel="v:starring">温峥嵘</a> / <a href="https://www.douban.com/personage/27482765/" rel="v:starring">何中华</a> / <a href="https://www.douban.com/personage/27480672/" rel="v:starring">岳跃利</a> / <a href="https://www.douban.com/personage/27545175/" rel="v:starring">曹卫宇</a> / <a href="https://www.douban.com/personage/27503905/" rel="v:starring">刘天佐</a> / <a href="https://www.douban.com/personage/27495047/" rel="v:starring">苑琼丹</a> / <a href="https://www.douban.com/personage/27575009/" rel="v:starring">王一菲</a> / <a href="https://www.douban.com/personage/27484794/" rel="v:starring">崔奕</a> / <a href="https://www.douban.com/personage/27503069/" rel="v:starring">黄一山</a></span></span><br/>
		<span class="pl">类型:</span> <span property="v:genre">喜剧</span> / <span property="v:genre">爱情</span> / <span property="v:genre">悬疑</span> / <span property="v:genre">古装</span><br/>
		
		<span class="pl">制片国家/地区:</span> 中国大陆<br/>
		<span class="pl">语言:</span> 汉语普通话<br/>
		<span class="pl">首播:</span> <span property="v:initialReleaseDate" content="2024-06-21(中国大陆)">2024-06-21(中国大陆)</span><br/>
		
		<span class="pl">集数:</span> 40<br/>
		<span class="pl">单集片长:</span> 45分钟<br/>
		<span class="pl">又名:</span> Follow Your Heart / 内在美中国版<br/>
		<span class="pl">IMDb:</span> tt28143640<br>
	
	</div>
	<script type="text/javascript"></script>`;
    const r = parse_profile_page_html(html);
    expect(r.error).toBe(null);
    if (r.error) {
      console.log(r.error.message);
      return;
    }
    expect(r.data).toStrictEqual({
      name: "颜心记",
      original_name: null,
      air_date: "2024-06-21",
      overview: null,
      source_count: 40,
      alias: "Follow Your Heart / 内在美中国版",
      actors: [
        { id: "27484598", name: "罗云熙", order: 1 },
        { id: "27547938", name: "宋轶", order: 2 },
        { id: "27573312", name: "陈瑶", order: 3 },
        { id: "30203880", name: "丞磊", order: 4 },
        { id: "27588310", name: "黄日莹", order: 5 },
        { id: "34866735", name: "古子成", order: 6 },
        { id: "33418477", name: "管梓净", order: 7 },
        { id: "30408656", name: "邓凯", order: 8 },
        { id: "27480776", name: "唐曾", order: 9 },
        { id: "27548901", name: "黄小蕾", order: 10 },
        { id: "27588555", name: "洪尧", order: 11 },
        { id: "27495338", name: "温峥嵘", order: 12 },
        { id: "27482765", name: "何中华", order: 13 },
        { id: "27480672", name: "岳跃利", order: 14 },
        { id: "27545175", name: "曹卫宇", order: 15 },
        { id: "27503905", name: "刘天佐", order: 16 },
        { id: "27495047", name: "苑琼丹", order: 17 },
        { id: "27575009", name: "王一菲", order: 18 },
        { id: "27484794", name: "崔奕", order: 19 },
        { id: "27503069", name: "黄一山", order: 20 },
      ],
      director: [
        {
          order: 1,
          id: "27484596",
          name: "于中中",
        },
      ],
      author: [
        {
          order: 1,
          id: "30469492",
          name: "胡蓉",
        },
      ],
      vote_average: 0,
      genres: [
        {
          id: 24,
          text: "喜剧",
        },
        {
          id: 13,
          text: "爱情",
        },
        {
          id: 10,
          text: "悬疑",
        },
        {
          id: 30,
          text: "古装",
        },
      ],
      origin_country: "中国大陆",
      imdb: "tt28143640",
    });
  });
});
