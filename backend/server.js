require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const fileupload=require('express-fileupload');
const apiroutes=require('./src/routes');
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology:true
});
mongoose.Promise=global.Promise;
mongoose.connection.on('error',(error)=>{
    console.log(error);
});
const server=express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use(fileupload());
server.use(express.static(__dirname+'/public'));
server.use('/',apiroutes);


server.listen(process.env.PORT,()=>{
    console.log('SERVIDOR RODANDO NA 5000')
})