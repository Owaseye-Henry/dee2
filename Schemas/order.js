const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerName:{type:String,required:true},
    customerAddress:{type:String,required:true},
    customerPhone:{type:Number,required:true},
    comments:String,
    orderitems:[{type:Schema.Types.ObjectId, ref:"item"}],
    price:{type:Number,required:true},
    transactionRef:String,
    transactionId:String,
    date:String,
    quantity:[{type:Number,required:false}]
    ,delivered:Boolean
})

module.exports = mongoose.model('order', orderSchema)