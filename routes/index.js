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
}
