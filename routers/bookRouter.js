const bookRouter = require('express').Router()
const bookController = require('../controllers/bookController')
const authGuard = require('../middleware/services/authguard')

bookRouter.get('/addbook', authGuard, bookController.displayAddbook)
bookRouter.post('/addbook', authGuard,bookController.addBook)
bookRouter.get("/removebook/:id",authGuard , bookController.removeBook)
bookRouter.get("/updatebook/:id", authGuard, bookController.displayUpdate)
bookRouter.post("/updatebook/:id" , authGuard , bookController.updateBook)


module.exports = bookRouter