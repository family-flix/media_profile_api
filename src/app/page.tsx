"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [values, setValues] = useState<null | {
    type: "season" | "movie";
    name: string;
    poster_path: string;
    seasons: {
      name: string;
      overview: string;
      poster_path: string;
      air_date: string;
      episodes: {
        name: string;
        episode_number: number;
        air_date: string;
        thumbnail: string;
      }[];
      persons: {
        name: string;
        avatar: string;
      }[];
      genres: string[];
      origin_country: string[];
    }[];
  }>(null);
  const [curSeason, setCurSeason] = useState<null | {
    name: string;
    overview: string;
    poster_path: string;
    air_date: string;
    episodes: {
      name: string;
      episode_number: number;
      air_date: string;
      thumbnail: string;
    }[];
    persons: {
      name: string;
      avatar: string;
    }[];
    genres: string[];
    origin_country: string[];
  }>(null);

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div>
        <div className="text-2xl text-center">抓取影视剧详情</div>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-4 p-8">
            <div>
              <input
                value={url}
                placeholder="请输入要抓取的影视剧播放页地址"
                onChange={(event) => {
                  setUrl(event.currentTarget.value);
                }}
              />
            </div>
            <div>
              <button
                onClick={async () => {
                  setValues(null);
                  setCurSeason(null);
                  const r = await fetch(`/api/v1/analysis?url=${encodeURIComponent(url)}`);
                  const json = await r.json();
                  if (json.code !== 0) {
                    alert(json.msg);
                    return;
                  }
                  const { type, platform, name, poster_path, seasons } = json.data;
                  setValues((prev) => {
                    return {
                      ...prev,
                      type,
                      platform,
                      name,
                      poster_path,
                      seasons,
                    };
                  });
                  if (type === "season") {
                    for (let i = 0; i < seasons.length; i += 1) {
                      await (async () => {
                        const season = seasons[i];
                        const { id } = season;
                        const r = await fetch(`/api/v1/season_profile?id=${id}&platform=${platform}`);
                        const season_json = await r.json();
                        if (season_json.code !== 0) {
                          return;
                        }
                        const d = season_json.data;
                        setValues((prev) => {
                          if (prev === null) {
                            return prev;
                          }
                          return {
                            ...prev,
                            seasons: [...prev.seasons.slice(0, i), d, ...prev.seasons.slice(i + 1)],
                          };
                        });
                      })();
                    }
                  }
                }}
              >
                抓取
              </button>
            </div>
          </div>
        </div>
        {(() => {
          if (values === null) {
            return null;
          }
          const { type, seasons } = values;
          if (type === "movie") {
            const profile = seasons[0];
            if (!profile) {
              return null;
            }
            const { name, overview, poster_path, air_date, origin_country, genres, persons } = profile;
            return (
              <div>
                <div className="flex">
                  <div className="mr-4">
                    <img className="w-[180px]" src={poster_path} alt={name} />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl">{name}</div>
                    <div className="">{overview}</div>
                    <div className="mt-4">
                      {air_date} {origin_country.map((t) => t).join("、")}
                    </div>
                    <div className="mt-2 flex gap-3">
                      {genres.map((g) => {
                        return <div key={g}>{g}</div>;
                      })}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {persons.map((person) => {
                        const { name, avatar } = person;
                        return (
                          <div key={name}>
                            <img className="w-[40px] h-[40px] object-cover rounded-full" src={avatar} alt={name} />
                            <div className="break-all text-center">{name}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-8">
                      <button
                        onClick={() => {
                          console.log(JSON.stringify(profile, null, 2));
                        }}
                      >
                        打印
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          if (type === "season") {
            return (
              <div className="profile">
                <div className="flex flex-wrap gap-3 mt-8">
                  {seasons.map((season) => {
                    const { name, poster_path, air_date } = season;
                    return (
                      <div
                        key={name}
                        className="w-[120px]"
                        onClick={() => {
                          setCurSeason(season);
                        }}
                      >
                        <div className="relative w-full h-[160px] bg-gray-200">
                          {poster_path ? (
                            <img className="w-full h-full object-cover" src={poster_path} alt={name} />
                          ) : null}
                          <div className="absolute bottom-1 left-1">{air_date}</div>
                        </div>
                        <div>{name}</div>
                      </div>
                    );
                  })}
                </div>
                {(() => {
                  if (!curSeason) {
                    return null;
                  }
                  const {
                    name,
                    poster_path,
                    overview,
                    air_date,
                    genres,
                    origin_country,
                    episodes = [],
                    persons,
                  } = curSeason;
                  return (
                    <div className="mt-8">
                      <div className="flex">
                        <div className="mr-4">
                          <img className="w-[180px]" src={poster_path} alt={name} />
                        </div>
                        <div className="flex-1">
                          <div className="text-2xl">{name}</div>
                          <div className="">{overview}</div>
                          <div className="mt-4">
                            {air_date} {origin_country.map((t) => t).join("、")}
                          </div>
                          <div className="mt-2 flex gap-3">
                            {genres.map((g) => {
                              return <div key={g}>{g}</div>;
                            })}
                          </div>
                          <div className="flex flex-wrap gap-3 mt-4">
                            {persons.map((person) => {
                              const { name, avatar } = person;
                              return (
                                <div key={name}>
                                  <img
                                    className="w-[40px] h-[40px] object-cover rounded-full"
                                    src={avatar}
                                    alt={name}
                                  />
                                  <div className="break-all text-center">{name}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-4">
                        {episodes.map((episode) => {
                          const { name, episode_number, air_date, thumbnail } = episode;
                          return (
                            <div key={name} className="w-[120px]">
                              <div className="relative w-full">
                                <img className="w-full" src={thumbnail} alt={name} />
                                <div className="absolute left-1 bottom-1">{air_date}</div>
                              </div>
                              <div className="mt-2 break-all">{name}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-8">
                        <button
                          onClick={async () => {
                            console.log(JSON.stringify(curSeason, null, 2));
                            // const r = await fetch("/api/v1/create_season", {
                            //   body: JSON.stringify(curSeason),
                            //   method: "POST",
                            // });
                            // const r1 = await r.json();
                            // console.log(r1);
                          }}
                        >
                          打印
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          }
        })()}
      </div>
    </main>
  );
}
