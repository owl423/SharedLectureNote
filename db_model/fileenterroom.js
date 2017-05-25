var pool = require('./dbconfig');
var async = require('async');

exports.fileenterroom = function(datas, callback){		//그려진 데이터 추가
	pool.getConnection(function(err, conn){
		if(err){
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else
		{
			
			var sql = 'SELECT file_name, file_data, page_num FROM room WHERE room_num = ?';
			conn.query(sql, datas, function(err, rows){
				if(err)
				{
					var error = 'fileenterroom_error';
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