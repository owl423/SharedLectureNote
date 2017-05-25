var pool = require('./dbconfig');
var async = require('async');

//방 마스터 확인
var checkRoom = function (datas, callback){
	pool.getConnection(function(err, conn){
		if(err){
			var error = 'DB_connection_error'
			callback(err, error);
		} else{
			var sql = 'SELECT COUNT(*) as cnt FROM room WHERE room_num =?';
			//console.log(datas);
			conn.query(sql, datas[3], function(err, row){
				//console.log(row);
				var cnt = row[0].cnt;
				if(err){
					var error = 'checkData_error';
					conn.release();
					callback(err, error);
				}else{
					if(cnt == 1){
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
			var sql = 'UPDATE room SET file_name=?, file_data=?, page_num=? WHERE room_num=?';
			//console.log(datas);
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

exports.pdfUpload = function (datas, callback){
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