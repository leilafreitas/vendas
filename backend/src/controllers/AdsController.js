const Category=require('../models/Category');
module.exports={
    getCategories:async(req,res)=>{
        const categ = await Category.find();
        let categories=[];
        categ.forEach( category =>{
                categories.push({
                    //_DOC é pra pegar só os dados do bd limpo
                    ...category._doc,
                    img: `${process.env.BASE}/assets/images/${category.slug}.png`
                })
            }
        );
        res.json({categories});

    },
    addAction:async(req,res)=>{
        

    },
    getList:async(req,res)=>{

    },
    editAction:async(req,res)=>{

    }
}