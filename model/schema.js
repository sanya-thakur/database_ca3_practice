const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    name:{
        type: String, 
        required: true,
        minlength:3
    },
    phone:{
        type: Number, 
        required: true, 
        unique: true, 
        match: /[0-9]{10}/
    },
    email:{
        type: String, 
        required: true, 
        unique: true,
        match: /[a-zA-Z0-9_\.\-]+[@][a-z]{1,}[\.][a-z]{1,}/
    },
    password:{
        type: String, 
        required: true, 
        min: 4
    }
});

module.exports= mongoose.model("User", userSchema);