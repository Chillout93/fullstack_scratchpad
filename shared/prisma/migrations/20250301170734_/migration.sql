-- CreateTable
CREATE TABLE "post_groups" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "test" TEXT NOT NULL,

    CONSTRAINT "post_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "content" VARCHAR(10) NOT NULL,
    "group_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "test" TEXT DEFAULT 'foobar',

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_post_groups" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "post_group_id" UUID NOT NULL,

    CONSTRAINT "user_post_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_posts_group_id" ON "posts"("group_id");

-- CreateIndex
CREATE INDEX "idx_posts_user_id" ON "posts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_post_groups_user_id_post_group_id_key" ON "user_post_groups"("user_id", "post_group_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "post_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_post_groups" ADD CONSTRAINT "user_post_groups_post_group_id_fkey" FOREIGN KEY ("post_group_id") REFERENCES "post_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_post_groups" ADD CONSTRAINT "user_post_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
