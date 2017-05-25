var async = require('async');
var pool = require('./dbconfig');


exports.room = function(tempresult, callback){		//그려진 데이터 추가
	pool.getConnection(function(err, conn){
		if(err){
			var error = 'DB_connection_error';
			callback(err, error);
		}
		else
		{
			var id = tempresult.id;
			var roomnum = tempresult.roomnum;
			var x = tempresult.x;
			var y = tempresult.y;
			var penSize = tempresult.penSize;
			var penType = tempresult.penType;
			var pA = tempresult.pA;
			var pR = tempresult.pR;
			var pG = tempresult.pG;
			var pB = tempresult.pB;
			var sR = tempresult.sR;
			var sG = tempresult.sG;
			var sB = tempresult.sB;
			var str = tempresult.string;
			var strSize = tempresult.strSize;
			var strType = tempresult.strType;
			var isDraw= tempresult.isDraw;
			var typeface = tempresult.typeface;
			var isText = tempresult.isDraw;
			var index = tempresult.index;
			var datas = [roomnum, strType, strSize, str, penType, pA, pR, pG, pB, x, y, penSize, sR, sG, sB, isDraw, typeface, id, isText, index];
			var sql = 'INSERT INTO roomData(room_num, string_type, string_size, string, pen_style, pAlpha, pR, pG, pB, x, y, pen_size, sR, sG, sB, isDraw, typeface, user_id, isText, idx) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
			conn.query(sql, datas, function(err, rows){
				if(err)
				{
					var error = 'inputroomdata_error';
					conn.release();
					callback(err, error);
				}
				else
				{
					if(rows.affectedRows ==1){
						rows.data = tempresult;
						conn.release();
						callback(rows);
					}
				}
			});
		}
	});
}