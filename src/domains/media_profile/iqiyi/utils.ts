import crypto from "crypto";

const w = "howcuteitis";
export function get_sign() {
  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
    r = e.splitKey,
    n = void 0 === r ? "&" : r,
    o = e.secretKey,
    c = void 0 === o ? w : o,
    l = e.key,
    d = void 0 === l ? "secret_key" : l,
    f = Object.keys(t).sort(),
    _ = f.map(function (e) {
      return "".concat(e, "=").concat(t[e]);
    });
  const hash = crypto.createHash("md5");
  return _.push("".concat(d, "=").concat(c)), hash.update(_.join(n)).digest("hex").toUpperCase();
}

export function build_iqiyi_query(extra: Record<string, unknown>) {
  const query = {
    ...extra,
    timestamp: new Date().valueOf(),
    src: "pcw_tvg",
    vip_status: 0,
    vip_type: "",
    auth_cookie: "",
    device_id: "4798183996645ebf3163434564f5252c",
    user_id: "",
    app_version: "6.1.0",
    scale: 200,
  };
  // @ts-ignore
  query.sign = get_sign(query);
  return query;
}

/**
 * 格式化影视剧演职员数据
 * @param people
 */
export function format_people(
  people: Record<
    string,
    {
      name: string;
      image_url: string;
      character?: string[];
    }[]
  >
) {
  const orders: Record<string, number> = { main_character: 1, director: 2, host: 3, guest: 4 };
  Object.keys(people)
    .sort((a, b) => orders[a] - orders[b])
    .map((department) => {
      const arr = people[department];
      return arr.map((p) => {
        const { name, image_url, character } = p;
        return {
          name,
          avatar: image_url,
          character: character ? character.filter(Boolean) : [],
          department,
        };
      });
    })
    .reduce((a, b) => a.concat(b), [])
    .map((p, i) => {
      return {
        ...p,
        order: i + 1,
      };
    });
}
