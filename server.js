const express = require('express');
const userRouter = require('./routers/userRouter');


const app = express()

app.use(express.static("publics"))
app.use(express.urlencoded({extended: true}))
app.use(userRouter)

app.listen(3000, (err)=>{
    console.log(!err ? "connecté au serveur" : err);
})