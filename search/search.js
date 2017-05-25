var express = require('express');
var router = express.Router();

// DB 객체
var db = require('../db_model/search');
var makejson = require('../function/makejson');

/*	방 검색 요청이 들어온 경우 */
router.post('/', function (req, res) {
	var id = req.body.searchId;
	var resultlist = [];
	if(id === undefined) {
		res.json({
			"success" : 0,
			"work" : "id_undefined",
			"result" : null
		});
	} else {
		var datas = [id];
		db.search(datas, function (result) {
			if(result === 'DB_connection_error') {
				res.json({
					"success" : 0,
					"work" : "searchroom",
					"result" : "DB_connection_error"
				});
			} else if(result === 'master_id not exist'){
				res.json({
					"success" : 0,
					"work" : "search",
					"result" : "master_id not exist"
				});
			}
			else{
				//console.log(result);
				for (i = 0;  i<result.length; i++)
					resultlist.push(makejson(i, result));
				res.json({
					"success" : 1,
					"work" : "search",
					"result" : resultlist
				});
			}

		});
	}
})

module.exports = router;