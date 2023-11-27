-- CreateTable
CREATE TABLE "TVProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "original_name" TEXT,
    "alias" TEXT NOT NULL DEFAULT '',
    "overview" TEXT,
    "poster_path" TEXT,
    "backdrop_path" TEXT,
    "first_air_date" TEXT,
    "original_language" TEXT,
    "origin_country" TEXT NOT NULL DEFAULT '',
    "genres" TEXT NOT NULL DEFAULT '',
    "episode_count" INTEGER NOT NULL DEFAULT 0,
    "season_count" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SeasonProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "overview" TEXT,
    "poster_path" TEXT,
    "air_date" TEXT,
    "season_number" INTEGER NOT NULL DEFAULT 0,
    "episode_count" INTEGER NOT NULL DEFAULT 0,
    "vote_average" REAL NOT NULL DEFAULT 0,
    "in_production" INTEGER NOT NULL DEFAULT 0,
    "tv_profile_id" TEXT,
    CONSTRAINT "SeasonProfile_tv_profile_id_fkey" FOREIGN KEY ("tv_profile_id") REFERENCES "TVProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EpisodeProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "overview" TEXT,
    "air_date" TEXT,
    "episode_number" INTEGER NOT NULL,
    "season_number" INTEGER NOT NULL,
    "runtime" INTEGER,
    "season_profile_id" TEXT,
    CONSTRAINT "EpisodeProfile_season_profile_id_fkey" FOREIGN KEY ("season_profile_id") REFERENCES "SeasonProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MovieProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "original_name" TEXT,
    "alias" TEXT,
    "overview" TEXT,
    "poster_path" TEXT,
    "backdrop_path" TEXT,
    "air_date" TEXT,
    "original_language" TEXT,
    "origin_country" TEXT NOT NULL DEFAULT '',
    "genres" TEXT NOT NULL DEFAULT '',
    "runtime" INTEGER
);

-- CreateTable
CREATE TABLE "PersonProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "profile" TEXT NOT NULL DEFAULT '',
    "alias" TEXT,
    "biography" TEXT,
    "profile_path" TEXT,
    "birthday" TEXT,
    "place_of_birth" TEXT,
    "known_for_department" TEXT
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "known_for_department" TEXT,
    "season_id" TEXT,
    "movie_id" TEXT,
    "profile_id" TEXT NOT NULL,
    CONSTRAINT "Person_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "SeasonProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Person_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "MovieProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Person_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "PersonProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
