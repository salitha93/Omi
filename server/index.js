const server = require('express')();
const http = require('http').Server(server);
const io = require('socket.io')(http);
let playerSockets = [];
let players = [];
let tabledCards = [];
var dealCards = []
let playStarted = false;
let playTurn = 0;

const PORT = process.env.PORT || 3004;

var getDeal = function()
{
    return [1,2,3,4,5,6,7,8];
}

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    playerSockets.push(socket.id);

    if (playerSockets.length === 1) {
        io.emit('isPlayerA');
    };

    /*socket.on('dealCards', function () {
        io.emit('dealCards');
    });*/

    socket.on('cardPlayed', function (gameObject, playerIndex) {

        tabledCards.push({
            playerIndex: playerIndex,
            card: gameObject
        });

        io.emit('cardPlayed', gameObject, playerIndex);
    });

    socket.on('startPlay', function () {
        dealCards = getDeal();
        if(!playStarted)
        {
            playStarted =true;
            console.log("Play Started")
            io.emit('dealCards', dealCards, playTurn);
        }
    });

    socket.on('playerLoggedIn', function (player) {
        console.log("A player Logged in: "+ player.playerName);
        if( players.length < 4 )
        {
            var playerAlreadyExits = false;
            for (var i = 0 ; i < players.length ; i++ )
            {
                if ( players[i].playerID === player.playerID )
                {
                    playerAlreadyExits = true;
                    console.log("A player already exist: "+ player.playerName);
                }
            }

            if(!playerAlreadyExits)
            {
                players.push(player);
            }
        }
        io.emit('playerAdded', players, tabledCards, dealCards, playTurn);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        playerSockets = playerSockets.filter(player => player !== socket.id);

        if(playerSockets.length === 0)
        {
            players = [];
        }
    });
});

http.listen(PORT, function () {
    console.log('Server started!');
});