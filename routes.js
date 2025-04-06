const express=require("express");
const router=express.Router();
const User=require("./model/schema");
const bcrypt=require("bcrypt");

router.post("/signup", async(req,res)=>{
    try {
        const {name, phone, email, password}=req.body; 

        if (!name || name.length<3){
            return res.status(400).json({message: "Name should atleast be of 3 characters"})
        }
        const phoneRegex=/[0-9]{10}/
        if (!phoneRegex.test(phone)){
            return res.status(400).json({message: "Phone format invalid"})
        }
        const emailRegex=/[a-zA-Z0-9_\.\-]+[@][a-z]{1,}[\.][a-z]{1,}/
        if (!emailRegex.test(email)){
            return res.status(400).json({message: "Email format invalid"})
        }
        if (!password || password.length<4){
            return res.status(400).json({message: "Password must atleast be 4 characters"})
        }
        const existingUser= await User.findOne({$or: [{email}, {phone}]})
        if (existingUser){
            return res.status(400).json({message: "User already exists."})
        }
        const hashedPassword= await bcrypt.hash(password, 4)
        const newUser= new User({name, phone, email, password:hashedPassword})        
        await newUser.save();
        return res.status(200).json({message: "User registered successfully"})
    } catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"})
    }
})

router.post("/login", async(req,res)=>{
    try {
        const {email, password}=req.body; 

    const user=await User.findOne({email})
    if (!user){
        return res.status(400).json({message: "User with email not found"})
    }

    const isMatch= await bcrypt.compare(password, user.password)
    if (!isMatch){
        return res.status(400).json({message: "Incorrect password entered"})
    }
    const {password: _, ...userData}=user._doc;
    return res.status(200).json({message: "Login successfull", user: userData})
} catch(err){
    return res.status(500).json({message: "Internal server error"})
}
})

router.get("/", async(req, res)=>{
    try {
        const user= await User.find();
        return res.status(200).json(user)
    }
    catch(err){
        return res.status(500).json({message: "Internal server error"})
    }
})

router.get("/:id", async(req,res)=>{
    try{
        const user=await User.findById(req.params.id).select("-password");
        if (!user){
            return res.status(400).json({message: "User not found"})
        }
        return res.status(200).json(user)
    } catch(err){
        return res.status(500).json({message: "Internal server error"})
    }
})

router.put("/:id", async(req,res)=>{
    try {
        const {name, phone}=req.body;
        if (!name && !phone ){
            return res.status(400).json({message: "Atleast name or phone must be updates"})
        }
        const user= await User.findByIdAndUpdate(
            req.params.id, 
            {name, phone},
            {new: true}
        )
        if (!user){
            return res.status(400).json({message: "user nout found"})
        }
        await user.save();
        return res.status(200).json({message: "User updated"})
    }
    catch(err){
        return res.status(500).json({message: "Internal server error"})
    }
})

router.delete("/:id", async(req,res)=>{
try{
    const user=await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(400).json({message: "User not found"})
    }
    return res.status(200).json({message: "User deleted successfully"})
} catch(err){
    return res.status(400).json({message: "Internal server error"})
}
});

module.exports=router;