var serveur = require('./server.js')
//http://localhost:8000/?count=20
const router = /[a-z]{2,}\.(html|css|js)/
const Koa = require('koa');
const fs = require('fs')

const trr = new Koa()

trr.use(async (ctx, next)=>{
    if(ctx.url === '/favicon.ico')return
    if(ctx.url === '/'){
        ctx.type = 'html'
        ctx.redirect('/index.html')
    }else{
        ctx.type = router.exec(ctx.url)[1]
        ctx.body = fs.createReadStream('.'+ ctx.url, {autoclose:true})
    }
})

trr.listen(8001)
