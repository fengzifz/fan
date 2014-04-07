/*
 * GET home page.
 */

// res.render 调用模板引擎，并将其产生的页面直接返回给客户端
module.exports = function(app){
	// Homepage
	app.get('/', function(req, res){
		res.render('index', {
			title: '首页'
		});
	});

	// 注册和登录页面
	app.get('/reg', function(req, res){
		res.render('reg', {
			title: '注册和登录'
		});
	});

	// 注册表单
	app.post('/reg', function(req, res){
		// 检查两次的密码是否正确
		if(req.body['password-repeat'] != req.body['password']){
			req.flash('error', '两次输入的密码不一致');
			return res.redirect('/reg');
		}
	});
}
