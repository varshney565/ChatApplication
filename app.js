const express = require('express');
const app = express();
const path = require('path');
/**
 * we need http server
 */
const server = require('http').Server(app);
/**
 * socket server is also needed on both client and server side.
 */
const socket = require('socket.io');
const io = new socket.Server(server);

/**
 * when client is trying to connect to the server.
 */
let clientCount = 0;
const userIds = {};
const users = [];
console.log(users);
io.on('connection',(socket)=>{
    clientCount++;
    //setUserName --> respond with either userExists or userAllowed(res:username)
    //sendMessage
    //newMessage
    function userExists(data){
        return users.includes(data);
    }
    socket.on('setUserName',(data)=>{
        /**
         * check if user exists or not,if yes userExists
         * otherwise userAllowed.
         */
        
        if(userExists(data)){
            console.log(`${data} is already present in the databse !`);
            socket.emit('userExists',"user is already present !");
        }else{
            console.log(`new entry of user : ${data} in the database.`);
            users.push(data);
            userIds[socket.id] = data;
            socket.emit('userAllowed',{
                userName : data,
            });
        }
    })

    socket.on('sendMessage',(data)=>{
        io.sockets.emit('newMessage',data);
    })

    socket.on('disconnect',()=>{
        const user = userIds[socket.id];
        let ind = users.indexOf(user);
        users.splice(ind,1);
        delete userIds[socket.id];
    })
}); 

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname , "./index.html"));
})

server.listen(8080,()=>{
    console.log("server started running !!");
})