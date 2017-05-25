var pool = require('./dbconfig');
var async = require('async');


exports.search = function(datas, callback){
	pool.getConnection(function (err, conn) {
		if(err) {
			// DB connection error
			var error = 'DB_connection_error';
			callback(err, error);
		} else {
			var sql = 'SELECT COUNT(*) AS cnt, master_id, room_num FROM room WHERE master_id=?';
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
						// DB에 해당 id값이 존재 하는 경우
						conn.release();
						//console.log(row);
						callback(row);
						
					} else {
						// DB에 해당 id값이 존재 하지 않는 경우
						var error = 'master_id not exist';
						conn.release();
						callback(error, error);
					}
				}
			});
		}
	});
}