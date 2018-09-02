//TODO: when the tab closes, the game should reset.

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//loads the word_list from a file.
var word_list = require('./public/js/wordList.js');
word_list = word_list.word_list;

var user_finished = 0;

var port = process.env.PORT || 3000;

//necessary to use linked css and javscript files on frontend
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

function createSentence() {
    //creates a sentence
    var sentenceLength = 10
    var resultString = '';
    for (var i = 0; i < sentenceLength; i++) {
        wordIndex = Math.floor(Math.random() * 900);
        resultString += word_list[wordIndex] + ' ';
    }
    var sliced = resultString.slice(0, -1) + '.';
    return sliced;
}

function start_game() {
    //tells the client to start a game
    io.emit('sentence', createSentence());
}

io.on('connection', function(socket) {
    user_count = io.engine.clientsCount
    socket.on('user_finished', function(trash) {
        if (user_finished == 0){
            socket.emit("win_or_lose", "win!");
            user_finished = 1;
        } else if (user_finished == 1) {
            socket.emit("win_or_lose", "lose.");
            user_finished = 0
        }
    });
    if (user_count !=  0 && user_count % 2 == 0) {
        //if there are 2 users connected,
        //the game starts and the counter
        //gets initialized again, so other users
        //can play too.
        start_game();
    }
});

http.listen(port, function(){});
