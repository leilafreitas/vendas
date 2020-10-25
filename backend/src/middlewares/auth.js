const User=require('../models/User')
module.exports={
    private: async(req,res,next)=>{
        if(!req.query.token && !req.body.token){
            res.json({notallowad:true});
            return;
        }
        let token = "";
        (req.query.token)? token=req.query.token:token=req.body.token;
        if(token==""){
            res.json({notallowad:true});
            return;
        }
        const user= await User.findOne({token});
        if(!user){

            res.json({notallowad:true});
            return;
        }
        next();
    }
}