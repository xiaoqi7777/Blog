const express=require('express');
const router=express.Router();

let Article = require('../dbModels/Article');
router.get('/index2', (req, res, next) => {
    res.render('index2');
});

router.get('/index',(req,res,next)=>{
    res.render('index');
});

/**
 * 跳转到登陆界面
 */
router.get('/login',(req,res,next)=>{
    res.render('login');
});

/**
 * 首页列表
 */
router.get(('/article/list'),(req,resp,next)=>{
    
    let page= Number(req.query.page)||1;
    let limit = 9; //每页固定显示的数据条数（9）
    let offset =(page-1)*limit;
  
    //          0      9      ==>第1页  page
    //          9      9      ==>第2页  
    //          18     9      ==>第3页
    //  offset/limit  +1  = page       
    //查询数据总共有多少条
    Article.count().then(count=>{
        responseMesg.data.total=count;
    });
    //skip  limit  跳过前面skip条数据，然后往后取limit条数据
    //sort({要排序的字段:+1||-1})  +1代表升序  -1代表降序
    Article.find().sort({
        '_id':-1,//用[]加进去就是变量 不然sort就是一个固定的值 属性值不用加[]
    }).skip(offset).limit(limit).then(articles => {
         articles.map((item,index)=>{
             let result=item.body.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/);
             if(result){
                    item.cover=result[1];
             }else{
                    // item.cover=;
             }
             
            //过滤HTML并且截取前面79个字
            console.log(item.body.replace(/<[^>]+>/g,""));
            item.body=item.body.replace(/<[^>]+>/g,"").substring(0,80)+'....';
            return  item; 
        })
        resp.json(articles);
    })
});

module.exports=router;