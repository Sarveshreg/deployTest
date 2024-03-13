require('dotenv').config({ path: '../.env' })
let express =require("express");
let app=express();
let cors=require("cors");
let bodyParser= require("body-parser");

//middleware
app.use(cors());
app.use(bodyParser.json());

let morgan = require('morgan');
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
    next();
});

//router
let apiRouter=require('./api');
app.use('/api', apiRouter);

app.get("/", (req,res)=>{
    res.json({message:"hello"})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});