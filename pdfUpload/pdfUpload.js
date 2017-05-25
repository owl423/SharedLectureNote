var express = require('express');
var router = express.Router();
var db = require('../db_model/pdfUpload');

router.post('/', function (req, res) {
	var jsonData= req.body.jsonData;
	var roomnum = jsonData.num;
	var fname = jsonData.fileName;
	var fdata = jsonData.fileData;

	//console.log("body : ", req.body);
	// console.log("data : ", jsonData);
	// console.log("roomnum", jsonData.roomnum);
	// console.log("fname", jsonData.fname);
	// console.log("fdata",jsonData.fdata);

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
	} else {
		// 값이 온전히 올라온 경우
		var datas = [fname, data, roomnum];

		// console.log(fname);
		// console.log(data);
		// console.log(roomnum);

		res.json({
			"success" : "1",
			"work" : "data",
			"result" : null
		});
		/*
		db.pdfUpload(datas, function (result) {
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
		});*/
	}
});

module.exports = router;