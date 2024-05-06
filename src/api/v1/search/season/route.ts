import dayjs from "dayjs";
import { NextRequest } from "next/server";

import { store } from "@/store/index";
import { TMDBClient } from "@/domains/media_profile/tmdb";
import { Result } from "@/types/index";
import { r_id } from "@/utils/index";

function map_season_number(num: string) {
  const NUMBER_TEXT_MAP: Record<string, number> = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
    十一: 11,
    十二: 12,
    十三: 13,
    十四: 14,
    十五: 15,
    十六: 16,
    十七: 17,
    十八: 18,
    十九: 19,
    二十: 20,
  };
  if (num.match(/[0-9]{1,}/)) {
    return Number(num);
  }
  const n = NUMBER_TEXT_MAP[num];
  if (n) {
    return n;
  }
  return num;
}
function format_season_name(season_name: string, tv: { name: string }) {
  const r1 = /^第 {0,1}([0-9]{1,}) {0,1}季$/;
  const r2 = /^第 {0,1}([一二三四五六七八九十]{1,}) {0,1}季$/;
  const r3 = /特别[季篇]/;
  const r4 = /^Season {0,1}([0-9]{1,})$/;
  const r5 = /^Series {0,1}([0-9]{1,})$/;
  const r6 = /^Series {0,1}([0-9]{1,})$/;
  const name = tv.name;
  if (season_name.match(r1)) {
    return [name, season_name.replace(/ /g, "")].join(" ");
  }
  if (season_name.match(r2)) {
    return [name, season_name.replace(/ /g, "")].join(" ");
  }
  if (season_name.match(r4)) {
    return [name, season_name.replace(/ /g, "")].join(" ");
  }
  if (season_name.match(r5)) {
    return [name, season_name.replace(/ /g, "")].join(" ");
  }
  if (season_name.match(r3)) {
    return [name, season_name.replace(/ /g, "")].join(" ");
  }
  return season_name;
}

