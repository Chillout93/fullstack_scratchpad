import { Router } from "express"
import { prisma } from "../db"
import { PostGroupSchema } from "../../shared/models/post_group"

export const postGroups = Router()

postGroups.post('/', async (req, res) => {
  const parsedBody = PostGroupSchema.safeParse(req.body) 
  if (parsedBody.error) {
    res.status(400).json(parsedBody.error)
    return
  }

  await prisma.post_groups.create({
    data: parsedBody.data
  })

  res.json()
})