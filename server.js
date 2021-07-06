'use strict';
 const express = require('express');
 const cors = require('cors');
 const mongoose = require('mongoose');
 const axios = require('axios');

 const server=express();
 require('dotenv').config(); 
 server.use(cors()) ;
 server.use(express.json()) ;

const PORT=process.env.PORT;

mongoose.connect(process.env.MONGO_URL , {useNewUrlParser: true, useUnifiedTopology: true});


const DrinkSchema = new mongoose.Schema({
    name: String,
    img:String
  });


  const DrinksModel = mongoose.model('drink', DrinkSchema);



server.get('/',(req,res)=>{
    res.send('home Route')
})

server.get('/getHomeData',getHomeDataHandler)
server.post('/addFavData',addFavDataHAndler)
server.get('/getAllFavData',getFavDataHandler)
server.delete('/deleteFromFav/:id',deleteFromFavHandler)
server.put('/UpdateData/:id',updateDataHandler)

function getHomeDataHandler (req,res){
    axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic').then((result)=>{
        res.send(result.data.drinks)
    })
}


function addFavDataHAndler (req,res){
    const{strDrink,strDrinkThumb}=req.body;
    const newData = new DrinksModel({ 
        name: strDrink,
        img:strDrinkThumb
     });

     newData.save();

}


function getFavDataHandler (req,res){
    DrinksModel.find({},(err,Data)=>{
        res.send(Data)
    })
}


function deleteFromFavHandler (req,res){
    const id = req.params.id;
    DrinksModel.deleteOne({},(err,newData)=>{
        DrinksModel.find({},(err,Data)=>{
            res.send(Data)
        })
    })
}


function updateDataHandler (req,res){
    const id = req.params.id;
    const {name,img}=req.body;
    DrinksModel.findOne({_id:id},(err,data)=>{
        data.name =name,
        data.img = img

        data.save().then(()=>{
            DrinksModel.find({},(err,Data)=>{
                res.send(Data)
            })
        })
    })
}





 server.listen(PORT,()=>{
     console.log(`listinig to PORT ${PORT}`)
 })
