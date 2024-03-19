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
        socket.join(rid);

        const welcomeMessage = {
          chat: `${whoJoined.name} has joing the chat`,
          user: { id: "join", name: "system" },
        };
        socket.broadcast.to(rid).emit("message", welcomeMessage); //Just other guy
        // io.in(rid).emit("message", welcomeMessage);  //Not everyone

        console.log("Right BEFORE IO");
        const sockets = await io.in(rid).fetchSockets();

        console.log(`Number of clients in room ${rid}: ${sockets.length}`);
        if (sockets.length > 1) {
          const welcomeMessage = {
            chat: `ALREADY in the chat`,
            user: { id: "join", name: "system" },
          };
          socket.emit("message", welcomeMessage);
        }

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
        //Let's just only tell Friends..............

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
        callback({ ok: false, error: err.message });
      }
    });

    socket.on("addFriend", async (otheruid, callback) => {
      try {
        const u = await userController.checkUser(socket.id);
        if (
          otheruid.toString() === u._id.toString() ||
          u.friends.some((each) => {
            return each.toString() === otheruid;
          })
        ) {
          callback({ ok: false, error: "you already friend" });
        } else {
          await userController.addFriend(u._id.toString(), otheruid);
          const { myuser, otheruser } = await userController.deletePending(
            u._id.toString(),
            otheruid
          );

          socket.emit("myuser", myuser);
          if (otheruser.online)
            io.to(otheruser.token).emit("myuser", otheruser);
          console.log("Add friend OK");
          callback({ ok: true });
        }
      } catch (err) {
        console.log("-!!!!!!!!!!!");
        callback({ ok: false, error: err.message });
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
        if (otheruser.online) io.to(otheruser.token).emit("myuser", otheruser);

        console.log("-");
        callback({ ok: true });
      } catch (err) {
        console.log("-!!!!!!!!!!!");
        callback({ ok: false, error: err.message });
      }
    });

    //  /** a user leave a room */
    socket.on("leaveRoom", async (id, callback) => {
      try {
        const user = await userController.checkUser(socket.id);
        // await roomController.leaveRoom(user, id);

        const leaveMessage = {
          chat: `${user.name} left this chat`,
          user: { id: "leave", name: "system" },
        };
        socket.broadcast.to(id).emit("message", leaveMessage); //???????????????????????
        socket.leave(id);
        // io.in(id).emit("leaveRoom") ????????????????????????????
        callback({ ok: true });
      } catch (err) {
        callback({ ok: false, error: err.message });
      }
    });

    //  /** a user created new room with other user BUT NO NEED TO EMIT. JUST ROUTES*/
    socket.on("createRoom", async (data, callback) => {
      try {
        const otheruid = data.otheruid;
        const user = await userController.checkUser(socket.id);
        const room = await roomController.createRoom(user, otheruid);
        console.log("CREATE ROOM ended:");

        if (room) {
          if (!room.added) {
            callback({
              ok: true,
              error: "You already have the room on the list",
              room: room.room,
            });
          } else {
            console.log("create room emit good");
            // io.to(other.token).emit("rooms", await roomController.getAllRoomsByUserId(other._id))
            socket.emit(
              "rooms",
              await roomController.getAllRoomsByUserId(user._id)
            );
            socket.emit("myuser", room.user);

            //It can be 1. you have roomDB, but not on the list
            //          2. No room DB at all
            if (room.exist) {
              callback({
                ok: true,
                error: "You already have the roomDB",
                room: room.room,
              });
            } else {
              callback({ ok: true, error: "ROOM CREATED!!!", room: room.room });
            }
          }
        } else {
          callback({ ok: false, error: "??what error" });
        }
      } catch (err) {
        callback({ ok: false, error: err.message });
      }
    });

    /** Add to pending List (= sending a friend request)*/
    socket.on("addPending", async (otheruid, callback) => {
      try {
        const u = await userController.checkUser(socket.id);
        if (
          otheruid.toString() === u._id.toString() ||
          u.friends.some((each) => {
            return each.toString() === otheruid;
          })
        ) {
          callback({ ok: false, error: "you already friend" });
        } else {
          const { myuser, otheruser } = await userController.addPending(
            u._id.toString(),
            otheruid
          );

          socket.emit("myuser", myuser);
          if (otheruser.online)
            io.to(otheruser.token).emit("myuser", otheruser);

          console.log("addPending OK");
          callback({ ok: true });
        }
      } catch (err) {
        console.log("-!!!!!!!!!!!");
        callback({ ok: false, error: err.message });
      }
    });

    /** Delete from pending List (= cancelling a friend request) */
    socket.on("deletePending", async (otheruid, callback) => {
      try {
        const u = await userController.checkUser(socket.id);

        console.log(u._id, otheruid);
        const { myuser, otheruser } = await userController.deletePending(
          u._id.toString(),
          otheruid
        );

        socket.emit("myuser", myuser);
        if (otheruser.online) io.to(otheruser.token).emit("myuser", otheruser);
        console.log("Delete Pending Success");
        callback({ ok: true });
      } catch (err) {
        console.log("Delete Pending Failed");
        callback({ ok: false, error: err.message });
      }
    });

    socket.on("block", async (otheruid, callback) => {
      try {
        const u = await userController.checkUser(socket.id);
        if (
          otheruid.toString() === u._id.toString() ||
          u.blocked.some((each) => {
            return each.toString() === otheruid.toString();
          })
        ) {
          callback({ ok: false, error: "you already block" });
        } else {
          const myuser = await userController.addBlocked(
            u._id.toString(),
            otheruid
          );
          socket.emit("myuser", myuser);
          console.log("Block OK");
          callback({ ok: true });
        }
      } catch (err) {
        console.log("Block Failed");
        callback({ ok: false, error: err.message });
      }
    });

    socket.on("unblock", async (otheruid, callback) => {
      try {
        const u = await userController.checkUser(socket.id);
        const myuser = await userController.deleteBlocked(
          u._id.toString(),
          otheruid
        );
        socket.emit("myuser", myuser);
        console.log("Unblock Success");
        callback({ ok: true });
      } catch (err) {
        console.log("Unblock Failed");
        callback({ ok: false, error: err.message });
      }
    });

    socket.on("sendRequestByName", async (othername, callback) => {
      try {
        const u = await userController.checkUser(socket.id);
        const { myuser, otheruser } = await userController.addPendingByName(
          u._id,
          othername
        );

        socket.emit("myuser", myuser);
        if (otheruser.online) io.to(otheruser.token).emit("myuser", otheruser);
        console.log("sendRequestByName OK");
        callback({ ok: true });
      } catch (err) {
        console.log(err.message)
        console.log("sendRequestByName Failed");
        callback({ ok: false, error: err.message });
      }
    });

    socket.on("camera", async ( data, callback) => {
      try{
        const {othername, status} = data;
        const other = await User.findOne({ name: othername });
        io.to(other.token).emit("camera", status)
        callback({ ok: true });
      }catch(err){
        callback({ok: false, error: err.message})
      }
    })

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
