import chatController from "../controllers/chat.js";
import userController from "../controllers/user.js";
import roomController from "../controllers/room.js";

export default function (io) {

  io.on("connection", async (socket) => {
    console.log("one client is connected", socket.id);
    socket.emit("rooms", await roomController.getAllRooms());

    /** Save User */
    socket.on("login", async (username, callback) => {
      try {
        const user = await userController.saveUser(username, socket.id);
        // const welcomeMessage = {
        //   chat: `${username} has joined the chat`,
        //   user: {id: null, name: "system" }
        // }
        // io.emit("message", welcomeMessage)
        callback({ ok: true, data: user });
      } catch (err) {
        callback({ ok: false, error: err.meessage });
      }
    });

    /**save new message */
    socket.on("sendMessage", async (message, id, callback) => {
      try {
        const whoSent = await userController.checkUser(socket.id);
        if( whoSent ){
          const chat = await chatController.saveMessage(message,id, whoSent);
          io.to(id).emit("message", chat);
          console.log("emit good")

          callback({ ok: true, data: chat });
        }else{
          callback({ ok: false, error:"User is not found" });
        }


      } catch (err) {
        callback({ ok: false, error: err.message });
      }
    });

    /** a user enters a room */
    socket.on("joinRoom", async (rid, callback)=> {
      try{

        const whoJoined = await userController.checkUser(socket.id);
        await roomController.joinRoom(rid, whoJoined);


        /**??? */
        socket.join(rid);

        const welcomeMessage = {
          chat: `${whoJoined.name} has joing the chat`,
          user: {id: null, name: "system"}
        }

        io.to(rid).emit("message", welcomeMessage)
        io.emit("rooms", await roomController.getAllRooms()); 
        callback({ok:true})

      }catch(err){
        callback({ok:false, error: err.message})
      }
    })

    /** a user left a room */
    socket.on("leaveRoom", async (_, id,callback)=>{
      try{
        const user = await userController.checkUser((socket.id))
        await roomController.leaveRoom(user, id)
        const leaveMessage = {
          chat : `${user.name} left this chat`,
          user: {id: null, name: "system"}

        };
        socket.broadcast.to(id).emit("message", leaveMessage);
        io.emit("rooms", await roomController.getAllRooms())
        socket.leave(id)
        callback({ok:true})
      }catch(err){
        callback({ok:false, error: err.message})
      }
    })

    /** chat deletion requested */
    socket.on("deleteChat", async (rid, chatid,callback)=>{
      try{
        await chatController.deleteChat(chatid)
   
        io.to(rid).emit("deleteMessage",{
          chatid: chatid
        })
       
        callback({ok:true})

      }catch(err){
        callback({ok:false, error: err})
      }
    })


    socket.on("disconnect", () => {
      console.log(socket.id, " is disconnected!");
      
    });
  });
}
