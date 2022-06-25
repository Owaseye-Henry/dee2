const express = require("express")
const router = express.Router()
const customers = require("../Schemas/customer")
const items = require("../Schemas/items")
const orders = require("../Schemas/order")


// function to check if item is in a certain array
function isPresent(cartitem,arr){
   if(arr.indexOf(cartitem)>=0) return true
   else return false
}

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





router.get('/market',async(req,res)=>{
  try{
    let page
    if(req.query.page) page = req.query.page
    else page = 1
     
     const limit = 10
  
    const start = (page - 1) * limit
    const stop = page * limit
    const all = await items.find({})
    allItems = all.slice(start,stop)
    console.log(req.query.page)
    
    res.send(allItems)
  } catch(error){
    console.log('market error ' + error)
  }
 })

 router.get('/market-place',async(req,res)=>{
  try {
    
    let page
    if(req.query.page) page = parseInt(req.query.page)
    else page = 1
     
     const limit = 10
   
    const start = (page - 1) * limit
    const stop = page * limit
    const all = await items.find({})
    allItems = all.slice(start,stop)
   
    res.render('market-items',{allItems})
  } catch (error) {
    console.log("market error " + error)
  }
 
})


router.get('/dashboard',async(req,res)=>{
  try {
      //change to find by id
     const one= await customers.findById(req.session.user._id).populate([{path:"cart",model:["item"]},{path:"orders",model:["order"]}])
     const user = one

     res.send({user})
  } catch (error) {
    console.log(`dashboard error: ${error}`)
  }
})

router.get('/dashboard-page',isAuth,async(req,res)=>{
  try {
    
     res.render('dashboard')
  } catch (error) {
    console.log(`dashboard error: ${error}`)
  }
})

router.get('/item/:id',async(req,res)=>{
    try {
        const item = await items.findById(req.params.id)
        res.render('single-item',{item})
        
    } catch (error) {
        console.log(`get single item error: ${error}`)
    }
  })




router.post('/cart-add/:id',isAuth,async(req,res)=>{
    try {
        const user = await customers.findById(req.session.user._id)
        const item = await items.findById(req.params.id)

        console.log(req.body.quantity); console.log(': body')
         if(!isPresent(item._id,user.cart)){
            let quantity = req.body.quantity
            if(quantity < 1) quantity = 1
            
            if(quantity <= item.AvailableQuantity){
                item.AvailableQuantity = item.AvailableQuantity - quantity
                await item.save()
                user.cart.push(req.params.id)
                user.quantity.push(quantity)
                await user.save()
                res.redirect("/customers/market-place")
            } else{
                res.json("the order more than available quanitity")
            }
         }else{
             res.json("item already in cart")
           }

           

    } catch (error) {
        console.log(`cart-add error: ${error}`)
        res.redirect("/auth/login")
    }
  })

  router.get('/cart-remove/:id',isAuth,async(req,res)=>{
    try {
        const user = await customers.findById(req.session.user._id)
        const item = await items.findById(req.params.id)
        const itemIndex = user.cart.indexOf(req.params.id.toString())
        console.log(item)

        item.AvailableQuantity = item.AvailableQuantity + user.quantity.splice(itemIndex,1)
        await item.save()
        user.cart.splice(itemIndex,1)
        await user.save()
        res.redirect("/customers/dashboard-page")
    } catch (error) {
        console.log(`cart-remove error: ${error}`)
    }
  })

  
module.exports = router