export async function v1_search_season(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  const { keyword, platform } = query;

  if (!keyword) {
    return Response.json({
      code: 1001,
      msg: "请传入 keyword",
      data: null,
    });
  }
  const client = new TMDBClient({
    token: "c2e5d34999e27f8e0ef18421aa5dec38",
  });
  const { name, season_text, season_number, year } = (() => {
    const r1 = / {0,1}第 {0,1}([0-9]{1,}) {0,1}季/;
    const r2 = / {0,1}第 {0,1}([一二三四五六七八九十]{1,}) {0,1}季/;
    const r3 = / {0,1}[sS]([0-9]{1,})/;
    const year_r = /\(([12][0-9][0-9]{2})\)/;
    let year: null | string = null;
    let k = keyword;
    const m1 = k.match(year_r);
    if (m1) {
      year = m1[1];
      k = k.replace(m1[0], "");
    }
    const regexps = [r1, r2, r3];
    for (let i = 0; i < regexps.length; i += 1) {
      const regexp = regexps[i];
      const m = k.match(regexp);
      if (m) {
        const season_text = m[0];
        const season_number = map_season_number(m[1]);
        const name = k.replace(season_text, "").trim();
        return {
          name,
          season_text,
          season_number,
          year,
        };
      }
    }
    return {
      name: k,
      season_text: null,
      season_number: null,
      year,
    };
  })();
  const r = await client.search_tv(name);
  if (r.error) {
    return Response.json({
      code: 1001,
      msg: r.error.message,
      data: null,
    });
  }
  const list = r.data.list;
  if (list.length === 0) {
    return Response.json({
      code: 0,
      msg: "",
      data: null,
    });
  }
  const matched_tv = (() => {
    const matched = list.find((tv) => {
      if (tv.first_air_date && year) {
        const d = dayjs(tv.first_air_date).format("YYYY");
        if (d === year) {
          return true;
        }
      }
      return false;
    });
    if (matched) {
      return matched;
    }
    const matched2 = list.find((tv) => {
      if (tv.name !== null && tv.name === name) {
        return true;
      }
      if (tv.original_name !== null && tv.original_name === name) {
        return true;
      }
      return false;
    });
    if (matched2) {
      return matched2;
    }
    return list[0];
  })();
  const tv_profile_r = await (async () => {
    const r1 = await store.prisma.series.findFirst({
      where: {
        tmdb_id: String(matched_tv.id),
      },
      include: {
        seasons: {
          include: {
            episodes: true,
          },
        },
      },
    });
    if (r1) {
      return Result.Ok(r1);
    }
    const r = await client.fetch_tv_profile(matched_tv.id as number);
    if (r.error) {
      return Result.Err(r.error.message);
    }
    const {
      name,
      original_name,
      overview,
      poster_path,
      backdrop_path,
      first_air_date,
      seasons,
      origin_country,
      genres,
    } = r.data;
    const created = await store.prisma.series.create({
      data: {
        id: r_id(),
        name,
        original_name,
        alias: "",
        overview,
        poster_path,
        backdrop_path,
        first_air_date: first_air_date,
        origin_country: origin_country.join("|"),
        genres: genres.map((g) => g.name).join("|"),
        tmdb_id: String(matched_tv.id),
      },
      include: {
        seasons: {
          include: {
            episodes: true,
          },
        },
      },
    });
    for (let i = 0; i < seasons.length; i += 1) {
      await (async () => {
        const season = seasons[i];
        const {
          name: season_name,
          overview,
          season_number,
          air_date,
          poster_path,
          episode_count,
          vote_average,
        } = season;
        const season_tmdb_id = [created.tmdb_id, season_number].join("/");
        const existing = await store.prisma.season_profile.findFirst({
          where: {
            tmdb_id: season_tmdb_id,
          },
          include: {
            episodes: true,
          },
        });
        if (existing) {
          created.seasons.push(existing);
          return;
        }
        const created_season = await store.prisma.season_profile.create({
          data: {
            id: r_id(),
            name: format_season_name(season_name, { name }),
            alias: "",
            overview,
            poster_path,
            air_date,
            vote_average,
            order: season_number,
            episode_count,
            origin_country: created.origin_country,
            genres: created.genres,
            tv_profile_id: created.id,
            in_production: 0,
            tmdb_id: season_tmdb_id,
          },
          include: {
            episodes: true,
          },
        });
        created.seasons.push(created_season);
      })();
    }
    return Result.Ok(created);
  })();
  if (tv_profile_r.error) {
    return Response.json({
      code: 1001,
      msg: tv_profile_r.error.message,
      data: null,
    });
  }
  const { id: series_id, name: series_name, original_name, seasons } = tv_profile_r.data;
  // console.log(name, season_number, year);
  const matched_season = (() => {
    if (season_number === null) {
      const matched = seasons.find((s) => s.order === 1);
      if (matched) {
        return matched;
      }
    }
    const matched = seasons.find((s) => s.order === season_number);
    if (!matched) {
      return seasons[0];
    }
    return matched;
  })();
  const {
    id,
    name: season_name,
    alias,
    overview,
    poster_path,
    air_date,
    order,
    episode_count,
    vote_average,
    in_production,
    origin_country,
    genres,
    tmdb_id,
  } = matched_season;
  const episodes = await (async () => {
    if (matched_season.episodes.length === 0) {
      const season_profile_r = await client.fetch_season_profile({
        tv_id: Number(tv_profile_r.data.tmdb_id),
        season_number: order,
      });
      if (season_profile_r.error) {
        return [];
      }
      const episode_records: {
        id: string;
        name: string;
        overview: null | string;
        air_date: null | string;
        still_path: null | string;
        order: number;
        runtime: number;
        // tmdb_id: null | string;
      }[] = [];
      for (let i = 0; i < season_profile_r.data.episodes.length; i += 1) {
        const { name, overview, air_date, still_path, episode_number, runtime } = season_profile_r.data.episodes[i];
        const episode_tmdb_id = [tv_profile_r.data.tmdb_id, order, episode_number].join("/");
        await (async () => {
          const existing = await store.prisma.episode_profile.findFirst({
            where: {
              tmdb_id: episode_tmdb_id,
            },
          });
          if (existing) {
            const { id } = existing;
            episode_records.push({
              id,
              name,
              overview,
              air_date,
              still_path,
              order: episode_number,
              runtime,
            });
            return;
          }
          const created = await store.prisma.episode_profile.create({
            data: {
              id: r_id(),
              name,
              overview,
              still_path,
              order: episode_number,
              air_date,
              runtime,
              tmdb_id: episode_tmdb_id,
              season_profile_id: id,
            },
          });
          episode_records.push({
            id: created.id,
            name,
            overview,
            air_date,
            still_path,
            order: episode_number,
            runtime,
          });
        })();
      }
      return episode_records;
    }
    return matched_season.episodes.map((episode) => {
      const { id, name, overview, air_date, still_path, order, runtime } = episode;
      return {
        id,
        name,
        overview,
        air_date,
        still_path,
        order,
        runtime,
      };
    });
  })();
  const data = {
    id,
    name: season_name,
    original_name,
    alias,
    overview,
    poster_path,
    air_date,
    order,
    episode_count,
    vote_average,
    in_production,
    origin_country,
    genres,
    platforms: [
      {
        tmdb_id,
      },
    ],
    episodes,
    series: {
      id: series_id,
      name: series_name,
      original_name: tv_profile_r.data.original_name,
      overview: tv_profile_r.data.overview,
      air_date: tv_profile_r.data.first_air_date,
      platforms: [
        {
          tmdb_id: tv_profile_r.data.tmdb_id,
        },
      ],
    },
  };
  return Response.json({
    code: 0,
    msg: "",
    data,
  });
}
