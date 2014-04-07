var mongodb = require('./db');

// 构造函数
function User(user){
	this.name = user.name;
	this.password = user.password;
}

// 通过 module 输出噶构造函数
module.exports = User;

// 保存用户
User.prototype.save = function save(callback){
	// 存入 mongodb 的 ducument
	var user = {
		name: this.name,
		password: this.password
	}

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}

		// 读取 user 集合
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			// 为 name 属性添加索引
			collection.ensureIndex('name', {unique: true});

			// 写入 user 文档
			collection.insert(user, {safe: true}, function(err, user){
				mongodb.close();
				callback(err, user);
			});
		});
	});
}

// 检查用户是否存在
User.get = function get(username, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}

		// 读取 users 集合
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			// 查找 name 属性为 username 的文档
			collection.findOne({name: username}, function(err, doc){
				mongodb.close();
				if(doc){
					// 封装文档为 user 对象
					var user = new User(doc);
					return callback(err, user);
				} else {
					return callback(err, null);
				}
			});
		});
	});
}