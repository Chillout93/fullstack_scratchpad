import { z } from "zod";

export const PostSchema = z.object({
    id: z.string().uuid(),
    content: z.string(),
    group_id: z.string().uuid(),
    user_id: z.string().uuid(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date()
});
export type Post = z.infer<typeof PostSchema>;
