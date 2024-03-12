import chatController from "../controllers/chat.js";
import userController from "../controllers/user.js";
import roomController from "../controllers/room.js";
import User from "../models/user.js";

export default function (io) {
  io.on("connection", async (socket) => {
    console.log("one client is connected", socket.id);

    /** a user enters a room */
    socket.on("joinRoom", async (rid, callback) => {
      try {
        const whoJoined = await userController.checkUser(socket.id);
        // await roomController.joinRoom(rid, whoJoined);
        socket.join(rid);

        const welcomeMessage = {
          chat: `${whoJoined.name} has joing the chat`,
          user: { id: null, name: "system" },
        };

        io.in(rid).emit("message", welcomeMessage);
        // io.emit("rooms", await roomController.getAllRooms());
        callback({ ok: true });
      } catch (err) {
        callback({ ok: false, error: err.message });
      }
    });

    /** Save User */
    socket.on("login", async (username, callback) => {
      try {
        const user = await userController.saveUser(username, socket.id);
        // socket.emit(
        //   "rooms",
        //   await roomController.getAllRoomsByUserId(user._id)
        // );

        io.emit("online", user); //temp

        callback({ ok: true, data: user });
      } catch (err) {
        callback({ ok: false, error: err.meessage });
      }
    });

    /**save new message */
    socket.on("sendMessage", async (message, roomid, callback) => {
      try {
        const whoSent = await userController.checkUser(socket.id);
        const room = await roomController.getRoom(roomid);
        const array = room.users;
        console.log("arry:", array);
        const index = array.indexOf(whoSent._id);
        console.log("index:", index);
        const answer = index == 1 ? array[index - 1] : array[index + 1];
        console.log("asnwer: ", answer);
        const other = await User.findById(answer);

        if (whoSent) {
          const chat = await chatController.saveMessage(
            message,
            roomid,
            whoSent
          );
          io.in(roomid).emit("message", chat);
          // await roomController.createRoom(other, whoSent)
          // other rooms doesnt have the room? add the room to that other
          if (other.rooms.indexOf(roomid) === -1) {
            other.rooms.push(roomid);
            await other.save();
          }
          io.to(other.token).emit(
            "rooms",
            await roomController.getAllRoomsByUserId(other._id)
          );
          callback({ ok: true, data: chat });
        } else {
          callback({ ok: false, error: "User is not found" });
        }
      } catch (err) {
        callback({ ok: false, error: err.message });
      }
    });

    /** chat deletion requested */
    socket.on("deleteChat", async (rid, chatid, callback) => {
      try {
        await chatController.deleteChat(chatid);

        io.in(rid).emit("deleteMessage", {
          chatid: chatid,
        });

        callback({ ok: true });
      } catch (err) {
        callback({ ok: false, error: err });
      }
    });

    socket.on("addFriend", async (otheruid, callback) => {
      try {
        const u = await userController.checkUser(socket.id);

        console.log(u._id, otheruid);
        if (
          otheruid.toString() === u._id.toString() ||
          u.friends.some((each) => {
            return each.toString() === otheruid;
          })
        ) {
          callback({ ok: false, error: "you already friend" });
        } else {
          const { myuser, otheruser } = await userController.addFriend(
            u._id.toString(),
            otheruid
          );

          socket.emit("myuser", myuser);
          console.log("-");
          console.log("other token:", otheruser);
          io.to(otheruser.token).emit("myuser", otheruser);
          console.log("-");
          callback({ ok: true });
        }
      } catch (err) {
        console.log("-!!!!!!!!!!!");
        callback({ ok: false, error: err });
      }
    });

    socket.on("deleteFriend", async (otheruid, callback) => {
      try {
        const u = await userController.checkUser(socket.id);

        console.log(u._id, otheruid);
        const { myuser, otheruser } = await userController.deleteFriend(
          u._id.toString(),
          otheruid
        );

        socket.emit("myuser", myuser);
        console.log("-");
        console.log("other token:", otheruser);
        io.to(otheruser.token).emit("myuser", otheruser);

        console.log("-");
        callback({ ok: true });
      } catch (err) {
        console.log("-!!!!!!!!!!!");
        callback({ ok: false, error: err });
      }
    });

    //  /** a user remove a room from his list */
    //  socket.on("leaveRoom", async (_, id, callback) => {
    //   try {
    //     const user = await userController.checkUser(socket.id);
    //     await roomController.leaveRoom(user, id);
    //     const leaveMessage = {
    //       chat: `${user.name} left this chat`,
    //       user: { id: null, name: "system" },
    //     };
    //     socket.broadcast.to(id).emit("message", leaveMessage);
    //     io.to(socket.id).emit("rooms", await roomController.getAllRooms());
    //     socket.leave(id);
    //     callback({ ok: true });
    //   } catch (err) {
    //     callback({ ok: false, error: err.message });
    //   }
    // });

    //  /** a user created new room with other user BUT NO NEED TO EMIT. JUST ROUTES*/
    socket.on("createRoom", async (data, callback) => {
      const otheruid = data.otheruid;
      const user = await userController.checkUser(socket.id);
      const room = await roomController.createRoom(user, otheruid);
      console.log("CREATE ROOM ended:")

      if (room) {
        if (!room.added) {
          callback({ ok: false, error: "You already have the room" });
        } else {
          console.log("create room emit good");
          // io.to(other.token).emit("rooms", await roomController.getAllRoomsByUserId(other._id))
          socket.emit(
            "rooms",
            await roomController.getAllRoomsByUserId(user._id)
          );
          socket.emit("myuser", room.user);
          callback({ ok: true, error: "You already have the room" });
        }
      } else {
        callback({ ok: false, error: "??what error" });
      }
    });

    socket.on("disconnect", async () => {
      console.log(socket.id, " is disconnected!");
      try {
        const user = await userController.checkUser(socket.id);
        await userController.updateUser(user._id, { online: false });
        user.online = false;

        io.emit("online", user); //temp
      } catch (err) {
        console.log(err.message);
      }
    });
  });
}
