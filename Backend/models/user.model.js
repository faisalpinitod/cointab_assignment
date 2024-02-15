const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      street: String,
      suite: String,
      city: String,
      zipcode: String,
      geo: {
        lat: String,
        lng: String
      }
    },
    phone: String,
    website: String,
    company: {
      name: String,
      catchPhrase: String,
      bs: String
    }
  });

const User=mongoose.model("user",userSchema)

module.exports={
    User
}