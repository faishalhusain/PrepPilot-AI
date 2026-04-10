import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser, updateProfile, getProfileStats } from "../controllers/user.controller.js"

const userRouter = express.Router()

userRouter.get("/current-user", isAuth, getCurrentUser)
userRouter.put("/update-profile", isAuth, updateProfile)
userRouter.get("/profile-stats", isAuth, getProfileStats)

export default userRouter