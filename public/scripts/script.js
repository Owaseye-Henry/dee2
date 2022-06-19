const names = document.querySelectorAll(".name")
const prices = document.querySelectorAll(".price")
const quantities = document.querySelectorAll(".quantity")
const ids = document.querySelectorAll(".id")

const products = []
let totalPrice = 0;
for(let i = 0 ; i < names.length; i ++)
{
    products.push(ids[i].innerText)
   
    totalPrice+=(parseFloat(prices[i].innerText)*parseFloat(quantities[i].innerText))

    

}

console.log(totalPrice,products)