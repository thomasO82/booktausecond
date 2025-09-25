const express = require('express');
const userRouter = require('./routers/userRouter');
const session = require('express-session');
const bookRouter = require('./routers/bookRouter');

const app = express()

app.use(express.static("publics"))
app.use(session({
    secret : 'keyboard cat',
    resave : true,
    saveUninitialized : true,
}))

app.use(express.urlencoded({extended: true}))
app.use(userRouter)
app.use(bookRouter)

app.use((req, res) => {
  res.redirect('/home');
});

app.listen(3000, (err)=>{
    console.log(!err ? "connecté au serveur" : err);
})

