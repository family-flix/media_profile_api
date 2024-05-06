import dayjs from "dayjs";
import { NextRequest } from "next/server";

import { TMDBClient } from "@/domains/media_profile/tmdb";
import { Result } from "@/types";
import { store } from "@/store";
import { r_id } from "@/utils";

export async function GET(req: NextRequest) {
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
  const { name, year } = (() => {
    const year_r = /\(([12][0-9][0-9]{2})\)/;
    let year: null | string = null;
    let k = keyword;
    const m1 = k.match(year_r);
    if (m1) {
      year = m1[1];
      k = k.replace(m1[0], "");
    }
    return {
      name: k,
      year,
    };
  })();
  const r = await client.search_movie(name);
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
  const matched_movie = (() => {
    const matched = list.find((movie) => {
      if (movie.first_air_date && year) {
        const d = dayjs(movie.first_air_date).format("YYYY");
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
  const movie_profile_r = await (async () => {
    const r1 = await store.prisma.movie_profile.findFirst({
      where: {
        tmdb_id: String(matched_movie.id),
      },
    });
    if (r1) {
      return Result.Ok(r1);
    }
    const r = await client.fetch_movie_profile(matched_movie.id as number);
    if (r.error) {
      return Result.Err(r.error.message);
    }
    const { name, original_name, overview, poster_path, backdrop_path, air_date, origin_country, genres } = r.data;
    const created = await store.prisma.movie_profile.create({
      data: {
        id: r_id(),
        name,
        original_name,
        alias: "",
        overview,
        poster_path,
        backdrop_path,
        air_date,
        origin_country: origin_country.join("|"),
        genres: genres.map((g) => g.name).join("|"),
        tmdb_id: String(matched_movie.id),
      },
    });
    return Result.Ok(created);
  })();
  if (movie_profile_r.error) {
    return Response.json({
      code: 1001,
      msg: movie_profile_r.error.message,
      data: null,
    });
  }
  const {
    id,
    name: movie_name,
    original_name,
    overview,
    alias,
    air_date,
    poster_path,
    origin_country,
    vote_average,
    original_language,
    runtime,
    genres,
    tmdb_id,
  } = movie_profile_r.data;
  return Response.json({
    code: 0,
    msg: "",
    data: {
      id,
      name: movie_name,
      original_name: original_name === movie_name ? null : original_name,
      alias,
      overview,
      poster_path,
      air_date,
      order: 1,
      vote_average,
      in_production: 0,
      origin_country,
      runtime,
      genres,
      platforms: [
        {
          tmdb_id,
        },
      ],
    },
  });
}
