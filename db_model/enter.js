var pool = require('./dbconfig');
var async = require('async');
var path = process.cwd();
var makeRoomDatajson = require(path + '/function/makeRoomDatajson');


var checkroom = function(datas, callback){			// 선택한 방이 목록에 있는지 확인
	pool.getConnection(function(err, conn){
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else
		{
			var sql = 'SELECT COUNT(*) AS cnt FROM room WHERE room_num = ?';
			conn.query(sql, datas[1], function(err, rows){
				if(err)
				{
					var error = 'checkroom_error';
					conn.release();
					callback(err, error);
				}
				else
				{
					if(rows[0].cnt == 1)
					{
						conn.release();
						callback(null, datas);
					}
					else
					{
						var error = 'room_not_exist';
						conn.release();
						callback(err, error);
					}
				}
			});
		}
	});
}

var checkuser = function(datas, callback){				//이미 입장한 유저인지 확인
	pool.getConnection(function(err, conn){
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else
		{
			var sql = 'SELECT COUNT(*) AS cnt FROM roomUserData WHERE user_id = ?';
			conn.query(sql, datas[0], function(err, rows){
				if(err)
				{
					var error = 'checkuser_error';
					conn.release();
					callback(err, error);
				}
				else
				{
					if(rows[0].cnt == 1)
					{
						var error = 'user_is_duplicated';
						conn.release();
						callback(err, error);					
					}
					else
					{
						conn.release();
						callback(null, datas);
					}
				}
			});
		}
	});
}


var enterroom = function(datas, callback){		// roomUserData 테이블에 입장한 유저를 추가 한다.
	pool.getConnection(function(err, conn){
		if(err){
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else
		{
			var sql = 'INSERT INTO roomUserData(user_id, room_num) VALUES (?,?)';
			conn.query(sql, datas, function(err, rows){
				if(err)
				{
					var error = 'user_is_duplicated'; //이미 유저가 입장해 있는 경우
					conn.release();
					callback(error, error);
				}
				else
				{
					conn.release();
					callback(null, datas);
				}
			});
		}
	});
}

var getroomUserData = function(datas, callback){	//방에 입장해 있는 사람들의 아이디를 가져온다.
	pool.getConnection(function(err, conn){
		if(err){
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else
		{
			var sql = 'SELECT user_id FROM roomUserData WHERE room_num = ?';
			conn.query(sql, datas[1], function(err, rows){
				if(err)
				{
					var error = 'getRoomUserDataError';
					conn.release();
					callback(err, error, error);
				}
				else
				{
					conn.release();
					callback(null, datas, rows);
				}
			});
		}
	});
}


var getroomdata = function(datas, result, callback){		//입장한 방의 그리기 정보 가져옴
	pool.getConnection(function(err, conn){
		if(err) {
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else
		{
			var sql = 'SELECT room_num, string_type, string_size, string, pen_style, pAlpha, pR, pG, pB, x, y, pen_size, sR, sG, sB, isDraw, typeface, isText, user_id, idx FROM roomData WHERE room_num=?';
			conn.query(sql, datas[1], function(err, rows){
				if(err)
				{
					var error = 'getroomdata_error'; //방의 그리기 정보 가져올때 에러가 발생한 경우
					conn.release();
					callback(err, error);
				}
				else
				{
					//console.log(rows);
					
					var temp = [];
					for (var i = 0 ; rows[i] != null ; i++)
						temp.push(makeRoomDatajson(i, rows));
					rows.data = temp;
					rows.userlist = result;

					conn.release();
					callback(null, rows);
				}
			});
		}
	});
}


exports.enter = function (datas, callback) {
	async.waterfall([
		function (callback) {
			checkroom(datas, callback);
		}, function (datas, callback) {
			checkuser(datas, callback);
		}, function (datas, callback) {
			enterroom(datas, callback);
		}, function(datas, callback){
			getroomUserData(datas, callback);
		}, function(datas, rows, callback){
			getroomdata(datas, rows, callback)
		}
	],function (err, result) {
		if(err) console.log('err : ', err);
		callback(result);
	});
};



