const userRouter = require("express").Router()
const userController = require("../controllers/userController")
const authGuard = require("../middleware/services/authguard")


userRouter.get('/register' , userController.displayRegister)
userRouter.post('/register', userController.postUser)
userRouter.get('/login',userController.displayLogin)
userRouter.post('/login', userController.login)
userRouter.get('/home', authGuard, userController.displayHome)


module.exports = userRouter