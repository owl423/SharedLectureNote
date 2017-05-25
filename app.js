var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

//추가한 부분
var register = require('./register/register');
var login = require('./login/login');
var roomlist = require('./roomlist/roomlist');
var search = require('./search/search');


var roomdb = require('./db_model/room');
var enterdb = require('./db_model/enter');
var exitroomdb = require('./db_model/exitroom');
var entersocketdb = require('./db_model/entersocket');
var makeroomdb = require('./db_model/makeroom');
var pdfUploaddb = require('./db_model/pdfUpload');
var pageChangedb = require('./db_model/pagechange');
var fileenterroomdb = require('./db_model/fileenterroom');
var ondeletedb = require('./db_model/ondelete');


var session = require('express-session');



var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);   // 소켓 부분 추가

var http2 = require('http').Server(app);
var fileSocket = require('socket.io')(http2);

var http3 = require('http').Server(app);
var voiceSocket = require('socket.io')(http3);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
    secret : 'I love her but she doesnt love me',   // session 암호화
    resave : false,
    saveUninitialized : true
}));


app.use('/', routes);
app.use('/users', users);

//추가한 부분
app.use('/register', register);
app.use('/login', login);
app.use('/roomlist', roomlist);
app.use('/search', search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
app.set('port', process.env.PORT || 80);


var socketRoom = [];
var roomcnt = 0;
var socketRoomCnt = 0;

voiceSocket.on('connection', function(socket){ // 음성 통신용 소켓
  //console.log('voiceSocket : ', socket.id);
    socket.on('disconnet', function(){
      //console.log('voiceSocket disconnected : ', socket.id);
    })

    socket.on('onVoice', function(data){
      //console.log('Voice Data : ', data);
      var id = data.ID;
      var roomnum = data.roomNum;
      var voicedata = data.voiceData;
      if (data == undefined){
          var json = {
           "success" : 0,
           "work" : onVoice,
           "result" : "data undefined"
          };
      }
      else {
          var json = {
           "userId" : id,
           "roomnum" : roomNum,
           "voiceData" : voiceData
          };
      }
      var socketRoom = roomnum.toString();
      socket.broadcast.to(socketRoom).emit('onVoice', json);
    })

})

fileSocket.on('connection', function(socket){ // 파일 업로드 다운로드용 소캣
  //console.log('io2 connected : ', socket.id);
    socket.on('disconnect',function(){
        //console.log('io2 disconnected', socket.id);
    });

   socket.on('makeRoom', function(req){
        socketRoomCnt++;
        //console.log('파일업로드 방번호 : ', socketRoomCnt);
        var socketRoomNum = socketRoomCnt.toString();
        socket.join(socketRoomNum);
   })
   socket.on('enterRoom', function(req){
        //console.log('enterRoom req : ', req);
        var socketRoomNum = req.roomNum;
        socketRoomNum = socketRoomNum.toString();
        socket.join(socketRoomNum);
        var datas = req.roomNum;
        //console.log('파일 방 입장 소켓 ID :', socket.id);
        var socket_id = socket.id;
        var json;
        fileenterroomdb.fileenterroom(datas, function(result){
          if(result === 'DB_connection_error') {
             // DB 접속에 실패한 경우
             json = {
              "success" : 0,
              "work" : "fileenterroom",
              "result" : "DB_connection_error"
             };
          }
          else{
             //console.log('result : ', result[0]);
             var filename = result[0].file_name;
             var pagenum = result[0].page_num;
             var filedata = result[0].file_data;
             if(filename != null){
                 json = {
                  "success" : 1,
                  "work" : "fileenterroom",
                  "fileName" : filename,
                  "pageNum" : pagenum,
                  "fileData" : filedata
                 };                 
                 fileSocket.to(socket_id).emit('enterRoomPdf', json);
             }
          } 
        })
   });
   socket.on('pdfUpload', function(req){         // PDF 파일 업로드 부분

      var roomnum = req.num;

      var fname = req.fileName;
      var fdata = req.fileData;
      var pagenum = req.pageNum;
      var json;
      var socketRoomNum = roomnum.toString();     
      //console.log('업로드 받은 정보 : ', req);
      // console.log("roomnum", roomnum);
      // console.log("fname", fname);
      // console.log("fdata", fdata);

      if(roomnum === undefined) {
         json = {
          "success" : 0,
          "work" : "roomnum",
          "result" : null
        };
      } 
      else if(fname === undefined) {
         json = {
          "success" : 0,
          "work" : "fname",
          "result" : null
        };
      }
      else if(fdata === undefined) {
         json = {
          "success" : 0,
          "work" : "data",
          "result" : null
        };
      } 
     else { // 값이 온전히 올라온 경우
        var datas = [fname, fdata, pagenum, roomnum];

         //console.log(datas);
        // console.log(fdata);
        // console.log(roomnum);
        
        pdfUploaddb.pdfUpload(datas, function (result) {
          if(result === 'DB_connection_error') {
             // DB 접속에 실패한 경우
             json = {
              "success" : 0,
              "work" : "pdfUploaddb",
              "result" : null
             };
          } 
          else {
             json = {
              "success" : 1,
              "work" : "pdfDownload",
              "fileName" : fname,
              "fileData" : fdata,
              "pageNum" : pagenum
             };
             //console.log("pdfDownload : ", json);
             socket.broadcast.to(socketRoomNum).emit('pdfDownload', json);
          }
        });


      }
   });
   socket.on('pageChange', function(req){
      var roomnum = req.roomNum;
      var pagenum = req.pageNum;
      var datas = [pagenum, roomnum];
      var json;
      var socketRoomNum = roomnum.toString();
      //console.log('페이지 체인지 : ', datas);
      pageChangedb.pageChange(datas, function (result){
         if(result === 'DB_connection_error') {
             // DB 접속에 실패한 경우
             json = {
              "success" : 0,
              "work" : "pageChange",
              "result" : "DB_connection_error"
             };
          }
          else{
             json = {
              "success" : 1,
              "work" : "pageChange",
              "pageNum" : pagenum
             };
            //console.log('pageChange : ', pagenum);
            socket.broadcast.to(socketRoomNum).emit('pageChange', json);
          } 
      })

   });



});

io.on('connection', function(socket){                   //socket부분
    //console.log('a user connected', socket.id);

    socket.on('disconnect',function(){
      //console.log('user disconnected', socket.id);
    });




    socket.on('makeRoom', function(req){        //방생성

      roomcnt++;
      //console.log('방생성번호 : ', roomcnt);
      var id = req.ID;

      var roomnums = roomcnt.toString();
      socket.join(roomnums);

      //console.log('그리기 방번호 : ',roomcnt);
      //console.log('생성 소켓 확인 : ', io.sockets.adapter.rooms);

      var datas = [id, roomcnt];
      var json;
      makeroomdb.makeroom(datas, function (result) {
          if(result === 'DB_connection_error') {
               json = {
                          "success" : 0,
                          "work" : "makeroom",
                          "result" : "DB_connection_error" // DB연결 에러
                        };
           }
          else if(result === 'master_id is duplicated'){
              json = {
                        "success" : 0,
                        "work" : "makeroom",
                        "result" : "master_id is duplicated" // 이미 마스터로 방을 생성한 경우
                        };
          }
          else{
              json = {
                        "success" : 1,
                        "work" : "makeroom",
                        "result" : roomcnt     // 성공적으로 방생성
                        };
          }
	   io.in(roomnums).emit('makeResult', json);
      });

    });




    socket.on('enterRoom', function(req){         // 방입장

      //console.log('방입장 : ', req);

      var id = req.ID;
      var roomnum = req.roomNum;
      var datas = [id, roomnum];
      var json;

      roomnum = roomnum.toString();

      socket.join(roomnum);
      //console.log('입장 소켓 확인 : ', io.sockets.adapter.rooms);
      enterdb.enter(datas, function (result) {    //방입장

        if(result === 'DB_connection_error') { // db 연결 에러인 경우
          json = {
            "success" : 0,
            "work" : result,
            "result" : null
          };
         }
        else if(result == 'room_not_exist'){  // 없는 방에 입장요청 했을경우
          json = {
            "success" : 0,
            "work" : "enter",
            "result" : "room_not_exist"
          };
        }
        else if(result == 'enterroom_error'){ // 입장 시도 했는데 실패했을경우
          json = {
            "success" : 0,
            "work" : "enter",
            "result" : "enterroom_error"
          };
        }
        else if(result == 'getroomdata_error'){ // 방정보 가져오는데 실패했을경우
          json = {
            "success" : 0,
            "work" : "enter",
            "result" : "getroomdata_error"
          };
        }
        else if (result == 'user_is_duplicated'){ // 중복 로그인 된 유저가 이미 방에 있을경우
          json = {
            "success" : 0,
            "work" : "enter",
            "result" : "user_is_duplicated"
          };
        }
        else {
          var userList =[];                                       
          for (var i =0 ; result.userlist[i] != null; i++)
            userList.push(result.userlist[i].user_id);
          //console.log(userList);
          json = {
            "success" : 1,
            "userList" : userList,
            "result" : result.data
          };                                                //현재 방에 입장해 있는 유저 리스트와 앞서 그려진 그림정보를 클라이언트로 보냄
          //console.log('string : ', result.data.string);
          io.in(roomnum).emit('enterResult', json);
        }
     });
    }); 



    socket.on('clientToServer', function(req) // 방 내부 그리기 정보 전송
    {
       var id = req.ID;
       var roomnum = req.roomNum;
       //console.log('그려지는 방번호 : ', roomnum);
       var tempresult = req.result;
       tempresult.roomnum = roomnum;
       tempresult.id = id;
       // console.log('그리기 정보 : ', tempresult);
       roomdb.room(tempresult, function (result)
       {
          if(result === 'DB_connection_error'){
            console.log('DB_connection_error');
          }
          else{            
            var json = {
              'success' : 1,
              'result' : [result.data]
            }; 
            roomnum = roomnum.toString();                //방에서 그려지는 정보를 클라이언트로 보냄
            socket.broadcast.to(roomnum).emit('serverToClient', json);
          }
        });
    });

   socket.on('onDelete', function(req){
      var id = req.ID;
      var index = req.index;
      var roomnum = req.roomNum;
      var datas = [roomnum, id, index];
      ondeletedb.ondelete(datas, function(result){
          if(result === 'DB_connection_error'){
            console.log('DB_connection_error');
          }
          else if(result === 'ondelete_error'){
            var json = {
            "success" : 0,
            "work" : "onDelete",
            "result" : "delete_fail"
            };
          }
          else{
            //console.log('지운 결과 값 : ', result);
            var json = {
              "success" : 1,
              "work" : "onDelete",
              "ID" : id,
              "index" : index
            };
          }
          roomnum = roomnum.toString();
          socket.broadcast.to(roomnum).emit('onDelete', json);
      });
   });

    socket.on('exitRoom', function(req){      // 방 나가기
      var id = req.ID;
      var roomnum = req.roomNum;
      var datas = [id];
      var json;
      //console.log('방나가기 : ', req);
      exitroomdb.exitroom(datas, function (result) {
        if(result === 'DB_connection_error') {
            json = {
              "success" : 0,
              "result" : "DB_connection_error"
            };
        }
        else if(result === 'exitroom_error'){     //방 나가는 요청이 실패했을경우
            json = {
              "success" : 0,
              "result" : "exitroom_error"
            };
        }
        else if (result === 'exit_room'){     // 방에서 성공적으로 나갔을경우
            json = {
              "success" : 1,
              "result" : id
            };
        }
        else if (result === 'exit_room_fail'){ // 방에서 나가는게 실패했을경우
            json = {
              "success" : 0,
              "result" : "no_id"
            };
        }
        else{
            json = {
              "success" : 0,
              "result" : null
            };
        }
        roomnum = roomnum.toString();
        socket.broadcast.to(roomnum).emit('exitResult', json);
        socket.leave(roomnum);
        //console.log('방나가고 소켓 확인 : ', io.sockets.adapter.rooms);
      });
  });
});




http.listen(3000); //그림 그리기 포트 
http2.listen(3001); // 파일 업다운 포트
http3.listen(3002); // 음성 전송 포트
// post, get 용 포트번호 설정 80
// socket 통신용 포트번호 3000
var server = app.listen(app.get('port'), function() {
    console.log('project http 서버가 ' + server.address().port + '에서 실행 중 입니다.');
    });


module.exports = app;
