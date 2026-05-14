import express from "express"
import response = require("express");
import nodeHttp = require("node:http");
const app = express();
app.use(express.json());
app.get('/',(nodeHttp.request,response)=>{
    response.send("server is running")
})


// i want to build server