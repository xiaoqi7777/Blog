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
    Article.find().skip(offset).limit(limit).then(articles => {
        responseMesg.success = true;
        responseMesg.data.rows = articles
        res.json(responseMesg);
    })
});


let i = 0;
/**
 * 保存文章
 */
router.get('/article/save', (req, res, next) => {
    new Article({
        title: '文章' + (i++),
        body: '内容' + i
    }).save().then(article => {
        res.json(article);
    });
});

module.exports = router;