import {
  episode_profile,
  movie_profile,
  person_in_media,
  person_profile,
  PrismaClient,
  season_profile,
  tv_profile,
} from "@prisma/client";

export type TVProfileRecord = tv_profile;
export type SeasonProfileRecord = season_profile;
export type EpisodeProfileRecord = episode_profile;
export type MovieProfileRecord = movie_profile;
export type PersonProfileRecord = person_profile;
export type PersonRecord = person_in_media;

export type RecordCommonPart = {
  id: string;
};

export type ModelKeys = keyof Omit<
  PrismaClient,
  | "$on"
  | "$connect"
  | "$disconnect"
  | "$use"
  | "$executeRaw"
  | "$executeRawUnsafe"
  | "$queryRaw"
  | "$queryRawUnsafe"
  | "$transaction"
  | "$extends"
  | symbol
>;

export type ModelParam<F extends (...args: any[]) => any> = NonNullable<Parameters<F>[number]>;
export type ModelQuery<T extends ModelKeys> = NonNullable<Parameters<PrismaClient[T]["findMany"]>[0]>["where"];
export type TVProfileWhereInput = NonNullable<ModelQuery<"tv_profile">>;
export type SeasonProfileWhereInput = NonNullable<ModelQuery<"season_profile">>;
export type EpisodeProfileWhereInput = NonNullable<ModelQuery<"episode_profile">>;
export type MovieProfileWhereInput = NonNullable<ModelQuery<"movie_profile">>;
