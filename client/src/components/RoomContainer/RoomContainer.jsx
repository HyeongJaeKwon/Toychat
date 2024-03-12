import { useNavigate } from "react-router-dom";
import "./RoomContainer.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";

const RoomContainer = ({ user, setUser, menuInfo, setMenuInfo }) => {
  const navigate = useNavigate();
  const [roomList, setRoomList] = useState([]);
  const index = 0;
  console.log("roomlist:", roomList);

  useEffect(() => {
    socket.on("rooms", (res) => {
      console.log("socket on rooms", res);
      setRoomList(res);
    });

    if (user !== null) {
      axios.get(`/api/v1/rooms/${user._id}`).then((res) => {
        if (res.data) {
          console.log("axios got rooms");
          setRoomList(res.data);
        }
      });
    }
  }, [user]);

  const moveToChat = (rid) => {
    navigate(`/chat/${rid}`);
  };

  const handleContextMenu = (event, roomid) => {
    event.preventDefault();
    setMenuInfo({
      isOpen: true,
      mid: roomid,
      mPosition: { x: event.clientX, y: event.clientY },
      mType: "RoomContainer",
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    // setMenu(false);
    setMenuInfo((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("delete this chat");
    const data = {
      user: user,
      roomid: menuInfo.mid,
    };
    axios.delete("/api/v1/rooms", { data: data }).then((res) => {
      console.log("delete res:", res);
      setUser(res.data);
      setRoomList((prev) => prev.filter((room) => room._id !== menuInfo.mid));
    });
  };

  const handleChangeName = (e) => {};

  return (
    <div className="rcContainer">
      <div onClick={handleClick} onContextMenu={(e) => e.preventDefault()}>
        {roomList.length > 0 ? (
          <>
            {roomList.map((room, ind) => (
              <div
                className={ind === index ? "rcSideItemSelected" : "rcSideItem"}
                key={room._id}
                onClick={() => moveToChat(room._id)}
                onContextMenu={(e) => handleContextMenu(e, room._id.toString())}
              >
                <img src={"/profile.jpeg"} />
                <div className="rcUsername">{room.name}</div>
                <div className="usersNumber">{room.users.length}</div>
              </div>
            ))}
          </>
        ) : (
          <div>No Chat</div>
        )}

        {menuInfo.isOpen && menuInfo.mType === "RoomContainer" && (
          <div
            className="contextMenu"
            style={{ top: menuInfo.mPosition.y, left: menuInfo.mPosition.x }}
          >
            <div className="contextMenuOption" onClick={handleDelete}>
              Delete
            </div>
            <div className="contextMenuOption" onClick={handleChangeName}>
              Change Name
            </div>
            <div className="contextMenuOption" onClick={handleClick}>
              Close
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomContainer;
