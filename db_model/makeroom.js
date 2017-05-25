var pool = require('./dbconfig');
var async = require('async');


var checkid = function(datas, callback){
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB connection error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT COUNT(*) AS cnt FROM member WHERE id=?';
			conn.query(sql, datas[0], function (err, row) {
				// 결과 row가 배열 이므로 0번째에 있는 cnt 값이 count 된 값
				var cnt = row[0].cnt;
				if(err) {
					// DB query error
					var error = 'checkData_error';
					conn.release();
					callback(err, error);
				} else {
					if(cnt == 1) {
						// DB에 해당 id값이 이미 존재 하는 경우
						conn.release();
						callback(null, datas);
						
					} else {
						// DB에 해당 id값이 존재 하지 않는 경우
						var error = 'master_id not defined';
						conn.release();
						callback(error, error);
					}
				}
			});
		}
	});
}

var checkmaster_id = function(datas, callback){
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB connection error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT COUNT(*) AS cnt FROM room WHERE master_id=?';
			conn.query(sql, datas[0], function (err, row) {
				// 결과 row가 배열 이므로 0번째에 있는 cnt 값이 count 된 값
				var cnt = row[0].cnt;
				if(err) {
					// DB query error
					var error = 'checkData_error';
					conn.release();
					callback(err, error);
				} else {
					if(cnt == 1) {
						// DB에 해당 id값이 이미 존재 하는 경우
						var error = 'master_id is duplicated';
						conn.release();
						callback(error, error);
						
					} else {
						// DB에 해당 id값이 존재 하지 않는 경우			
						conn.release();
						callback(null, datas);
					}
				}
			});
		}
	});
}


var makeroom = function (datas, callback) {
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'INSERT INTO room (master_id, room_num) VALUES(?, ?)';
			conn.query(sql, datas, function (err, result) {
				if(err) {
					var error = 'makeroom_error';
					conn.release();
					callback(err, error, error);
				} else {
					var row = [datas[0], datas[1], result.insertId];
					conn.release();
					callback(null, row);
				}
			});
		}
	});
}

var makeroom_UserData = function(datas, callback){
	pool.getConnection(function (err, conn) {
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'INSERT INTO roomUserData (user_id, room_num, socket_name) VALUES(?,?,?)';
			conn.query(sql, datas, function (err, result) {
				if(err) {
					var error = 'makeroom_error';
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

exports.makeroom = function (datas, callback) {
	async.waterfall([
		function (callback) {
			checkid(datas, callback);
		}, function (datas, callback) {
			checkmaster_id(datas, callback);
		}, function (datas, callback){
			makeroom(datas, callback);
		}, function (datas, callback){
			makeroom_UserData(datas, callback);
		}

	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}