const express = require("express")
const router = express.Router()
const customer = require("../Schemas/customer")
const items = require("../Schemas/items")
const orders = require("../Schemas/order")
const got = require("got")
const flutterWave = require("flutterwave-node-v3")
const flw = new flutterWave( "FLWPUBK_TEST-c22197f552879d58fc3db046f4bfe6cf-X", "FLWSECK_TEST-fe5f630464efb1bc8a5ac766c7287922-X")
 //custom middlewares
function isAdmin(req,res,next){
  if(req.session.admin) return next()
  else{
      res.redirect('/auth/login-admin123')
  }
}

function isAuth(req,res,next){
  if (req.session.user||req.session.admin){
      return next()
  }
  else {
      res.redirect('.auth/login')
  }
 }

function loggedout (req,res,next){
  if(!isAdmin||!isAuth) return next()
  else{
      res.redirect('/')
  }
}

router.post('/make-order',async(req,res)=>{
  try {
  
    const  url = req.session.origin = req.protocol+"://"+req.get("host")+"/orders/success"
    console.log(url)
    const user = await customer.findById(req.session.user._id).populate('cart')
       console.log(user)
      let total = 0;
      req.session.comment = req.body.comment
      for (let i in user.cart)
      {
        total+= (user.cart[i].price * user.quantity[i])
      }
        
    console.log(req.body)

      const response = await got.post("https://api.flutterwave.com/v3/payments", {
        headers: {
            Authorization: `Bearer FLWSECK_TEST-fe5f630464efb1bc8a5ac766c7287922-X`
        },
        json: {
            tx_ref: user._id+ Date.now(),
            amount: total,
            currency: "NGN",
            redirect_url: url,
            customer: {
                email: user.email,
                phonenumber:user.phonenumber,
                name: user.fullname
            },
            customizations: {
                title: "Dee styling Payment",
                logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
            }
        }
    }).json();
   
         console.log(response)
    if (response.status == "success") res.redirect(response.data.link)

  } catch (err) {
    console.log();
    console.log();
  }
})


router.get('/success',async(req,res)=>{
    try {
        
        const user = await customer.findById(req.session.user._id)
     
        const transactionRef = req.query.tx_ref
        const transactionId = req.query.transaction_id
        const itemsArray = user.cart
        const quantityArray = user.quantity

        
        
        if (req.query.status === 'successful') {
              

            // //const transactionDetails = await Transaction.find({ref: req.query.tx_ref});
             const response = await flw.Transaction.verify({id: req.query.transaction_id});

            if ( response.data.status === "successful") {
                //successful payment
                const order = new orders({
                    customerName:user.fullname,
                    customerAddress:user.address, 
                    customerPhone:user.phonenumber,
                    comments:req.session.comments,
                    orderitems:itemsArray,
                    price : response.data.amount,
                    transactionRef,
                    transactionId,
                    date: Date( Date.now()),
                    quantity:quantityArray
                })

                await order.save()

                user.cart = [] //empty cart
                user.quantity = [] // empty quantity
                
                await user.save()

      
                res.render("success-page",{message:"transaction was successful", url:"/customers/dashboard-page"})
                
                
            } else {
                // Inform the customer their payment was unsuccessful
                res.render('failure-page', {message:"transaction was unsuccesful", url:"/customers/dashboard-page"})
            }
        }



    } catch (error) {
        
    }
})

router.get('/get-single/:id',isAuth,async(req,res)=>{

  try {
      const one = await orders.findById(req.params.id).populate('products')
      res.render('get-single-order-client',{one})
      
  } catch (err) {
      console.log(err)
  }
})



module.exports = router