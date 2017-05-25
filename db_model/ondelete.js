var async = require('async');
var pool = require('./dbconfig');

exports.ondelete = function(datas, callback){
	pool.getConnection(function(err, conn){
		if(err){
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else{
			var sql = 'DELETE FROM roomData WHERE room_num = ? AND user_id = ? AND idx = ?'
			conn.query(sql, datas, function(err, rows){
				if(err)
				{
					var error = 'ondelete_error';
					conn.release();
					callback(err, error);
				}
				else
				{
					conn.release();
					callback(rows);
				}
			});
		}
	});
}