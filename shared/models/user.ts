import { z } from "zod";
import { UserPostGroupSchema } from "./user_post_group";
import { PostGroupSchema } from "./post_group";


export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string()
})
export type User = z.infer<typeof UserSchema>

export const GetUsersWithPostGroupsSchema = z.array(UserSchema.extend({
  user_post_groups: z.array(z.object({
    post_groups: PostGroupSchema
  }))
}))
export type GetUsersWithPostGroups = z.infer<typeof GetUsersWithPostGroupsSchema>;