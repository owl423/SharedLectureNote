var pool = require('./dbconfig');
var async = require('async');

var pagechange = function(datas, callback){
	pool.getConnection(function(err, conn){
		if(err){
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else
		{
			//console.log('디비 데이터 : ', datas);
			var sql = 'UPDATE room SET page_num = ? WHERE room_num = ?';
			conn.query(sql, datas, function(err, rows){
				if(err)
				{
					var error = 'inputroomdata_error';
					conn.release();
					callback(err, error);
				}
				else
				{
					//console.log('1');
					conn.release();
					callback(null, datas);
				}
			});
		}
	});
}

var dbdelete = function(datas, callback){
	pool.getConnection(function(err, conn){
		if(err){
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else
		{	
			var sql = 'DELETE FROM roomData WHERE room_num = ?';
			//console.log(datas);
			conn.query(sql, datas[1], function(err, rows){
				if(err)
				{
					var error = 'roomdata_delete_error';
					conn.release();
					callback(err, error);
				}
				else
				{
					//console.log('2');
					conn.release();
					callback(null, rows);
				}
			});
		}
	});
}

exports.pageChange = function(datas, callback){
	async.waterfall([
		function (callback){
			pagechange(datas, callback);
		},function (datas, callback) {
			dbdelete(datas, callback);
		}
	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}