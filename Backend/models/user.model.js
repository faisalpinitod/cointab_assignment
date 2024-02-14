const mongoose=require("mongoose")

const userScheema = mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    website:String,
    city:String,
    company:String
})

const User=mongoose.model("user",userScheema)

module.exports={
    User
}