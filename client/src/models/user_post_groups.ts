import { UserPostGroup } from "../../../shared/models/user_post_group"
import { tryMutation } from "../main"

export const postUserPostGroups = async (userPostGroup: UserPostGroup) => await tryMutation('user_post_groups', 'POST', userPostGroup, ['users'])