const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const orders = require("../Schemas/order");
const product = require("../Schemas/items")
const gallery = require("../Schemas/gallery")
const formidable = require("express-formidable")

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
    if(!isAdmin||!isAuth) return next()
    else{
        res.redirect('/')
    }
}

router.get("/admin",isAdmin,async(req,res)=>{
    const items = await product.find()
    const images = await gallery.find()
    console.log(req.session.admin)
    
 res.render("admin-page",{items,images})

})
router.post("/create-product",isAdmin,formidable(), async(req,res)=>{
    try {
        const {description,name,price,quantity} = req.fields
        const image = '/media/' + req.files.image.name
        const oldPath =  req.files.image.path
        const date = new Date().toString()
        const newPath = path.resolve(__dirname,'..//public/media/'+ req.files.image.name)
            if(!fs.existsSync(newPath)){
                // fs.renameSync(oldPath,newPath)
                let oldInfo = fs.readFileSync(oldPath)
                fs.writeFileSync(newPath,oldInfo)
    
        
            const newProduct = new product({
                description,
                image,
                itemName:name,
                price,
                date, 
                AvailableQuantity:quantity})
            await newProduct.save()
            console.log(newProduct)
            res.redirect('/admin/admin')
            }
    
} catch (error) {
         console.error(error)
         res.redirect("/admin/admin")
        
        }


})


router.post("/gallery",isAdmin,formidable(), async(req,res)=>{
    try {
        const {name,description} = req.fields
        const image = '/gallery/' + req.files.image.name
        const oldPath =  req.files.image.path
        const newPath = path.resolve(__dirname,'..//public/gallery/'+ req.files.image.name)
            if(!fs.existsSync(newPath)){
                //fs.renameSync(oldPath,newPath)
                let oldInfo = fs.readFileSync(oldPath)
                fs.writeFileSync(newPath,oldInfo)
        
            const newPicture = new gallery({image,name,description})
            await newPicture.save()
            console.log(newPicture)
            res.redirect('/admin/admin')
            }
    
} catch (error) {
         console.error(error)}

})

router.get("/gallery-one/:id",isAdmin,async(req,res)=>{
    const image = await gallery.findById(req.params.id)
    res.render('single-image',{image})
})

router.delete("/gallery/:id",isAdmin,formidable(), async(req,res)=>{
    try {
       const one = await  gallery.findById(req.params.id)
       const newpath = path.resolve(__dirname , '..//public/' +one.image)
        console.log(newpath)
        fs.unlinkSync(newpath)
        await one.remove()
        res.render('success',{message:'you succesfully deleted image',url:"/admin/admin"})
       res.redirect('/admin/admin')
            
} catch (error) {
         console.error(error)}

})



router.get('/editSingle/:id',isAdmin, async (req,res)=>{
    try {
        const single = await product.findById(req.params.id)
         res.render('edit-single-item',{single})
         console.log(single)
    } catch (error) {
        console.log('edit error' + error)
    }
})
router.put("/editSingle/:id",isAdmin,async(req,res)=>{
    try {
        const one = await product.findById(req.params.id)
        const{description,name,price} = req.body
        one.description = description
        one.itemName = name;
        one.price = price 
        await one.save()
        res.render('success',{message:'you successfully updated an item',url:'/admin/admin'})
    } catch (error) {
        console.error(error)
    }
})


router.get("/get-orders",isAdmin,async(req,res)=>{
    try {
        const allOrders = await orders.find({}).populate("orderitems")
        console.log(allOrders)
        res.render('view-orders-admin',{allOrders})
    } catch (error) {
        console.log(error)
    }
})

router.get('/get-one-order/:id',isAdmin,async(req,res)=>{
    
    try {
        const one = await orders.findById(req.params.id).populate('orderitems')
        res.render('get-single-order',{one})
    } catch (err) {
        console.log(err)
    }
})

router.get("/delivered/:id",isAdmin, async(req,res)=>{
    try {
        const one = await orders.findById(req.params.id)
        one.delivered = true;
        await one.save()
        res.redirect('/admin/get-orders')
    } catch (error) {
        console.log(error)
    }
})

router.delete("/delete-order/:id",isAdmin,async(req,res)=>{
    try {
        const order = await orders.findByIdAndRemove(req.params.id)
        res.redirect('getOrders')
    } catch (error) {
        console.log(error)
    }
})


router.delete("/deleteSingle/:id",isAdmin,async(req,res)=>{
    try {
        const one = await product.findById(req.params.id)
        console.log(one)
        const newpath = path.resolve(__dirname , '..//public/' +one.image)
        console.log(newpath)
        fs.unlinkSync(newpath)
        await one.remove()
        res.render('success',{message:'you succesfully deleted image',url:"/admin/admin"})
        
    } catch (error) {
        console.error(error)
        res.redirect("/admin/admin")
    }
})

module.exports = router