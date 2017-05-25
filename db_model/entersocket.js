//사용하지 않은 파일

var pool = require('./dbconfig');
var async = require('async');


exports.entersocket  = function (data, callback) {
	pool.getConnection(function (err, conn) {
		if(err) 
		{
			var error = 'DB_connection_error';
			callback(error);
		}
		else
		{
			var sql = 'SELECT socket_name FROM roomUserData WHERE room_num = ?';	// 방 정보 DB에서 꺼내온다.
			conn.query(sql, data, function(err, list) {
				if(err)
				{
					var error = 'entersocket_error';
					conn.release();
					callback(error);
				}
				else
				{
					// Query OK
					conn.release();
					callback(list);
				}
			});
		}
	});
}