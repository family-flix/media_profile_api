/**
 * @file 猫眼
 * https://piaofang.maoyan.com/dashboard/webHeatData
 */
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { md5 } from "js-md5";

import { Result } from "@/types/index";
import { query_stringify } from "@/utils/index";

/**
 * 获取排行榜
 * @param query
 * @returns
 */
function fetchHeatData(query: {
  timeStamp: number;
  "User-Agent": string;
  index: number;
  channelId: number;
  sVersion: number;
  signKey: string;
  showDate: string;
  uuid: string;
  seriesId: null;
  seriesType: null;
  platformType: null;
  limit: null;
}) {
  return axios.get<{
    status: boolean;
    dataList: {
      list: {
        barValue: number;
        /** 当前热度 */
        currHeat: number;
        /** 当前热度 文本 */
        currHeatDesc: string;
        /** 影视剧信息 */
        seriesInfo: {
          /** 影视剧名称 */
          name: string;
          /** 是否新上映？ */
          newSeries: boolean;
          /** 所在平台 */
          platformDesc: string;
          /** 所在平台 id */
          platformTxt: number;
          /** 上线天数 */
          releaseInfo: string;
          /** 电视剧 id */
          seriesId: number;
        };
      }[];
      updateInfo: {
        updateGapSecond: number;
        updateTimestamp: number;
      };
    };
    /** 指定影视剧详细 */
    webHeatDetail: {
      data: {
        /** 评论总数 */
        commentCount: string;
        /** 热度趋势 */
        heatTrends: {
          /** 日期 YYYYMMDD 格式 */
          date: number;
          /** 热度数值 */
          heat: number;
        }[];
        /** 历史最大热度 */
        historyMaxHeat: number;
        /** 历史最大热度所在日期 */
        historyMaxHeatDate: string;
        /** 影视剧信息 */
        seriesInfo: {
          category: string;
          imgUrl: string;
          name: string;
          platformDesc: string;
          releaseInfo: string;
          seriesId: number;
        };
        sumCommentCountSplitUnit: {
          num: number;
          unit: string;
        };
      };
      success: boolean;
    };
    currentIndex: number;
    /** 日历 */
    calendar: {
      /** 今天 YYYY-MM-DD 格式 */
      today: string;
      selectMinDate: string;
      selectMaxDate: string;
      defaultSelect: string;
      /** 服务器时间 UTC 格式 */
      serverTimestamp: string;
      /** 选择的时间 */
      selectDate: string;
    };
  }>("https://piaofang.maoyan.com/dashboard/webHeatData", {
    params: query,
  });
}

export class MaoyanRankClient {
  build_query(values: { day: string; index: number; timestamp: number }) {
    const part = {
      method: "GET",
      //       uuid: "9498cbd7-3179-42f2-a8ce-159944aa8309",
      timeStamp: values.timestamp,
      "User-Agent":
        "TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNykgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNC4wLjAuMCBTYWZhcmkvNTM3LjM2",
      index: values.index,
      channelId: 40009,
      sVersion: 2,
      key: "A013F70DB97834C0A5492378BD76C53A",
    };
    const signKey = md5(query_stringify(part).replace(/\s+/g, " "));
    return {
      "User-Agent": part["User-Agent"],
      channelId: part["channelId"],
      index: values.index,
      sVersion: part["sVersion"],
      signKey,
      timeStamp: part["timeStamp"],
    };
  }
  async fetch(values: { day: string }) {
    const index = Math.floor(1e3 * Math.random() + 1);
    const query = this.build_query({ day: values.day, index, timestamp: dayjs().valueOf() });
    try {
      const resp = await fetchHeatData({
        ...query,
        ...{
          showDate: values.day,
          seriesType: null,
          platformType: null,
          limit: null,
          seriesId: null,
          uuid: "9498cbd7-3179-42f2-a8ce-159944aa8309",
        },
      });
      return Result.Ok(resp.data);
    } catch (err) {
      const e = err as AxiosError;
      return Result.Err(e.message);
    }
  }
}
