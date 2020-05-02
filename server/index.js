const server = require('express')();
const http = require('http').Server(server);
const io = require('socket.io')(http);
var cPort = 3021;

let playerSockets = [];
let players = [];
let tabledCards = [];
let tabledCardValues = ["","","",""];
let dealCards = [];
let subScores = [0,0,0,0];
let mainScores = [0,0,0,0];
let trump = "gray_back";

let playStarted = false;
let gameEnd = false;
let mainRoundEnd = false;
let subRoundEnd = false;

let maxCardIndex = -1
let playTurn = 0;
let lastPlayTurn = 0;
let roundStartPlayTurn = 0;
let subRoundNumber = 1;
let orderedDeck = ["7C","7D","7H","7S","8C","8D","8H","8S",
                   "9C","9D","9H","9S","IC","ID","IH","IS",
                   "JC","JD","JH","JS","QC","QD","QH","QS",
                   "KC","KD","KH","KS","AC","AD","AH","AS"];

const PORT = process.env.PORT || cPort;

var resetTable = function()
{
            players = [];
            tabledCards = [];
            tabledCardValues = ["","","",""];
            dealCards = [];
            subScores = [0,0,0,0];
            mainScores = [0,0,0,0];
            trump = "gray_back";
            playStarted = false;
            gameEnd = false;
            mainRoundEnd = false;
            subRoundEnd = false;

            maxCardIndex = -1
            roundStartPlayTurn = 0;
            lastPlayTurn = 0;
            playTurn = 0;
            subRoundNumber = 1;
}

var suffle = function()
{
    let sDeck = orderedDeck.slice(); // Copy array
    let counter = sDeck.length , temp,i;
    
    while(counter)
    {
        i = Math.floor(Math.random() * counter--);
        temp           = sDeck[counter];
        sDeck[counter] = sDeck[i];
        sDeck[i]       = temp
    }

    return sDeck;
}

var removeCardFromDeal = function( cardValue )
{   
    for( var i = 0; i < dealCards.length; i++)
    {
        for( var j = 0; j < dealCards[i].length ; j++ )
        {
            if( dealCards[i][j] === cardValue )
            {
                var removed = dealCards[i].splice(j, 1);// Remove element
                console.log( removed +" is removed from the deck-" + i );
                console.log("The new deck-"+ i + " : " + dealCards[i]);
            }
        }
    }
}

var tabledTheCard = function( gameObject, cardValue, playerIndex )
{   
    tabledCardValues[playerIndex] = cardValue;

    tabledCards.push({
        playerIndex: playerIndex,
        card: gameObject
    });

    removeCardFromDeal(cardValue);
    lastPlayTurn = playTurn;
    playTurn = (playTurn+1)%4;
}

var getDeal = function()
{
    var suffledDeck = suffle();
    var deal = [];

    deal.push(suffledDeck.slice(0, 8));
    deal.push(suffledDeck.slice(8, 16));
    deal.push(suffledDeck.slice(16, 24));
    deal.push(suffledDeck.slice(24));

    return deal;
}


