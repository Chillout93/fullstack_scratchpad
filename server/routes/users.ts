import { Router } from "express"
import { prisma } from "../db"
import { GetUsersWithPostGroups } from "../../shared/models/user"

export const users = Router()

users.get("/", async (req, res) => {
  const users: GetUsersWithPostGroups = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      user_post_groups: {
        select: {
          post_groups: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })
  res.send(users)
})
