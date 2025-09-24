const userRouter = require("express").Router()
const userController = require("../controllers/userController")


userRouter.get('/register' , userController.displayRegister)
userRouter.post('/register', userController.postUser)


module.exports = userRouter