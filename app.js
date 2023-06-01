// Importing the required modules
const { createPublicKey } = require('crypto');
var express = require('express');
var app= express();
//const WebSocketServer = require('ws');

const httpServer = require('http').createServer(app);

const io = require("socket.io")(httpServer, 
    {
        cors: { origin: "*"}
    }
    );
    var player_ids=[]; // id игроков
    var players_info={}; // инфа об игроках
    var player1;
    var player2;
    var cards;
    //select name from cards ( внутри запроса перемешать)
    cards=["10c.jpg","10d.jpg","10h.jpg","10s.jpg","6c.jpg","6d.jpg","6h.jpg","6s.jpg","7c.jpg","7d.jpg","7h.jpg","7s.jpg","8c.jpg","8d.jpg","8h.jpg","8s.jpg","9c.jpg","9d.jpg","9h.jpg","9s.jpg","Ac.jpg","Ad.jpg","Ah.jpg","As.jpg","Jc.jpg","Jd.jpg","Jh.jpg","Js.jpg","Kc.jpg","Kd.jpg","Kh.jpg","Ks.jpg","Qc.jpg","Qd.jpg","Qh.jpg","Qs.jpg"];
var prices= {
    "10c.jpg": 10,
    "10d.jpg": 10,
    "10h.jpg": 10,
    "10s.jpg": 10,
    "9c.jpg": 9,
    "9d.jpg": 9,
    "9h.jpg": 9,
    "9s.jpg": 9,
    "8d.jpg": 8,
    "8h.jpg": 8,
    "8s.jpg": 8,
    "8c.jpg": 8,
    "7d.jpg": 7,
    "7h.jpg": 7,
    "7s.jpg": 7,
    "7c.jpg": 7,
};
cards = shuffle(cards);

  httpServer.listen(3000, function(aaa)
  { console.log(aaa);
    //console.log(this);
    console.log('server started');
  
    io.on('connection', function(client)  {
     // console.log(client);
     console.log(client.handshake.address);
      console.log(client.handshake.auth.token)
      const clients_count = io.engine.clientsCount;
      console.log('clients_count= ' +clients_count);
        //пускаем, если их меньше трех
          if(clients_count<3)  { 
            player_ids.push(client.id); //добавляем id игрока
            players_info[client.id]={ player_name:"", cards:[] }; 
            //добавляем в players_info зачаток инфы об игроке
            console.log("Игроков уже:"+ player_ids.length);
        console.log('connected');
          }

            else {
                console.log("третий");
                io.to(client.id).emit("msg","ты третий");
            var disconnect_result = client.disconnect(true);
           //     console.log(disconnect_result);
              //  console.log("отключился"); 
                //io - сервер
                // у клиента с id (client.id) вызвать событие msg с информацией ты третий
            }
          
      client.on('more', function() { 
          //client.id id того, кто нажал more
          var partner_id = player_ids.find(function(player) {
            return player!=client.id;
          }); //partner_id - это id не того, кто нажал ( то есть партнера )
           
          io.to(client.id).emit("give_card",cards[0]);//даем карту тому, кто нажал
          console.log(prices[cards[0]]);
          io.to(client.id).emit("score", prices[cards[0] ] ); //передаем очки данной карты
          players_info[client.id].cards.push(cards[0]);
          // добавляем в инфу об игроке карту
          // insert into players .....  cards[0]
          //цена -  select 
          console.log(players_info);
          io.to(partner_id).emit("card_given","blanc.jpg");//карта дана сопернику  
          cards.shift(); 

          client.on('disconnect', () => { /* … */ });
      });
      client.on('disconnect', function(reason) {
        console.log('кто-то ушел');
        console.log(reason);
      })
  });
console.log('listening');
  });

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }


/*

 all_messages=[];
// Creating a new websocket server
const wss = new WebSocketServer.Server({port: 9000});
players=[]; //players.length==0
                      
current_card_id=0;//  верхняя
//cards=[1,2,3,4,5,6,7,8,9,10,11];
cards=["10c.jpg","10d.jpg","10h.jpg","10s.jpg","6c.jpg","6d.jpg","6h.jpg","6s.jpg","7c.jpg","7d.jpg","7h.jpg","7s.jpg","8c.jpg","8d.jpg","8h.jpg","8s.jpg","9c.jpg","9d.jpg","9h.jpg","9s.jpg","Ac.jpg","Ad.jpg","Ah.jpg","As.jpg","Jc.jpg","Jd.jpg","Jh.jpg","Js.jpg","Kc.jpg","Kd.jpg","Kh.jpg","Ks.jpg","Qc.jpg","Qd.jpg","Qh.jpg","Qs.jpg"];
cards = shuffle(cards);
function add_player(name) 
{ 
    players.push(name); 
    console.log(players.length);
}

// Creating connection using websocket
// при подключении клиента
wss.on("connection", function(ws)  {
  
 console.log("new client connected");
    console.log(wss.clients.size);
    console.log(players.length);
    // при нажатии
    // on = "при"
    ws.on('message'), function(data) 
        {
            var msg = `${data}`; 
            if(msg=='more') { }
        }
    ws.on('more', function(data) {   

        var player_number =    `${data}`;
            more(wss.clients, player_number);
        
      
      });
    ws.on("message", function(data)  {

            var msg =    `${data}`;

        if(msg.includes("player_")) {
          
            console.log(msg);

            if(players.length==2) { ws.send("двое уже есть");    }

            if(players.length==1) { ws.send("привет от сервера, ты второй");    add_player(msg);} // [1,1]
        
            //если никого нет {         }
            if(players.length==0) { ws.send("привет от сервера, ты первый");   add_player(msg); }
        }

        if(msg.includes("more")) { 

            if(msg=="more0") { //нажал первый игрок на more


                
                    
            }
            if(msg=='more1') { // нажал второй игрок на more

               

            }


           

           
        }

        if(msg.includes("enough")) { 

            //ws.send("")
        }




           
          //  console.log(data);
          // if(data.start)

    });
 
 
});


console.log("The WebSocket server is running on port 9000");


  */
        //wss - websocket server (телефонная станция)

function more(wss,player_number)
{
    if(player_number==0)
       {
        //wss.clients[0].send(cards[0]);  
        wss.clients[0].emit('give_card',cards[0]);
        cards.shift();
        console.log(cards.length);
        //удалить последний элемент из массива
        //wss.client[1].send("blanc.jpg"); 
        wss.client[1].emit('give_card','blanc.jpg');
    }
    if(player_number==1)
    {
        
        //wss.clients[1].send(cards[0]); 
        wss.clients[1].emit('give_card',cards[0]); 
        cards.shift();
        console.log(cards.length);
        //удалить последний элемент из массива
        wss.client[0].emit('give_card','blanc.jpg');
        //wss.client[0].send("blanc.jpg"); 
        
    }
}
  
