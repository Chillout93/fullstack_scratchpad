import { PostGroup } from "../../../shared/models/post_group"
import { tryMutation } from "../main"

export const postPostGroups = async (newGroup: PostGroup) => 
    await tryMutation('post_groups', 'POST', newGroup, ['users'])
