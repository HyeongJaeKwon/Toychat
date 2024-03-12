import { useNavigate } from "react-router-dom";
import "./FriendList.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import RoomContainer from "../../components/RoomContainer/RoomContainer";

const FriendList = ({ user, setUser, menuInfo, setMenuInfo }) => {
  //   const { data, loading, error } = useFetch("/api/v1/users");
  //   const [userList, setUserList] = useState(null)
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    if (user !== null) {
      axios.get(`/api/v1/users/friends/${user._id}`).then((res) => {
        console.log("freindlist", res.data);
        setFriendList(res.data);
      });
    }

    socket.on("online", (res) => {
      console.log("FriendList refresh");
      setFriendList((prev) =>
        prev.filter((each) => {
          if (each._id === res._id) {
            each.online = res.online;
            each.token = res.token;
          }
          return true;
        })
      );
    });
  }, [user]);

  const createRoom = (uid) => {
    const data = {
      otheruid: uid,
    };

    // axios.post("/api/v1/rooms", data).then((res) => {
    //   if (!roomList.some((each) => each._id === res.data.room._id)) {
    //     setRoomList((prev) => [res.data.room, ...prev]);
    //   }
    //   setUser(res.data.user);
    // });
    socket.emit("createRoom", data, (res) => {
      if(!res.ok){
        console.log("CREATE ROOM FAILED: ", res.error)
      }

    });
    setMenuInfo((prev) => ({ ...prev, isOpen: false }));

    
  };

  const handleContextMenu = (event, uid) => {
    event.preventDefault();
    setMenuInfo({
      isOpen: true,
      mid: uid,
      mPosition: { x: event.clientX, y: event.clientY },
      mType: "FriendList",
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    // setMenu(false);
    setMenuInfo((prev) => ({ ...prev, isOpen: false }));
  };

  const DeleteFriend = () => {
    console.log("delete friend");

    setMenuInfo((prev) => ({ ...prev, isOpen: false }));

    socket.emit("deleteFriend", menuInfo.mid, (res) => {
      console.log("delete Friend", res.ok);
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  return (
    <div className="flSidebar">
      {friendList.length === 0
        ? "Add New Friend"
        : friendList.map((each) => {
            return (
              <div
                className="flSideItem"
                onContextMenu={(e) => handleContextMenu(e, each._id)}
                onClick={handleClick}
              >
                <div className="flUsername">{each.name}</div>
                <div className="flUserStatus">{each.online.toString()}</div>
              </div>
            );
          })}

      {menuInfo.isOpen && menuInfo.mType === "FriendList" && (
        <div
          className="contextMenu"
          style={{ top: menuInfo.mPosition.y, left: menuInfo.mPosition.x }}
        >
          <div className="contextMenuOption" onClick={DeleteFriend}>
            Delete Friend
          </div>
          <div
            className="contextMenuOption"
            onClick={() => createRoom(menuInfo.mid)}
          >
            Send Message
          </div>
          <div className="contextMenuOption" onClick={handleClick}>
            Close
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendList;
