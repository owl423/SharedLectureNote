var pool = require('./dbconfig');
var async = require('async');

var usercheck = function(datas, callback){		//입장해 있는 유저인지 체크
	pool.getConnection(function(err, conn){
		if(err) 
		{
			var error = 'DB_connection_error';
			callback(error);
		}
		else
		{
			var sql = 'SELECT COUNT(*) AS cnt FROM roomUserData WHERE user_id = ?';	// 방 정보 DB에서 꺼내온다.
			conn.query(sql, datas, function(err, result) {
				if(err)
				{
					var error = 'exitroom_error';
					conn.release();
					callback(err, error);
				}
				else // Query OK
				{
					conn.release();
					callback(null, datas);
				}
			
			});
		}
	});
}

var userexit = function (datas, callback){			//유저 방 나감
	pool.getConnection(function(err, conn){
		if(err) 
		{
			var error = 'DB_connection_error';
			callback(err, error, error);
		}
		else
		{		
			var sql = 'DELETE  FROM roomUserData WHERE user_id = ?';	// 방 정보 DB에서 지운다.
			conn.query(sql, datas, function(err, result) {
				if(err)
				{

					var error = 'exitroom_error';
					conn.release();
					callback(err, error, error);
				}
				else
				{
					var affectedrows = result.affectedRows;
					//console.log(a);
					conn.release();
					callback(null, datas, affectedrows);
				}
			});
		}

	});
}


var mastercheck = function (datas, affectedrows, callback) {		//방을 나간 유저가 마스터 인지 확인
	pool.getConnection(function (err, conn) {
		if(err) 
		{
			var error = 'DB_connection_error';
			callback(error);
		}
		else
		{		
			var sql = 'SELECT COUNT(*) AS cnt FROM room WHERE master_id = ?';	// 방 정보 DB에서 꺼내온다.
			conn.query(sql, datas, function(err, list) {
				if(err)
				{

					var error = 'exitroom_error';
					conn.release();
					callback(err, error, error);
				}
				else // Query OK
				{
					// console.log('마스터 확인 : ', list);
					if (list[0].cnt == 1){
						conn.release();
						callback(null, datas ,affectedrows);
					}
					else{
						conn.release();
						callback(null, datas ,affectedrows);
					}
				}
			
			});
		}
	});
}

var masterexit = function(datas, affectedrows, callback){		// 마스터가 방을 나갔을 경우
	pool.getConnection(function (err, conn) {
		if(err) 
		{
			var error = 'DB_connection_error';
			callback(error);
		}
		else
		{
			var sql = 'DELETE FROM room WHERE master_id = ?';	// 방 정보 DB에서 꺼내온다.
			conn.query(sql, datas, function(err, list) {
				if(err)
				{
					var error = 'exitroom_error';
					conn.release();
					callback(err, error);
				}
				else//Query OK
				{
					if (affectedrows == 1)
					{
						var exitmsg = 'exit_room'
						conn.release();
						callback(null, exitmsg);	
					}
					else if (list.affectedRows == 1){
						var exitmsg = 'exit_room'
						conn.release();
						callback(null, exitmsg);	
					}
					else {
						var errormsg = 'exit_room_fail'
						conn.release();
						callback(null, errormsg);	
					}
				}
			});
		}
	});
}

exports.exitroom = function (datas, callback) {
	async.waterfall([
		function (callback){
			usercheck(datas, callback);
		},function (datas, callback) {
			userexit(datas, callback);
		}, function (datas, affectedrows, callback) {
			mastercheck(datas, affectedrows, callback);
		}, function (datas, affectedrows, callback){
			masterexit(datas, affectedrows, callback);
		}

	], function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
}