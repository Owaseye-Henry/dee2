const express = require("express")
const router  = express.Router()
const bcrypt = require("bcrypt")
const users = require("../Schemas/customer")
const Admin = require("../Schemas/admin")


 function isAdmin(req,res,next){
    if(req.session.admin) return next()
    else{
        res.redirect('/auth/login-admin123')
    }
}

function isAuth (req,res,next){
    if (req.session.user||req.session.admin){
        return next()
    }
    else {
        res.redirect('/auth/login')
    }
   }

function loggedout (req,res,next){
    if(!req.session.admin||!req.session.user) return next()
    else{
        res.redirect('/')
    }
}

router.get("/register",loggedout, async(req,res)=>{
    try {
        res.render('register',{url1:"/auth/register", url2:"/auth/login"})
    } catch (error) {
        console.log(error)
    }
  })

router.get("/register-admin123",loggedout,async(req,res)=>{
    try {
        res.render('register',{url1:"/auth/register-admin123", url2:"/auth/login-admin123"})
    } catch (error) {
        console.log(error)
    }
})


router.post("/register",async(req,res)=>{
    try {
        const {Firstname,Surname,Email,Address,Phoneno,Username,Password1,Password2}= req.body
        let Password;
        const Fullname = `${Firstname} ${Surname}`
        if(Password1 == Password2){
            const securePassword = await bcrypt.hash(Password1,12)
            Password = securePassword;
            const newUser = new users({firstname:Firstname,
                surname:Surname,
                fullname:Fullname,
                email:Email,
                address:Address,
                phonenumber:Phoneno,
                username:Username,
                password:Password})
            await newUser.save()

            res.render('login',{url:"/auth/login",signup:"/auth/register",message:`you have successfully signed up,please login`})
            console.log(newUser)

        }
       
    } catch (error) {
        console.log(error)
    }
})

router.post("/register-admin123",async(req,res)=>{
    try {
        const {Firstname,Surname,Email,Username,Password1,Password2}= req.body
        let Password;
        const Fullname = `${Firstname} ${Surname}`
        if(Password1 == Password2){
            const securePassword = await bcrypt.hash(Password1,12)
            Password = securePassword;
            const newUser = new Admin({name:Fullname,
                email:Email,
                username:Username,
                password:Password
            })
            await newUser.save()

            res.render('login',{url:"/auth/login-admin123",signup:"/auth/register-admin123",message:`you have successfully signed up,please login`})
            console.log(newUser)

        }
       
    } catch (error) {
        console.log(error)
    }
})

//edit user 
router.get("/editUser",isAuth, async(req,res)=>{
    try {
        const user = req.session.user
        res.render('edit-user',{user})
        
    } catch (error) {
        console.log(error)
    }
})
router.put("/editUser/:id",isAuth,async(req,res)=>{
    try {
        let user =await users.findById(req.params.id)
        const {Firstname,Surname,Email,Address,Phoneno,Username,Password1,Password2}= req.body
        let Password;
        const Fullname = `${Firstname} ${Surname}`
        if(Password1 == Password2){
            const securePassword = await bcrypt.hash(Password1,12)
            Password = securePassword;

            user.firstname = Firstname;
            user.surname = Surname;
            user.email = Email;
            user.fullname = Fullname;
            user.address = Address;
            user.Phoneno = Phoneno;
            user.username = Username;
            user.password = Password;
            await user.save()

            console.log(user)
            res.render('success',{message:`You have successfully updated your profile`,url:'/'})

        }
       
    } catch (error) {
        console.log(error)
    }
})

//edit admin
router.get("/edit-admin123",isAdmin,async(req,res)=>{
    try {
        const user = req.session.user
        res.render('edit-admin',{user})
        
    } catch (error) {
        console.log(error)
    }
})
router.put("/edit-admin123/:id",isAdmin,async(req,res)=>{
    try {
        let user = await Admin.findById(req.params.id)
        const {Firstname,Surname,Email,Username,Password1,Password2}= req.body
        let Password;
        const Fullname = `${Firstname} ${Surname}`
        if(Password1 == Password2){
            const securePassword = await bcrypt.hash(Password1,12)
            Password = securePassword;

            
            user.email = Email;
            user.fullname = Fullname;
            user.username = Username;
            user.password = Password;
            await user.save()

            console.log(user)
            res.render('success',{message:`You have successfully updated your profile`,url:'/'})

        }
       
    } catch (error) {
        console.log(error)
    }
})

router.get("/login",loggedout,async(req,res)=>{
    try {
        res.render('login',{url:'/auth/login',signup:"register",message:""})
    } catch (error) {
        console.log(error)
    }
})

router.get("/login-admin123",loggedout,async(req,res)=>{
    try {
        res.render('login',{url:'/auth/login-admin123',signup:"register-admin123",message:""})
    } catch (error) {
        console.log(error)
    }
})

router.post("/login",async(req,res)=>{
    try {
        const {Username,Password} = req.body
        const user = await users.findOne({username:Username})
        console.log(user)
    
    
        if(!user)
        {
            res.render('login',{url:'/auth/login',signup:"register",message:"invalid username or password"})
        }
        const passwordHash = bcrypt.compareSync(Password, user.password)
        if(!passwordHash)
        {
            res.render('login',{url:'/auth/login',signup:"register",message:"invalid username or password"})
        }
        else{
            req.session.user = user;
            req.session.save(function (err) {
                if (err) return next(err)
                
              })

              res.redirect('/customers/market-place')
        }

    } catch (error) {
        console.log(error)
    }
})

router.post("/login-admin123",async(req,res)=>{
    try {
        const {Username,Password} = req.body
        const user = await Admin.findOne({username:Username})
    
        if(!user)
        {
            res.render('login',{url:'/auth/login-admin123',signup:"register-admin123",message:"invalid username or password"})
        }
        const passwordHash = bcrypt.compareSync(Password, user.password)
        if(!passwordHash)
        {
            res.render('login',{url:'/auth/login-admin123',signup:"register-admin123",message:"invalid username or password"})
        }
        else{
            req.session.user = user;
            req.session.admin = user
            req.session.save(function (err) {
                if (err) return next(err)
            
              })

              res.redirect('/admin/admin')
        }

    } catch (error) {
        console.log("admin login error" + error)
    }
})
router.get("/logout",async(req,res)=>{
    try {
        req.session.user = null;
        req.session.save((err)=>{if(err) next(err)
        })
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
})

router.get("/logout-admin123",async(req,res)=>{
    try {
        req.session.user = null;
        req.session.admin=null
        req.session.save((err)=>{if(err) next(err)
        })

        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;