var calculateScores = function()
{
    console.log("Last Play Turn: "+lastPlayTurn);
    console.log("tableSuit card owner"+(lastPlayTurn+1)%4)
    console.log("tableSuit : "+tabledCardValues[(lastPlayTurn+1)%4].substr(1, 1))
    var tableSuit = tabledCardValues[(lastPlayTurn+1)%4].substr(1, 1);
    maxCardIndex = -1;
    var trumpAvailable = false;

    for(var i = 0; i < tabledCardValues.length; i++)
    {
        console.log("Comparison1 trump:" +trump);
        console.log("Comparison1 card:" +trump);
        if(tabledCardValues[i].search(trump) !== -1)
        {
            console.log("Comparison1 trump available:");
            trumpAvailable = true;
            if( maxCardIndex !== -1 )
            {
                console.log("Comparison1:" +tabledCardValues[i].charCodeAt(0)+ "==="+65);
                console.log("Comparison2:" +tabledCardValues[maxCardIndex].charCodeAt(0)+ "<"+tabledCardValues[i].charCodeAt(0));  
                if( tabledCardValues[maxCardIndex].search(trump) === -1 )
                {
                    maxCardIndex = i;
                }
                else if( tabledCardValues[maxCardIndex].charCodeAt(0) === 65 )
                {
                    continue;
                }
                else if( tabledCardValues[i].charCodeAt(0) === 65 )
                {
                    maxCardIndex = i;
                }
                else if( tabledCardValues[maxCardIndex].charCodeAt(0) === 75 )
                {
                    continue;
                }
                else if( tabledCardValues[i].charCodeAt(0) === 75 )
                {
                    maxCardIndex = i;
                }
                else if( tabledCardValues[maxCardIndex].charCodeAt(0) < tabledCardValues[i].charCodeAt(0))
                {
                    maxCardIndex = i;
                }
            }
            else
            {
                maxCardIndex = i;
            }
        }
        else if( !trumpAvailable && (tabledCardValues[i].search(tableSuit) !== -1))
        {
           // console.log("Max card index in loop :"+maxCardIndex);
            if( maxCardIndex !== -1 )
            {
                //console.log("tabledCards: "+tabledCardValues)
               // console.log("Looping card: "+i +": "+tabledCardValues[i])
               // console.log("Comparison1:" +tabledCardValues[i].charCodeAt(0)+ "==="+65);
               // console.log("Comparison2:" +tabledCardValues[maxCardIndex].charCodeAt(0)+ "<"+tabledCardValues[i].charCodeAt(0));  
                if( tabledCardValues[maxCardIndex].charCodeAt(0) === 65 )
                {
                    continue;
                }
                else if( tabledCardValues[i].charCodeAt(0) === 65 )
                {
                    maxCardIndex = i;
                }
                else if( tabledCardValues[maxCardIndex].charCodeAt(0) === 75 )
                {
                    continue;
                }
                else if( tabledCardValues[i].charCodeAt(0) === 75 )
                {
                    maxCardIndex = i;
                }
                else if( tabledCardValues[maxCardIndex].charCodeAt(0) < tabledCardValues[i].charCodeAt(0))
                {
                    maxCardIndex = i;
                }
                
            }
            else
            {
                maxCardIndex = i;
            }
        }
    }

    console.log("Final Max card index :"+maxCardIndex);

    subScores[maxCardIndex]++;
    subScores[(maxCardIndex+2)%4]++;

    console.log("subScores :"+subScores);

    if(subRoundNumber === 8)
    {
        var gryffindorScore =  subScores[0] + subScores[2];
        var slytherin       =  subScores[1] + subScores[3];
        if( gryffindorScore > slytherin )
        {
            mainScores[0]++;
            mainScores[2]++;
        }
        else if ( gryffindorScore < slytherin )
        {
            mainScores[1]++;
            mainScores[3]++;
        }

        subScores = [ 0, 0, 0, 0 ]
    }
    
}

var processSubRound = function()
{

    calculateScores();

    if( mainScores[0] === 10 || mainScores[1] === 10 )
    {
        gameEnd = true;
    }
    else if( subRoundNumber === 8 )
    {
        mainRoundEnd = true;
        console.log("roundStartPlayTurn1: "+roundStartPlayTurn);
        roundStartPlayTurn = (roundStartPlayTurn+1)%4;
        console.log("roundStartPlayTurn2: "+roundStartPlayTurn);
        playTurn = roundStartPlayTurn;
    }
    else
    {
        subRoundEnd = true;
        playTurn = maxCardIndex;
    }

    subRoundNumber = 1 + (subRoundNumber%8);
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

    socket.on('cardPlayed', function (gameObject, cardValue, playerIndex) {

        console.log("Played Card: " + cardValue);
        tabledTheCard(gameObject, cardValue, playerIndex);
        io.emit('cardPlayed', gameObject, playerIndex, playTurn);
    });

    socket.on('startPlay', function () {
        
        if(!playStarted)
        {
            dealCards = getDeal();
            playStarted =true;
            console.log("Play Started")
            io.emit('selectTrump', playTurn, dealCards);
            //io.emit('dealCards', dealCards, playTurn);
        }
    });

    socket.on('quite', function () {
        resetTable();
        io.emit('quite');
    });

    socket.on('trumpSelected', function (roundTrump) {
        //dealCards = getDeal();

        trump = roundTrump;
        console.log("Round trump selected: "+ trump);
        io.emit('dealCards', dealCards, playTurn, trump);
    });
    

    socket.on('subRoundEnd', function (sRoundNumber) {
       // console.log("sRoundNumber: "+sRoundNumber);
       // console.log("subRoundNumber: "+subRoundNumber);
        if(sRoundNumber === subRoundNumber)
        {
            tabledCards = [];
            processSubRound();

            if( subRoundEnd )
            { 
                subRoundEnd = false;
                io.emit('subRoundEnd', playTurn, subScores);
            }
            else if( mainRoundEnd )
            {
                dealCards = getDeal();
                trump = "gray_back";
                mainRoundEnd = false;
                io.emit('mainRoundEnd', playTurn, mainScores, dealCards);
            }
            else if( gameEnd )
            {
                gameEnd = false;
                io.emit('gameEnd' , mainScores);
            }
        }
    });
/*
    socket.on('dealCards', function () {
        dealCards = getDeal();
        io.emit('dealCards', dealCards, playTurn);
    });*/

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
        io.emit('playerAdded', players, tabledCards, dealCards, playTurn, trump, playStarted );
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        playerSockets = playerSockets.filter(player => player !== socket.id);

        if(playerSockets.length === 0)
        {
            resetTable();
        }
    });
});

http.listen(PORT, function () {
    console.log('Server started!');
});