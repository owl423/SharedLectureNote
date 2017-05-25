var makeRoomDatajson = function (i, data){
	var json;

	json = {
		"penType" : data[i].pen_style,
		"pA" :  data[i].pAlpha,
		"pR" : data[i].pR,
		"pG" : data[i].pG,
		"pB" : data[i].pB,
		"penSize" : data[i].pen_size,
		"strType" : data[i].string_type,
		"strSize" :  data[i].string_size,
		"string" : data[i].string,
		"sR" : data[i].sR,
		"sG" : data[i].sG,
		"sB" : data[i].sB,
		"x" : data[i].x,
		"y" : data[i].y,
		"isDraw" : data[i].isDraw,
		"typeface" : data[i].typeface,
		"isText" : data[i].isText,
		"index" : data[i].idx,
		"userId" : data[i].user_id
	};

	return json;
}

module.exports = makeRoomDatajson;