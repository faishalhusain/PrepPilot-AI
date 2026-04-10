import User from "../models/user.model.js"
import Interview from "../models/interview.model.js"

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "user does not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `failed to get current user ${error}` })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const { name, bio, avatarColor } = req.body

        // Validate name
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name is required" })
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name: name.trim(),
                bio: bio?.trim() || "",
                avatarColor: avatarColor || "#4ade80"
            },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json(updatedUser)
    } catch (error) {
        return res.status(500).json({ message: `Failed to update profile: ${error}` })
    }
}

export const getProfileStats = async (req, res) => {
    try {
        const userId = req.userId

        // Get all interviews for this user
        const interviews = await Interview.find({ userId })

        const total = interviews.length
        const completed = interviews.filter(i => i.status === "completed").length
        const avgScore = completed > 0
            ? (interviews.reduce((sum, i) => sum + (i.finalScore || 0), 0) / completed).toFixed(1)
            : 0

        const bestScore = interviews.length > 0
            ? Math.max(...interviews.map(i => i.finalScore || 0))
            : 0

        // Mode breakdown
        const techCount = interviews.filter(i => i.mode === "Technical").length
        const hrCount = interviews.filter(i => i.mode === "HR").length

        // Recent activity (last 5)
        const recent = interviews
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(i => ({
                role: i.role,
                mode: i.mode,
                score: i.finalScore || 0,
                status: i.status,
                date: i.createdAt
            }))

        return res.status(200).json({
            total,
            completed,
            avgScore: parseFloat(avgScore),
            bestScore,
            techCount,
            hrCount,
            recent
        })
    } catch (error) {
        return res.status(500).json({ message: `Failed to get profile stats: ${error}` })
    }
}