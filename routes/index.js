/*
 * GET home page.
 */

// res.render 调用模板引擎，并将其产生的页面直接返回给客户端
exports.index = function(req, res){
	res.render('index', {title: 'Fan'});
}

exports.hello = function(req, res){
	res.send('1');
}

exports.user = function(req, res){

}

exports.post = function(req, res){

}

exports.reg = function(req, res){

}

exports.doReg = function(req, res){

}

exports.login = function(req, res){

}

exports.doLogin = function(req, res){

}

exports.logout = function(req, res){

}