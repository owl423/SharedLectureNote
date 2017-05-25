// makejson

var makejson = function (i, data){
	var json;

	json = {
		"masterId" : data[i].master_id,
		"roomNum" : data[i].room_num
	};

	return json;
}

module.exports = makejson;
