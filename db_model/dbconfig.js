var mysql = require('mysql');

var dbConfig = {
	connectionLimit: 50,
	host: '52.79.167.107',
	user: 'root',	// root
	password: '1111',	// 1119
	database: 'project'
};

// pool 변수에 connection에 쓸 mysql Pool 값을 저장
var pool = mysql.createPool(dbConfig);

module.exports = pool;