var express = require('express');
var router = express.Router();
var db = require('../db_model/register');

router.post('/', function (req, res) {
	var id = req.body.ID;
	var pw = req.body.PW;

	// console.log('id : ', id);
	// console.log('pw : ', pw);
	
	// 유효성 검사
	if(id === undefined) {
		res.json({
			"success" : 0,
			"work" : "register",
			"result" : null
		});
	} 
	else if(pw === undefined) {
		res.json({
			"success" : 0,
			"work" : "register",
			"result" : null
		});
	} else {
		// 값이 온전히 올라온 경우
		var datas = [id, pw];
		// console.log('datas : ', datas);

		// 회원가입 작업 실시
		db.register(datas, function (result) {
			if(result === 'DB_connection_error') {
				// DB 접속에 실패한 경우
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'checkData_error') {
				// id 중복확인 query 실패
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'userID_duplicated') {
				// DB에 접속했으나 id값 중복인 경우
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'regMember_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'unknown_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else {
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