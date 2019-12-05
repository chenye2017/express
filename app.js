var express = require('express');
var app = express();
var {crawlGet} = require('./service/crawl');
var {handleWxPublic} = require('./service/handleWxpublic')
var {md5Crypto} = require('./service/common')

app.use(function (req,res, next) {
    let NODE_ENV = process.env.NODE_ENV
    if (typeof  NODE_ENV === 'undefined') {
        throw new Error('please set NODE_ENV')
    }
    if (NODE_ENV == 'prod') {
        let arr = []
        for (var prop in req.query) {
            if (prop != 'sign')
                arr.push(prop)
        }
        arr.sort()
        if (arr.length > 0) {
            let str = '';
            arr.forEach((key) => {
                str += req.query[key] + '.'
            })
            let sign = md5Crypto(str + 'shihuoapp')
            if (req.query.sign !== sign) {
                throw  new Error('非法请求')
            }
        }
        next()
    } else if (NODE_ENV == 'dev') {
        next()
    }
})

app.get('/', function (req, res) {
    res.send('Hello World2');
})


app.get('/wxpublic', function (req, res, next) {
    var url = req.query.url
    if (!url) {
        const error = new Error('missing param url')
        error.httpStatusCode = 401;
        return next(error)
    }
    crawlGet(url).then((data) => {
        let content = handleWxPublic(data)
        if (content) {
            res.json({code: 1, message: 'ok', data: content})
        } else {
            res.json({code: -1, message: '没有匹配内容', data: ''})
        }
    }, (error) => {
        return next(error)
    }).catch((error) => {
        return next(error)
    })
})


app.use(function (err, req, res, next) {
    let back = {
        code: -1,
        message: err.message
    }
    if (!err.httpStatusCode) {
        err.httpStatusCode = 500;
    }
    res.status(err.httpStatusCode).json(back);
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})



