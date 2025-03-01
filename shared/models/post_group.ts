import { z } from "zod";
import { PostSchema } from "./post";

export const PostGroupSchema = z.object({
    id: z.string().uuid(),
    name: z.string()
});
export type PostGroup = z.infer<typeof PostGroupSchema>;

export const PostGroupWithPostsSchema = PostGroupSchema.pick({
    id: true,
}).merge(z.object({
    posts: z.array(PostSchema.pick({
        id: true,
        content: true
    }))
}))

export type PostGroupWithPosts = z.infer<typeof PostGroupWithPostsSchema>
