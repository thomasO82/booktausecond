// Importation de PrismaClient et des extensions personnalisées
const { PrismaClient } = require("../generated/prisma/client")
const hashExtension = require("../middleware/extensions/userHashPassword")
const validateUser = require("../middleware/extensions/validateUser")
// On étend PrismaClient avec les extensions de validation et de hashage
const prisma = new PrismaClient().$extends(validateUser).$extends(hashExtension)
// Importation de bcrypt pour le hash et la comparaison des mots de passe
const bcrypt = require('bcrypt')

// Affiche la page d'inscription
exports.displayRegister = async (req, res) => {
    res.render("pages/register.twig")
}

// Traite la soumission du formulaire d'inscription
exports.postUser = async (req, res) => {
    try {
        // Vérifie si les deux mots de passe correspondent
        if (req.body.password == req.body.confirm) {
            // Crée un nouvel utilisateur en base (validation et hashage via extensions Prisma)
            const user = await prisma.user.create({
                data: {
                    mail: req.body.mail,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                }
            })
            // Redirige vers la page de connexion après inscription réussie
            res.redirect('/login')
        } else {
            // Si les mots de passe ne correspondent pas, on lève une erreur personnalisée
            const error = new Error("Mot de passe non correspondant")
            error.confirm = error.message
            throw error
        }
    } catch (error) {
        // Gestion des erreurs lors de l'inscription
        if (error.code == 'P2002') {
            // Erreur d'unicité (email déjà utilisé)
            res.render("pages/register.twig", {
                duplicateEmail: "Email deja utilisé"
            })
        } else {
            // Autres erreurs de validation ou de confirmation
            res.render("pages/register.twig", {
                errors: error.details,
                confirmError: error.confirm ? error.confirm : null
            })
        }
    }
}

// Affiche la page de connexion
exports.displayLogin = async (req,res)=>{
    res.render("pages/login.twig")
}

// Traite la soumission du formulaire de connexion
exports.login = async (req,res)=>{
    try {
        // Recherche l'utilisateur en base par son email
        const user = await prisma.user.findUnique({
            where: {
                mail: req.body.mail
            }
        })
        if (user) {
            // Si l'utilisateur existe, on compare le mot de passe fourni avec le hash stocké
            if (bcrypt.compareSync(req.body.password,user.password)) {
                // Si le mot de passe est correct, on stocke l'utilisateur dans la session
                req.session.user = user
                // Redirige vers la page d'accueil
                res.redirect('/home')
            } else {
                // Si le mot de passe est incorrect, on lève une erreur personnalisée
                throw {password: "mauvais mot de passe"}
            }
        } else {
            // Si l'utilisateur n'existe pas, on lève une erreur personnalisée
            throw {mail: "Cet ustilisateur n'est pas enregistrer"}
        }
    } catch (error) {
        // Affiche les erreurs dans la vue login
        res.render("pages/login.twig", {
            error:error
        })
    }
}

// Affiche la page d'accueil avec la liste des livres de l'utilisateur connecté
exports.displayHome = async (req,res)=>{
    // Recherche l'utilisateur connecté et ses livres en base
    const user = await prisma.user.findUnique({
        where : {
            id: req.session.user.id
        },
        include : {
            books: true
        }
    })
    // Affiche la page home avec l'utilisateur et un éventuel message d'erreur
    res.render("pages/home.twig", {
        user: user,
        errorDelete: req.session.errorRequest
    })
    // Supprime le message d'erreur de la session après affichage
    delete req.session.errorRequest
}

// Déconnecte l'utilisateur en détruisant la session et redirige vers la page de connexion
exports.logout = async (req,res)=>{
    req.session.destroy()
    res.redirect('/login')
}


