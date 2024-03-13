import { useNavigate, useLocation } from "react-router-dom";
import "./RoomContainer.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";


const RoomContainer = ({ user, setUser, menuInfo, setMenuInfo }) => {
  const navigate = useNavigate();
  const [roomDataList, setRoomDataList] = useState([]);
 
  console.log("roomDatalist:", roomDataList);
  const location = useLocation();
  const roomid = location.pathname.split("/")[2];

  useEffect(() => {
    socket.on("rooms", (res) => {
      console.log("socket on rooms", res);
      setRoomDataList(res);
    });

    socket.on("online", (res) => {
      console.log("RoomDataList Adjust");
      setRoomDataList((prev) =>
        prev.filter((each) => {
          if (each.other._id === res._id) {
            each.other.online = res.online;
            each.other.token = res.token;
          }
          return true;
        })
      );
    });
  

    if (user !== null) {
      axios.get(`/api/v1/rooms/${user._id}`).then((res) => {
        if (res.data) {
          // res.data == [ {room: , other: },... ]
          console.log("axios got rooms");
          setRoomDataList(res.data);
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
    console.log("delete this room");
    const data = {
      user: user,
      roomid: menuInfo.mid,
    };
    axios.delete("/api/v1/rooms", { data: data }).then((res) => {
      console.log("delete room res:", res);
      setUser(res.data);
      setRoomDataList((prev) => prev.filter((room) => room.room._id !== menuInfo.mid));
    });
  };

  const handleChangeName = (e) => {};

  return (
    <div className="rcContainer">
      <div onClick={handleClick} onContextMenu={(e) => e.preventDefault()}>
        {roomDataList.length > 0 ? (
          <>
            {roomDataList.map((room, ind) => (
              <div
                className={room.room._id.toString() === roomid ? "rcSideItemSelected" : "rcSideItem"}
                key={room.room._id}
                onClick={() => moveToChat(room.room._id)}
                onContextMenu={(e) => handleContextMenu(e, room.room._id.toString())}
              >
                <div className="rcProfile"><div className="img"><img src={"/profile.jpeg"}></img><div className={room.other.online ? "rcStatusOn" : "rcStatusOff"}/></div></div>
                <div className="rcUsername">{room.other.name}</div>
                {/* <div className="usersNumber">{room.other.online.toString()}</div> */}
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
