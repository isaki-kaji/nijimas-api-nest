import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1746859688740 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE "users" (
  "uid" char(28) PRIMARY KEY,
  "username" varchar(255) NOT NULL,
  "user_code" char(6) UNIQUE NOT NULL,
  "self_intro" text,
  "profile_image_url" text,
  "country_code" char(2),
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "version" int NOT NULL DEFAULT 1
);

CREATE TABLE "posts" (
  "post_id" uuid PRIMARY KEY,
  "uid" char(28) NOT NULL,
  "main_category" varchar(20) NOT NULL,
  "post_text" text,
  "photo_url" text,
  "expense" numeric(15,2) NOT NULL DEFAULT 0,
  "location" text,
  "public_type_no" char(1) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "delete_at" timestamptz,
  "version" int NOT NULL DEFAULT 1
);

CREATE TABLE "post_subcategories" (
  "post_id" uuid,
  "category_no" char(1),
  "category_id" uuid NOT NULL,
  PRIMARY KEY ("post_id", "category_no")
);

CREATE TABLE "favorites" (
  "post_id" uuid,
  "uid" char(28),
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  PRIMARY KEY ("post_id", "uid")
);

CREATE TABLE "main_categories" (
  "category_name" varchar(20) PRIMARY KEY,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "sub_categories" (
  "category_id" uuid PRIMARY KEY,
  "category_name" varchar(50) UNIQUE NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "follows" (
  "uid" char(28),
  "following_uid" char(28),
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  PRIMARY KEY ("uid", "following_uid")
);

CREATE TABLE "follow_requests" (
  "request_id" uuid PRIMARY KEY,
  "uid" char(28) NOT NULL,
  "following_uid" char(28) NOT NULL,
  "status" char(1) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now()),
  "version" int NOT NULL DEFAULT 1
);

CREATE TABLE "user_top_subcategories" (
  "uid" char(28),
  "category_no" char(1),
  "category_id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  PRIMARY KEY ("uid", "category_no")
);

CREATE INDEX ON "users" ("username");

CREATE INDEX ON "posts" ("uid");

CREATE INDEX ON "follows" ("following_uid");

CREATE INDEX ON "follow_requests" ("uid", "following_uid");

COMMENT ON COLUMN "posts"."public_type_no" IS '0:公開、1:フォロワーにのみ公開、2:非公開';

COMMENT ON COLUMN "follow_requests"."status" IS '0:申請中, 1:承認済, 2:拒否済';

ALTER TABLE "posts"
  ADD FOREIGN KEY ("uid") REFERENCES "users" ("uid");

ALTER TABLE "posts"
  ADD FOREIGN KEY ("main_category") REFERENCES "main_categories" ("category_name");

ALTER TABLE "post_subcategories"
  ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("post_id");

ALTER TABLE "post_subcategories"
  ADD FOREIGN KEY ("category_id") REFERENCES "sub_categories" ("category_id");

ALTER TABLE "favorites"
  ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("post_id");

ALTER TABLE "favorites"
  ADD FOREIGN KEY ("uid") REFERENCES "users" ("uid");

ALTER TABLE "follows"
  ADD FOREIGN KEY ("uid") REFERENCES "users" ("uid");

ALTER TABLE "follows"
  ADD FOREIGN KEY ("following_uid") REFERENCES "users" ("uid");

ALTER TABLE "follow_requests"
  ADD FOREIGN KEY ("uid") REFERENCES "users" ("uid");

ALTER TABLE "follow_requests"
  ADD FOREIGN KEY ("following_uid") REFERENCES "users" ("uid");

ALTER TABLE "user_top_subcategories"
  ADD FOREIGN KEY ("uid") REFERENCES "users" ("uid");

ALTER TABLE "user_top_subcategories"
  ADD FOREIGN KEY ("category_id") REFERENCES "sub_categories" ("category_id");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE user_top_subcategories;
            DROP TABLE follow_requests;
            DROP INDEX idx_follow_requests_uid_following_uid;
            DROP TABLE follows;
            DROP INDEX idx_follows_uid_following_uid;
            DROP TABLE favorites;
            DROP TABLE post_subcategories;
            DROP TABLE posts;
            DROP INDEX idx_posts_uid;
            DROP TABLE sub_categories;
            DROP TABLE main_categories;
            DROP TABLE users;
            DROP INDEX idx_username;
        `);
  }
}
