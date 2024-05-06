/**
 * @file 三方客户端
 */
import { describe, expect, test } from "vitest";

import { MaoyanClient } from "../maoyan";
import { md5 } from "js-md5";
import { query_stringify } from "@/utils";

describe("猫眼客户端", () => {
  //   test("md5", () => {
  //     const r = md5(
  //       "method=GET&timeStamp=1714984228166&User-Agent=TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNykgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNC4wLjAuMCBTYWZhcmkvNTM3LjM2&index=802&channelId=40009&sVersion=2&key=A013F70DB97834C0A5492378BD76C53A".replace(
  //         /\s+/g,
  //         " "
  //       )
  //     );
  //     expect(r).toBe("fa89788a634964414a1e9d011ace34d0");
  //   });
  //   test("md5 2", () => {
  //     const d = {
  //       method: "GET",
  //       timeStamp: 1714984228166,
  //       "User-Agent":
  //         "TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNykgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNC4wLjAuMCBTYWZhcmkvNTM3LjM2",
  //       index: 802,
  //       channelId: 40009,
  //       sVersion: 2,
  //       key: "A013F70DB97834C0A5492378BD76C53A",
  //     };
  //     const s = query_stringify(d);
  //     const r = md5(s.replace(/\s+/g, " "));
  //     expect(r).toBe("fa89788a634964414a1e9d011ace34d0");
  //   });
  test("build_query", () => {
    const client = new MaoyanClient();
    const result = client.build_query({ day: "20240506", index: 251, timestamp: 1714983348684 });
    expect(result).toStrictEqual({
      timeStamp: 1714983348684,
      "User-Agent":
        "TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNykgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNC4wLjAuMCBTYWZhcmkvNTM3LjM2",
      index: 251,
      signKey: "1fa2dd43ba7451b4182b5974973e5ff5",
      channelId: 40009,
      sVersion: 2,
    });
  });
  test("build_query2", () => {
    const client = new MaoyanClient();
    const result = client.build_query({
      day: "20240506",
      timestamp: 1714983780169,
      index: 408,
    });
    expect(result).toStrictEqual({
      timeStamp: 1714983780169,
      "User-Agent":
        "TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNykgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyNC4wLjAuMCBTYWZhcmkvNTM3LjM2",
      index: 408,
      channelId: 40009,
      sVersion: 2,
      signKey: "b24cc63c8e1ffadce522caa00621efd2",
    });
  });
});
