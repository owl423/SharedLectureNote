// login.js

// DB 연결 파일 require
var pool = require('./dbconfig');
var async = require('async');

// user 확인
var checkUser = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT COUNT(*) AS cnt, pw FROM member WHERE id=?';
			conn.query(sql, datas[0], function (err, rows) {
				if(err) {
					var error = 'checkUser_error';
					conn.release();
					callback(err, error);
				} else {
					if(rows[0].cnt == 1 ) {
						// 비밀번호 확인
						if(datas[1] == rows[0].pw) {
							conn.release();
							callback(null, datas);		
						}else {
							var error = 'pw_unmatch';
							conn.release();
							callback(error, error);
						}
					} else if(rows[0].cnt == 0) {
						// 없는 유저의 경우
						var error = 'No_value';
						conn.release();
						callback(error, error);
					} else {
						var error = "unknown_login_error";
						conn.release();
						callback(error, error);
					}
				}
			});
		}
	});
}

// login
var loginUser = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT id FROM member WHERE id=?';
			conn.query(sql, datas[0], function (err, result) {
				if(err) {
					var error = 'loginUser_error';
					conn.release();
					callback(err, error);
				} else {
					conn.release();
					callback(null, result);
				}
			});
		}
	});
}

// 로그인
exports.login = function (datas, callback) {
	async.waterfall([
		function (callback) {
			checkUser(datas, callback);
		}, function (datas, callback) {
			loginUser(datas, callback);
		}
	],function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
};