import { Router } from "express"
import { prisma } from "../db"
import { app } from "../main"
import { UserPostGroupSchema } from "../../shared/models/user_post_group"

export const userPostGroups = Router()

userPostGroups.post('/', async (req, res) => {
   const result = UserPostGroupSchema.safeParse(req.body)
    if (result.error) {
        res.status(400).json(result.error)
        return
    }
    
    await prisma.user_post_groups.create({ data: result.data })

    res.json()
})
