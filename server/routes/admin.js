const express = require('express');
const router = express.Router();

let Article = require('../dbModels/Article');

//后端响应给前端的数据格式
let responseMesg;
router.use((req, resp, next) => {
    //初始化一下数据格式
    responseMesg = {
        success: false,
        message: '',
        data: {
            total: 0,
            rows: []
        }
    };
    next();
});

/**
 * 跳转到登陆后的首页
 */
router.get('/index', (req, res, next) => {
    res.render('admin/article-list', {
        user: req.session.user
    });
});

/**
 * 查询列表（一次性查出所有数据）
 */
router.get('/article/list', (req, res, next) => {
    Article.find().then(articles => {
        res.json(articles);
    });
});


/**
 * 查询文章列表（服务端分页）
 */
router.get('/article/pagination', (req, res, next) => {
    //获取下前端传给后端的分页数据
    let offset = Number(req.query.offset);
    let limit = Number(req.query.limit); //每页固定显示的数据条数（10）
    let sort = req.query.sort|| '_id' ;//按照那个排序
    let order = (req.query.order==='asc' ? 1 : -1);//排序方式 acs升序   desc降序
    console.log(sort, order )
    console.log(offset,limit);      
    //          0      10      ==>第1页  page
    //          10     10      ==>第2页  
    //          20     10      ==>第3页
    //  offset/limit  +1  = page       
    //查询数据总共有多少条
    Article.count().then(count=>{
        responseMesg.data.total=count;
    });
    //skip  limit  跳过前面skip条数据，然后往后取limit条数据
    //sort({要排序的字段:+1||-1})  +1代表升序  -1代表降序
    Article.find().sort({
        [sort]:order,//用[]加进去就是变量 不然sort就是一个固定的值 属性值不用加[]
    }).skip(offset).limit(limit).then(articles => {
        articles.map((item,index)=>{
            console.log(item.body.replace(/<[^>]+>/g,""));
            item.body=item.body.replace(/<[^>]+>/g,"").substring(0,50);
            return   
        })
        responseMesg.success = true;
        responseMesg.data.rows = articles
        res.json(responseMesg);
    })
});




/**
 * 查询某一篇文章 并且跳转到编辑页面
 */
router.get('/article/', (req, res, next) => {
    //首先获取到id
    //根据id查询到数据
    //吧数据传给模板
    //模板渲染数据
    
    //params和query区别   //http://blog.csdn.net/tan01234/article/details/72676884   
    //req.params包含路由参数（在URL的路径部分），而req.query包含URL的查询参数（在URL的？后的参数）。

    // let id=req.params.id;
    
     let id=req.query.id;
    Article.findById(id).then(article=>{
         res.render('admin/article-edit',{
             a:article
         })
    })
});    

/**
 * 删除某一篇文章
 */
router.delete('/article/:id', (req, res, next) => {
    //首先获取到id
    let id=req.params.id;
    Article.findByIdAndRemove(id).then(article=>{
        responseMesg.message='删除成功';
        responseMesg.success=true;
        res.json(responseMesg);
    })
});    
   



///admin/article/add
let i = 0;
/**
 * 保存文章
 */
router.post('/article/save', (req, res, next) => {
    //获取文章
    let parms=req.body;
    console.log(parms);
    if(!parms.body || !parms.title){
        responseMesg.message='标题或者内容不能为空';
        console.log('11111111');
        res.json(responseMesg);
        return;
    }
    new Article({
        title: parms.title,
        body: parms.body
    }).save().then(article => {
        responseMesg.success=true;
        responseMesg.message='保存成功';
        res.json(responseMesg);
    });
});

/**
 * 修改文章
 */
router.post('/article/edit', (req, res, next) => {
   let parms=req.body;
   Article.findByIdAndUpdate(parms.id,{
       title:parms.title,
       body:parms.body
   }).then(article=>{
       if(article){
            responseMesg.success=true;
            responseMesg.message='修改成功'
       }else{
            responseMesg.message='修改失败'
       }
       res.json(responseMesg);
   })
    
});

///admin/article/add

/**
 * 跳转到文章的添加页面
 */
router.get('/article/add', (req, res, next) => {
    res.render('admin/article-add');
    
});

module.exports = router;
