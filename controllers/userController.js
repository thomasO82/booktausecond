const {PrismaClient} = require("../generated/prisma/client")
const prisma = new PrismaClient()
exports.displayRegister = async (req, res) => {
    res.render("pages/register.twig")
}

exports.postUser = async (req, res) => {
    try {
        if (req.body.password == req.body.confirm) {
            const user = await prisma.user.create({
                data : {
                    mail: req.body.mail,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                }
            }) 

            res.send('user creer')
        }
    } catch (error) {
        res.json(err)
    }
}