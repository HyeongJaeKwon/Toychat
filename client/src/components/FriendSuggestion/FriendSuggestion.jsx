import { useNavigate } from "react-router-dom";
import "./FriendSuggestion.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import RoomContainer from "../../components/RoomContainer/RoomContainer";

const FriendSuggestion = ({ menuInfo, setMenuInfo, type }) => {
  //   const { data, loading, error } = useFetch("/api/v1/users");
  const [userList, setUserList] = useState([]);
  const index = 0;
  const navigate = useNavigate();

  useEffect(() => {
    // socket.on("online", (res) => {
    //   setUserList((prev) =>
    //     prev.filter((each) => {
    //       if (each._id === res._id) {
    //         each.online = res.online;
    //         each.token = res.token;
    //       }
    //       return true;
    //     })
    //   );
    // });
    /// ALL USER LIST WON"T GET UPDATED THROUGH SOCKET ANYMORE........

    axios.get("/api/v1/users").then((res) => {
      setUserList(res.data);
    });
  }, []);

  const handleContextMenu = (event, uid) => {
    event.preventDefault();
    setMenuInfo({
      isOpen: true,
      mid: uid,
      mPosition: { x: event.clientX, y: event.clientY },
      mType: "FriendSuggestion",
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    // setMenu(false);
    console.log("FSuggestion click Trigg");
    setMenuInfo((prev) => ({ ...prev, isOpen: false }));
  };

  const AddFriend = () => {
    console.log("add friend");
    // setMenu(false)
    setMenuInfo((prev) => ({ ...prev, isOpen: false }));

    socket.emit("addFriend", menuInfo.mid, (res) => {
      console.log("add Friend", res.ok);
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const openChat = () => {
    console.log("open chat")
    setMenuInfo((prev) => ({ ...prev, isOpen: false }));
    const data = {
      otheruid: menuInfo.mid,
    };
    socket.emit("createRoom", data, (res) => {
      if(!res.ok){
        console.log("CREATE ROOM FAILED: ", res.error)
      }else{
        navigate(`/chat/${res.room._id.toString()}`)
      }
      

    });
    
  }



  return (
    <div className="fsSidebar">
      {userList.length === 0
        ? "Loading"
        : userList.map((each, ind) => {
            return (
              <div
                className={ind === index ? "fsSideItemSelected" : "fsSideItem"}
                onContextMenu={(e) => handleContextMenu(e, each._id)}
                onClick={handleClick}
              >
                <img src={"/profile.jpeg"} />
                <div className="fsUsername">{each.name}</div>
                <div className="fsUserStatus">{each.online.toString()}</div>
              </div>
            );
          })}

      {menuInfo.isOpen && menuInfo.mType === "FriendSuggestion" &&  (
        <div
          className="contextMenu"
          style={{ top: menuInfo.mPosition.y, left: menuInfo.mPosition.x }}
        >
          <div className="contextMenuOption" onClick={AddFriend}>
            Add Friend
          </div>
          <div className="contextMenuOption" onClick={openChat}>
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

export default FriendSuggestion;
