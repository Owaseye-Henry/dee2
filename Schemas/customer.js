const mongoose = require('mongoose')

const Schema = mongoose.Schema

const customerSchema = new Schema({
    firstname:{type:String,required:true},
    surname:{type:String,required:true},
    fullname:{type:String,required:true},
    address:{type:String,required:true},
    phonenumber:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    cart:[{type:Schema.Types.ObjectId, ref:"item"}],
    orders:[{type:Schema.Types.ObjectId, ref:"order"}],
    quantity:[{type:Number,required:false}]
})

module.exports = mongoose.model('customer', customerSchema)