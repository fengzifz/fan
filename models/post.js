var mongodb = require('./db.js');

function Post(username, post, time){
	this.user = username;
	this.post = post;

	if(time){
		this.time = time;
	} else {
		this.time = new Date();
	}
}

module.exports = Post;

Post.prototype.save = function save(callback){

	// 存入 mongo 的文档
	var post = {
		user: this.user,
		post: this.post,
		time: this.time
	};

	mongodb.open(function(err, db){

		// 如果出错，扔给回调函数处理
		if(err){
			return callback(err);
		}

		// 读取 posts 的集合
		db.collection('posts', function(err, collection){
			// 如果出错，关闭数据库，扔给回调函数
			if(err){
				mongodb.close();
				return callback(err);
			}

			// 为 user 属性添加索引
			collection.ensureIndex('user');

			// 写入 posts 文档 
			collection.insert(post, {safe: true}, function(err, post){
				mongodb.close();
				callback(err, post);
			});
		});
	});
}

Post.get = function get(username, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('posts', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			var query = {};
			if(username){
				query.user = username;
			}

			collection.find(query).sort({time: -1}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					callback(err, null);
				}

				var posts = [];

				docs.forEach(function(doc, index){
					var post = 	new Post(doc.user, doc.post, doc.time);
					posts.push(post);
				});

				callback(null, posts);
			});
		});
	});
}