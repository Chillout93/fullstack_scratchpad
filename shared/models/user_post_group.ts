import { z } from "zod";

export const UserPostGroupSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    post_group_id: z.string().uuid()
});
export type UserPostGroup = z.infer<typeof UserPostGroupSchema>;