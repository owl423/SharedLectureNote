var pool = require('./dbconfig');
var async = require('async');

//방 마스터 확인
var checkRoom = function (datas, callback){
	pool.getConnection(function(err, conn){
		if(err){
			var error = 'DB_connection_error'
			callback(err, error);
		} else{
			var sql = 'SELECT room_num FROM room WHERE room_num =?';
			conn.query(sql, datas[2], function(err, row){
				var roomnum = row[0].room_num;
				if(err){
					var error = 'checkData_error';
					conn.release();
					callback(err, error);
				}else{
					if(roomnum == datas[2]){
						conn.release();
						callback(null, datas);
					}
					else{
						var error = 'room_not_exist';
						conn.release();
						callback(error, error);
					}
				}

			});
		}
	});
}

var addFile = function(datas, callback){
	pool.getConnection(function(err, conn){
		if(err){
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else{
			var sql = 'UPDATE room SET file_name=?, file_data=? WHERE master_id=?';
			conn.query(sql, datas, function(err, row){
				if(err){
					var error = 'addFile_error';
					conn.release();
					callback(err, error);
				}
				else{
					conn.release();
					callback(null, datas);
				}
			});
		}
	});
}

exports.pdf = function (datas, callback){
	async.waterfall([
		function (callback){
			checkRoom(datas, callback);
		}, function (datas, callback){
			addFile(datas, callback);
		}
	], function(err,result){
		if(err) console.log('err : ', err);
		callback(result);
	});
}