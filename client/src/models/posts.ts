import { tryMutation } from "../main"
import { RequestACallback } from "../../../shared/types"
import { Post } from "../../../shared/models/post"

export const postPost = async (post: Post) => await tryMutation('posts', 'POST', post, ['posts'])
export const patchPost = async (id: string, post: Partial<Post>) => await tryMutation(`posts/${id}`, 'PATCH', post, ['posts'])
export const deletePost = async (id: string) => await tryMutation(`posts/${id}`, 'DELETE', {}, ['posts'])


