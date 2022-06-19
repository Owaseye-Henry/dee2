const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new Schema({ 
    itemName:{type:String,required:true},
    image:String,
    description:String,
    price:{type:Number,required:true},
    AvailableQuantity:Number,
    date:String
})

module.exports = mongoose.model('item', itemSchema)


    