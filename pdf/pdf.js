var express = require('express');
var router = express.Router();
var db = require('../db_model/pdf');

router.post('/', function (req, res) {
	var roomnum = req.body.roomnum;
	var fname = req.body.fName;
	var data = req.body.data;

	// 유효성 검사
	if(roomnum === undefined) {
		res.json({
			"success" : 0,
			"work" : "roomnum",
			"result" : null
		});
	} 
	else if(fname === undefined) {
		res.json({
			"success" : 0,
			"work" : "fname",
			"result" : null
		});
	}
	else if(data === undefined) {
		res.json({
			"success" : 0,
			"work" : "data",
			"result" : null
		});
	else {
		// 값이 온전히 올라온 경우
		var datas = [fname, data, roomnum];

		db.pdf(datas, function (result) {
			if(result === 'DB_connection_error') {
				// DB 접속에 실패한 경우
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} 
			else {
				res.json({
					"success" : 1,
					"work" : "register",
					"result" : "ok"
				});
			}
		});
	}
});

module.exports = router;