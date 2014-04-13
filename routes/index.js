var crypto = require('crypto');
var User = require('../models/user.js');

// res.render 调用模板引擎，并将其产生的页面直接返回给客户端
module.exports = function(app){
	// Homepage
	app.get('/', function(req, res){
		res.render('index', {
			title: '首页'
		});
	});

	// 退出
	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res){
		req.session.user = null;
		req.flash('success', 'Logout Successfully.');
		return res.redirect('/reg');
	});

	// 注册页面
	app.get('/reg', checkNotLogin);
	app.get('/reg', function(req, res){
		res.render('reg', {
			title: '注册'
		});
	});

	// 登录页面
	app.get('/login', checkNotLogin); 
	app.get('/login', function(req, res){
		res.render('login', {
			title: '登录'
		});
	});

	// 登录表单
	app.post('/logon', checkNotLogin);
	app.post('/login', function(req, res){
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		User.get(req.body.username, function(err, user){
			if(!user){
				req.flash('error', '用户不存在');
				return res.redirect('/login');
			}

			if(user.password != password){
				req.flash('error', '用户密码错误');
				return res.redirect('/login');
			}

			req.session.user = user;
			req.flash('success', '登录成功');
			res.redirect('/');
		});
	});

	// 注册表单
	app.post('/reg', function(req, res){
		// 检查两次的密码是否正确
		if(req.body['password-repeat'] != req.body['password']){
			req.flash('error', '两次输入的密码不一致');
			return res.redirect('/reg');
		}

		// MD5 加密
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		var newUser = new User({
			name: req.body.username,
			password: password
		});

		// 检查用户名是否存在
		User.get(newUser.name, function(err, user){
			if(user){
				err = 'Username already exist.';
			}

			if(err){
				req.flash('error', err);
				return res.redirect('/reg');
			}


			// 如果不存在则新增用户
			newUser.save(function(err){
				if(err){
					req.flash('error', err);
					return redirect('/reg');
				}

				req.session.user = newUser;
				req.flash('success', '注册成功');
				res.redirect('/');
			});
		});


	});

	function checkLogin(req, res, next){
		if(!req.session.user){
			req.flash('error', '未登录');
			return res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req, res, next){
		if(req.session.user){
			req.flash('error', '已经登录');
			return res.redirect('/');
		}
		next();
	}
}
