const express = require("express");
const cors =  require("cors");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken")
// const bodyparser = require('body-parser');
const { SECRET, authentication } = require("./middleware/auth");
const Buffer = require('buffer');


const app = express()

// middlewares initilizing 
app.use(cors());
app.use(express.json());

 // should provide the schema
 const todoschema = new mongoose.Schema({
    title: String,
    discription: String,
    duedate : Number
 });

 const userschema = new mongoose.Schema({
    username : String,
    password: String,
    number: Number
 });

 const todo = mongoose.model('todos' , todoschema);
 const user = mongoose.model('user' , userschema);

//connecting moongoose database
mongoose.connect('mongodb+srv://vidyashree2231:<password>@cluster0.aaqvzb1.mongodb.net/' ,{useNewUrlParser:true , useUnifiedTopology: true , dbName:"todo-app"})

app.post('/signup', authentication , async (req, res)=>{
    const {username , password} = req.body;
    const {number} = req.body;

    const existinguser = await user.findOne({username}) // to see if a existing user is trying to sign up
    if(existinguser){
        res.status(404).json({message: "User already exists"});
    }else{
        const newuser = new user({username, password, number}); // if new user, create a body(object) for it having its credencials 
        await newuser.save();
        const token = jwt.sign({username , role: 'user'}, SECRET , {expiresIn: '1h'});
        res.status(202).json({message: "User signup successfull"} , token);
    }
});

app.post("/login" ,authentication, async(req , res) =>{
    const {username , password , number} = req.body;
    const user = await user.findOne({username , password});
    if(!user){
        res.status(404).json({message: "User does not exist"});
    }else{
        const token = jwt.sign({username , role:"user"} , SECRET , {expiresIn: "1h"});
        res.status(202).json({message: "User logged in successfully" , token}) // should be res.status not res.sendstatus
    }
});

app.post('/todos' , authentication, async(req, res) =>{
    const {title , discription , duedate} = req.body;
    const newtodo = new todo({title, discription , duedate }); // you need to create new objects for it.
    try{
    await newtodo.save(); // you need to save it also in the backend , when u dont use the object , the word doesnt get highlighted , then understand that u need to use it .
    res.status(202).json(newtodo);
} catch (err){
    res.status(402).json({message: "failed to create a new todo"});
}});

app.get('/todos/:todoId' , async(req, res) =>{
    // const todoId = req.params.todoId;
    // const todo = todo.find(t =>{ t.t.id == todoId});
    // if(todo){
    //     res.json(todo);
    // }
    const todos = await todo.find();
    if(todos){
        res.status(202).json(todos);
    }else{
        if(err){
            res.status(404).json("data not found");
        }
    }


});

app.put('/todos/:id' , async(req, res) =>{
    const todoId = req.params.id;
    const {title, discription , duedate} = req.body;  // fetching the updated data from the body 

    const updatedtodo = await todo.findByIdAndUpdate(
        todoId,
        {title, discription, duedate},
        {new: true} // this option returns the updated data.
       
    )
    if(updatedtodo){
        res.status(200).json(updatedtodo);
    }else{
        res.status(404).json({message: "could not update the data"});
    }
});

app.delete('/todos/:Id' , async(req, res) =>{
    const todoId = req.params.Id;

    const deleteTodo = await todo.findByIdAndRemove(todoId);

    if(deleteTodo){
        res.status(200).json({message: " todo is deleted"});
    }else{
        res.status(404).json({message: " dould not delete"})
    }
});






app.listen(3000 , ()=>{
    console.log("Server running on port 3000")
});

module.exports = {
    todo,
    user
    
}
