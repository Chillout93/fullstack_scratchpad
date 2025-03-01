import { Router } from "express"
import { Post, PostSchema } from "../../shared/models/post"
import { prisma } from "../db"
import { ZodError } from "zod";

export const posts = Router()

posts.get('/', async (req, res) => {
    const posts: Post[] = await prisma.posts.findMany()
    res.json(posts)
})

posts.post('/', async (req, res) => {
    const parsedBody = PostSchema.safeParse(req.body)
    if (parsedBody.error) {
        res.status(400).json(parsedBody.error)
        return
    }

    await prisma.posts.create({ data: parsedBody.data })

    res.json()
})

posts.patch('/:id', async (req, res) => {
    const id = req.params.id

    const result = PostSchema.partial().safeParse(req.body)
    if (result.error) {
        res.status(400).json(result.error)
        return
    }

    await prisma.posts.update({
        where: { id: id },
        data: result.data
    })

    res.json()
    return
})

posts.delete('/:id', async (req, res) => {
    const id = req.params.id

    await prisma.posts.delete({ where: { id: id }})

    res.json()
})