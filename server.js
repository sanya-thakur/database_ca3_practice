const express=require("express");
const app=express();
app.use(express.json());
const mongoose=require("mongoose");
require("dotenv").config();
const PORT=3010;
const routes=require("./routes")

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Connected to database."))
.catch((err)=>console.log("Error: ", err))

app.use("/users", routes)

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
});