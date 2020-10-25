const express =require('express');
const router=express.Router();
const midd=require('./middlewares/auth');
const Auth=require('./controllers/AuthController');
const UserController=require('./controllers/userController');
const AdsController=require('./controllers/AdsController');
const Authvalidator=require('./validators/AuthValidator');
const UserValidator = require('./validators/UserValidator');
router.get('/ping',(req,res)=>{
    res.json({pong:true})
});
router.get('/states',UserController.getStates);
router.post('/user/signin',Authvalidator.signin, Auth.signin);
router.post('/user/signup', Authvalidator.signup, Auth.signup);
router.get('/user/me',midd.private,UserController.info);
router.put('/user/me',UserValidator.editAction,midd.private,UserController.editAction);
router.get('/categories',AdsController.getCategories);
router.post('/ad/add', midd.private,AdsController.addAction);
router.get('/ad/item',AdsController.getList);
//Usa post pq vou lidar com Imagens
router.post('/ad/:id',midd.private,AdsController.editAction);



module.exports=router;