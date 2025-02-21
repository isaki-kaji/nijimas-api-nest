import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1739794603357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE users (
                uid CHAR(28) PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                self_intro TEXT,
                profile_image_url TEXT,
                country_code CHAR(2),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                version INT NOT NULL DEFAULT 1
            );

            CREATE INDEX idx_username ON users(username);

            CREATE TABLE main_categories (
                category_name VARCHAR(20) PRIMARY KEY,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );

            CREATE TABLE sub_categories (
                category_id UUID PRIMARY KEY,
                category_name VARCHAR(50) NOT NULL UNIQUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );

            CREATE TABLE posts (
                post_id UUID PRIMARY KEY,
                uid CHAR(28) NOT NULL REFERENCES users(uid),
                main_category VARCHAR(20) NOT NULL REFERENCES main_categories(category_name),
                post_text TEXT,
                photo_url TEXT,
                expense NUMERIC(15, 2) NOT NULL DEFAULT 0,
                location TEXT,
                public_type_no CHAR(1) NOT NULL CHECK (public_type_no IN ('0', '1', '2')),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                version INT NOT NULL DEFAULT 1
            );

            CREATE INDEX idx_posts_uid ON posts(uid);

            CREATE TABLE post_subcategories (
                post_id UUID NOT NULL REFERENCES posts(post_id),
                category_no CHAR(1) NOT NULL,
                category_id UUID NOT NULL REFERENCES sub_categories(category_id),
                PRIMARY KEY (post_id, category_no)
            );

            CREATE TABLE favorites (
                post_id UUID NOT NULL REFERENCES posts(post_id),
                uid CHAR(28) NOT NULL REFERENCES users(uid),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                PRIMARY KEY (post_id, uid)
            );

            CREATE TABLE follows (
                uid CHAR(28) NOT NULL REFERENCES users(uid),
                following_uid CHAR(28) NOT NULL REFERENCES users(uid),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                PRIMARY KEY (uid, following_uid)
            );

            CREATE INDEX idx_follows_uid_following_uid ON follows(uid, following_uid);

            CREATE TABLE follow_requests (
                request_id UUID PRIMARY KEY,
                uid CHAR(28) NOT NULL REFERENCES users(uid),
                following_uid CHAR(28) NOT NULL REFERENCES users(uid),
                status CHAR(1) NOT NULL CHECK (status IN ('0', '1', '2')),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                version INT NOT NULL DEFAULT 1
            );

            CREATE INDEX idx_follow_requests_uid_following_uid ON follow_requests(uid, following_uid);

            CREATE TABLE user_top_subcategories (
                uid CHAR(28) NOT NULL REFERENCES users(uid),
                category_no CHAR(1) NOT NULL,
                category_id UUID NOT NULL REFERENCES sub_categories(category_id),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                PRIMARY KEY (uid, category_no)
            );
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
