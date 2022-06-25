const express = require("express")
const app = express()

const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const mongoose = require("mongoose")
app.use(bodyParser())
app.use(bodyParser.json())

//ejs setup
const ejs = require("ejs")
app.set('view engine','ejs')

// method override
const methodOverride = require("method-override")
app.use(methodOverride("_method"))

//session setup
const session = require("cookie-session")
app.use(session({secret:'secret',
resave:true,
saveUninitialised:true,

maxAge: 1000 * 60 * 15,
cookie:{
    secure: true
       }

}))
const port = process.env.PORT||3000

//set up public folder
app.use(express.static("public"))

// custom middlewares
const  isAdmin = (req,res,next)=>{
    if(req.user.admin) return next()
    else{
        res.redirect('/login-admin123')
    }
}

const isAuth = (req,res,next)=>{
    if (req.session.user||req.session.admin){
        return next()
    }
    else {
        res.redirect('/login')
    }
   }

const loggedout = (req,res,next)=>{
    if(!isAdmin()||!isAuth()) return next()
    else{
        res.redirect('/')
    }
}

//dbconnection
mongoose.connect("mongodb+srv://Owax:August20@database2.3hgrv.mongodb.net/dee?retryWrites=true&w=majority")
.then(()=>console.log('database connected'))
.catch((error)=>{console.log(`database connection error: ${error}`)})

app.get('/',async(req,res)=>{
 const gallery = require("./Schemas/gallery")
 const images = await gallery.find({})

 res.render('home',{images})
})





const Orders = require("./controllers/orders")
const Customers = require("./controllers/customer")
const Admin = require("./controllers/admin")
const Auth = require("./controllers/auth")

app.use("/customers", Customers)
app.use("/orders", Orders)
app.use("/admin",Admin)
app.use("/auth",Auth)

app.listen(port,()=>console.log(`server started on port ${port}`))
