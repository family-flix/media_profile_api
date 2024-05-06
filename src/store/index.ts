/**
 * @file 全局单例
 */
import { season_profile, series } from "@prisma/client";

import { Application } from "@/domains/application";
import { parse_argv } from "@/utils/server";

export const app = new Application({
  root_path: process.env.OUTPUT_PATH || process.cwd(),
  env: process.env as Record<string, string>,
  args: parse_argv<{ port: number }>(process.argv.slice(2)),
});
export const store = app.store;

export type TVProfile = series;
export type TVSeasonProfile = season_profile;

export type BaseApiResp<T> = {
  code: number;
  msg: string;
  data: T;
};

export type ListResponse<T> = {
  total: number;
  page: number;
  page_size: number;
  list: T[];
};
