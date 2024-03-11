import { useNavigate } from "react-router-dom";
import "./RoomContainer.css";
import { useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";

const RoomContainer = ({ user, setUser, roomList, setRoomList}) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [menuId, setMenuId] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const moveToChat = (rid) => {
    navigate(`/chat/${rid}`);
  };

  const handleContextMenu = (event, roomid) => {
    event.preventDefault();

    setMenu(true);
    setMenuId(roomid);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setMenu(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("delete this chat");
    const data = {
      user: user,
      roomid: menuId,
    };
    axios.delete("/api/v1/rooms", {data:data}).then((res) => {
      console.log("delete res:", res);
       setUser(res.data)
       setRoomList((prev)=> prev.filter((room)=>room._id !== menuId))

    });
    // socket.emit("deleteChat", rid, menuId, (res) => {
    //   if (!res.ok) alert(res.error);
    //   else {
    //     setMenu(false);
    //   }
    // });
  };

  const handleChangeName = (e) => {
 
  };


  return (
    <div onClick={handleClick} onContextMenu={(e) => e.preventDefault()}>
      {roomList.length > 0 ? (
        <>
          {roomList.map((room) => (
            <div
              className="rList"
              key={room._id}
              onClick={() => moveToChat(room._id)}
              value={room._id}
              onContextMenu={(e) => handleContextMenu(e, room._id.toString())}
            >
              <div className="rTitle">
                <img src={"/profile.jpeg"} />
                <p>{room.name}</p>
              </div>
              <div className="usersNumber">{room.users.length}</div>
            </div>
          ))}
        </>
      ) : (
        <div>No Chat</div>
      )}

      {menu && (
        <div
          className="contextMenu"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <div className="contextMenuOption" onClick={handleDelete}>
            Delete
          </div>
          <div className="contextMenuOption" onClick={handleChangeName}>Change Name</div>
          <div className="contextMenuOption" onClick={handleClick}>
            Close
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomContainer;
