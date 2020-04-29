const server = require('express')();
const http = require('http').Server(server);
const io = require('socket.io')(http);
let playerSockets = [];
let players = [];

const PORT = process.env.PORT || 3002;

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    playerSockets.push(socket.id);

    if (playerSockets.length === 1) {
        io.emit('isPlayerA');
    };

    socket.on('dealCards', function () {
        io.emit('dealCards');
    });

    socket.on('cardPlayed', function (gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA);
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
        io.emit('playerAdded', players);
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