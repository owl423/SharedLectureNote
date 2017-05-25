var express = require('express');
var router = express.Router();


// DB 연결
var db = require('../db_model/roomlist');
var makejson = require('../function/makejson');


router.get('/', function (req, res) {
	var result = [];

	db.roomlist(function (rows){
		if(rows === 'DB_connection_error') 
		{
			// DB 연결 error
			res.json({
				"success" : 0,
				"work" : "db_error",
				"result" : null
			});
		}
		else if (rows === 'getList_error') 
		{
		// query error
			res.json({
				"success" : 0,
				"work" : "getList_error",
				"result" : null
			});
		} 
		else 
		{
			if(rows.length !== 0)
			{
				for (i = 0;  i<rows.length; i++)
				{
					result.push(makejson(i, rows));
				}
				res.json({
					"success" : 1,
					"work" : "roomlist",
					"result" : result
				});
			}
			else
			{
				res.json({
					"success" : 1,
					"work" : "roomlist is empty",
					"result" : null	
				});
			}
		}
	});
	
});

module.exports = router;
