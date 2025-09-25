const { PrismaClient } = require("../generated/prisma/client")
const prisma = new PrismaClient()

exports.displayAddbook = (req, res) => {
    res.render("pages/addbook.twig",{
        user : req.session.user
    })
}

exports.addBook = async (req, res) => {
    try {
        const book = await prisma.book.create({
            data: {
                title: req.body.title,
                author: req.body.author,
                userId: req.session.user.id
            }
        })
        res.redirect("/home")
    } catch (error) {
        res.render("pages/addbook.twig")
    }
}

exports.removeBook = async (req, res) => {
    try {
        const deletebook = await prisma.book.delete({
            where: {
                id: req.params.id
            }
        })
        res.redirect("/home")
    } catch (error) {
        req.session.errorRequest = "Le livre n'a pas pu etre supprimer"
        res.redirect("/home")

    }
}


exports.displayUpdate = async(req,res)=>{
    const book = await prisma.book.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.render('pages/addbook.twig',{
        book : book,
        errorRequest: req.session.errorRequest,
        user: req.session.user
    })
}

exports.updateBook = async(req,res)=>{
    try {
        
        const bookUpdated = await prisma.book.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                title: req.body.title,
                author: req.body.author
            }
        })
        
        res.redirect("/home")
    } catch (error) {
        req.session.errorRequest = "La modificatiojn du livre a echoué"
        res.redirect("/updatebook/"+req.params.id)
    }
}