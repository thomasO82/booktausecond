const session = require("express-session")
const { PrismaClient } = require("../generated/prisma/client")
const hashExtension = require("../middleware/extensions/userHashPassword")
const validateUser = require("../middleware/extensions/validateUser")
const prisma = new PrismaClient().$extends(validateUser).$extends(hashExtension)
const bcrypt = require('bcrypt') // Ajoute cette ligne en haut du fichier

exports.displayRegister = async (req, res) => {
    res.render("pages/register.twig")
}

exports.postUser = async (req, res) => {
    try {
        if (req.body.password == req.body.confirm) {
            const user = await prisma.user.create({
                data: {
                    mail: req.body.mail,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                }
            })

            res.redirect('/login')

        }else{
            const error = new Error("Mot de passe non correspondant")
            error.confirm = error.message
            throw error
            
        }
    } catch (error) {
        if (error.code == 'P2002') {
            res.render("pages/register.twig", {
                duplicateEmail: "Email deja utilisé"
            })
        } else {
            res.render("pages/register.twig", {
                errors: error.details,
                confirmError: error.confirm ? error.confirm : null
            })
        }

    }
}

exports.displayLogin = async (req,res)=>{
    res.render("pages/login.twig")
}


exports.login = async (req,res)=>{
    try {

        const user = await prisma.user.findUnique({
            where: {
                mail: req.body.mail
            }
        })
        if (user) {
            if (bcrypt.compareSync(req.body.password,user.password)) {
                req.session.user = user
                res.redirect('/home')
            }else{
                throw {password: "mauvais mot de passe"}
            }
        }else{
            throw {mail: "Cet ustilisateur n'est pas enregistrer"}
        }
    } catch (error) {
        res.render("pages/login.twig", {
            error:error
        })
    }
}


exports.displayHome = async (req,res)=>{
    res.render("pages/home.twig" , {
        user: req.session.user
    })
}