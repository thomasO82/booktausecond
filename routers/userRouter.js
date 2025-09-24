const userRouter = require("express").Router()
const userController = require("../controllers/userController")


userRouter.get('/register' , userController.displayRegister)
userRouter.post('/register', userController.postUser)
userRouter.get('/login',userController.displayLogin)
userRouter.post('/login', userController.login)


module.exports = userRouter