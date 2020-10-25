const {validationResult,matchedData} =require('express-validator');
const User= require('../models/User');
const State=require('../models/State');
const mongoose= require('mongoose');
const bcrypt=require('bcrypt');
module.exports={
    signin : async(req,res)=>{
        const error= validationResult(req);
        if(!error.isEmpty()){
            res.json({error:error.mapped()});
            return;
        };
        //Obtem os dados
        const data = matchedData(req);
        //Verifica o email
        const user= await User.findOne({email:data.email});
        if(!user){
            res.json({error:'E-mail e/ou senha não conferem!'})
            return;
        }
        //validando senha
        const match= await bcrypt.compare(data.password,user.passwordHash);
        if(!match){
            res.json({error:'E-mail e/ou senha não conferem!'})
            return;
        }
        //atualiza o token 
        const payload = (Date.now()+ Math.random()).toString()
        const token = await bcrypt.hash(payload,10);
        user.token=token;
        await user.save();
        res.json({token, email:data.email});

    },
    signup : async(req,res)=>{
        const error=validationResult(req);
        //Se error não for vazio, mapeia e retorna
        if(!error.isEmpty()){
            res.json({error:error.mapped()});
            return;
        }
        const data = matchedData(req);
        const user= await User.findOne({email:data.email});
        if(user){
            res.json({
                error:{email:{msg:'E-mail já cadastrado'}}
            });
            return;
        }

        if(mongoose.Types.ObjectId.isValid(data.state)){
            const state= await State.findById(data.state);
            if(!state){
                res.json({
                    error:{state:{msg:'Estado Inválido'}}
                });
                return;
            }
        }else{
            res.json({
                error:{state:{msg:'Estado de código Inválido'}}
            });
        }
        //criptografar senha
        const passwordHash=await bcrypt.hash(data.password,10);
        //token
        const payload = (Date.now()+ Math.random()).toString()
        const token = await bcrypt.hash(payload,10);
        const newUser= new User({
            name: data.name,
            email:data.email,
            passwordHash,
            token,
            state:data.state
        });
        await newUser.save();
        res.json({token:token});
    }
}
