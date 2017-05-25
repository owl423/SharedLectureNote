// login.js
var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../db_model/login');

/*	로그인 요청 /login 들어온 경우 */
router.post('/', function (req, res) {
	var id = req.body.ID;
	var pw = req.body.PW;

	// 유효성 검사
	if(id === undefined) {
		res.json({
			"success" : 0,
			"work" : "id_undefined",
			"result" : null
		});
	} else if(pw === undefined) {
		res.json({
			"success" : 0,
			"work" : "pw_undefined",
			"result" : null
		});
	} 
	 else {
		var datas = [id, pw];

		db.login(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'checkUser_error' ) {				
				res.json({
					"success" : 0,
					"work" : result,
					"result" : null
				});
			} else if(result === 'No_value') {
				// id 틀린 경우
				res.json({
					"success" : 0,
					"work" : "존재하지 않는 회원입니다.\n회원가입을 후 이용해주시기 바랍니다.",
					"result" : null
				});
			} else if(result === 'pw_unmatch') {
				// 비밀번호 틀린 경우
				res.json({
					"success" : 0,
					"work" : "비밀번호가 일치하지 않습니다.",
					"result" : null
				});
			} else if(result === 'unknown_login_error') {
				// 알 수 없는 오류
				res.json({
					"success" : 0,
					"work" : "로그인 정보와 관련된 오류가 발생했습니다.\n관리자에게 문의하시기 바랍니다.",
					"result" : null
				});
			}  else if(result.length == 0) {
				res.json({
					"success" : 0,
					"work" : "입력한 id가 존재하지 않습니다.",
					"result" : null
				});
			} else{

				req.session.id = result[0].id;
				res.json({
					"success" : 1,
					"work" : "0",
					"result" : null
				});
			}

		});
	}
});

module.exports = router;