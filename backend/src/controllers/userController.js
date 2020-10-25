const State= require('../models/State');
const User = require('../models/User');
const Ad = require('../models/Ad');
const Category = require('../models/Category');
const {validationResult,matchedData}=require('express-validator');
const mongoose= require('mongoose');
const bcrypt= require('bcrypt');
module.exports={
    getStates :async(req,res)=>{
        let states= await State.find();
        res.json({states})

    },
    info:async(req,res)=>{
        //Pegar as informações do usuario bem como seus anuncios 
        const token= req.query.token;
        const user = await User.findOne({token});
        const state = await State.findById(user.state);
        const ads= await Ad.find({idUser:user._id.toString()})
        let adList=[];
        for (i of ads){
            const categ= await Category.findById(i.category);
            adList.push({
                id:i._id,
                status:i.status,
                images:i.images,
                date_created:i.date_created,
                title:i.title,
                price:i.price,
                price_negotiable:i.price_negotiable,
                description:i.description,
                views:i.views,
                category:categ.slug,

            })
        }
        res.json({
            name:user.name,
            email:user.email,
            state:state.name,
            ads:adList
        });
    },
    editAction:async(req,res)=>{
        const error= validationResult(req);
        if(!error.isEmpty()){
            res.json({error:error.mapped()});
            return;
        };
        const data= matchedData(req);
        let updates={};
        if(data.name){
            updates.name=data.name;
        }
        if(data.email){
            const emailCheck= await User.findOne({email:data.email});
            if(emailCheck){
                res.json({error: 'E-mail já existente'});
                return;
            }
            updates.email = data.email;
        }
    
        if(data.state){
            if(mongoose.Types.ObjectId.isValid(data.state)){
                const stateCheck=await State.findById(data.state);
                if(!stateCheck){
                    res.json({error: 'Estado não existe'});
                    return;
                }
                updates.state=data.state;
            }else{
                res.json({error:'Código de estado Inválido'});
            }
        }

        if(data.password){
            updates.passwordHash= await bcrypt.hash(data.password,10);
        }
        await User.findOneAndUpdate({token:data.token},{$set:updates});
        res.json({});
    }
}