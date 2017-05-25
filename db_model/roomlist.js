var pool = require('./dbconfig');

exports.roomlist  = function (callback) {
	pool.getConnection(function (err, conn) {
		if(err) 
		{
			var error = 'DB_connection_error';
			callback(error);
		}
		else
		{
			var sql = 'SELECT master_id, room_num FROM room';	// 방 정보 DB에서 꺼내온다.
			conn.query(sql, function(err, list) {
				if(err)
				{
					var error = 'getRoomList_error';
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
