const mongoose=require("mongoose")

const postScheema = mongoose.Schema({
    name:String,
    title:String,
    body:String,
    company:String  
})

const Post=mongoose.model("post",postScheema)

module.exports={
    Post
}