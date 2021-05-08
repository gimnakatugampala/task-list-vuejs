module.export = {
    devServer:{
        proxy:{
            '^/api':{
                target:'http://localhost:3000',
                changeOrigin:true,
                loglevel:'debug',
                pathRewrite:{'^api':'/'},
            },
        }
    }
}