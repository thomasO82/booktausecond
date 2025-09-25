const { PrismaClient } = require("../../generated/prisma/client")
const prisma = new PrismaClient()

const authguard = async (req, res, next) => {
    try {
        if (req.session.user) {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.session.user.id
                }
            })
            if (user) {
                return next()
            }
        }
        throw new Error("Utilisateur non connecté")
    } catch (error) {
        res.redirect('/login')
    }
}

module.exports = authguard