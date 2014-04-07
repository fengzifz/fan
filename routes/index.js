var crypto = require('crypto');

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

		// MD5 加密
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digset('base64');

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
				req.flash('success', '注册成个');
				res.redirect('/');
			});
		});


	});
}
