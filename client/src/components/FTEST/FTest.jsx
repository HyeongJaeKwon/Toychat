import { useNavigate } from "react-router-dom";
import "./FTest.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import RoomContainer from "../../components/RoomContainer/RoomContainer";
import FriendSuggestion from "../FriendSuggestion/FriendSuggestion";

const FTest = ({ menuInfo, setMenuInfo, friendList, type }) => {
  //   const { data, loading, error } = useFetch("/api/v1/users");
  //   const [userList, setUserList] = useState(null)
  //   const [friendList, setFriendList] = useState([]);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     // if (user !== null) {
  //     //   axios.get(`/api/v1/users/friends/${user._id}`).then((res) => {
  //     //     console.log("freindlist", res.data);
  //     //     setFriendList(res.data);
  //     //   });
  //     // }

  //     // socket.on("online", (res) => {
  //     //   console.log("FriendList refresh");
  //     //   setFriendList((prev) =>
  //     //     prev.filter((each) => {
  //     //       if (each._id === res._id) {
  //     //         each.online = res.online;
  //     //         each.token = res.token;
  //     //       }
  //     //       return true;
  //     //     })
  //     //   );
  //     // });
  //   }, [user]);

  const createRoom = () => {
    const data = {
      otheruid: menuInfo.mid,
    };
    // console.log("menuInfo.mid:", menuInfo.mid === )

    // axios.post("/api/v1/rooms", data).then((res) => {
    //   if (!roomList.some((each) => each._id === res.data.room._id)) {
    //     setRoomList((prev) => [res.data.room, ...prev]);
    //   }
    //   setUser(res.data.user);
    // });

    socket.emit("createRoom", data, (res) => {
      if (!res.ok) {
        console.log("CREATE ROOM FAILED: ", res.error);
      } else {
        navigate(`/chat/${res.room._id.toString()}`);
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
      mType: type
        
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

  return (
    <div className="flContainer">
      <div className="flSearch">Search</div>
      {type === "All" ? (
        <div className="flOnline">ALL FRIENDS - {friendList.length}</div>
      ) : type === "Online" ? (
        <div className="flOnline">ONLINE FRIENDS - {friendList.length}</div>
      ) : type === "Suggestions" ? (
        <div className="flOnline">FRIEND SUGGESTIONS - {friendList.length}</div>
      ) : (
        <div className="flOnline">
          {type} - {friendList.length}
        </div>
      )}

      <div className="flLine"></div>
      <div className="flScroll">
        <div className="flFriend">
          {friendList.length === 0
            ? "Add New Friend"
            : friendList.map((each) => {
                return (
                  <div
                    className="flSideItem"
                    onContextMenu={(e) => handleContextMenu(e, each._id)}
                    onClick={handleClick}
                  >
                    <div className="flSideProfile">
                      <div className="flProfile">
                        <div className="img">
                          <img src={"/profile.jpeg"}></img>
                          <div
                            className={
                              each.online ? "flStatusOn" : "flStatusOff"
                            }
                          />
                        </div>
                      </div>
                      <div className="flNamestatus">
                        <div className="flUsername">{each.name}</div>
                        <div className="flStatus">
                          {each.online ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                    <div className="flFlag">
                      <div className="flMessage"></div>
                      <div className="flMore"></div>
                    </div>
                  </div>
                );
              })}

          {menuInfo.isOpen &&
            ((menuInfo.mType === "All" &&
            type == "All" ) || (menuInfo.mType === "Online" &&
            type == "Online" ))&& (
              <div
                className="contextMenu"
                style={{
                  top: menuInfo.mPosition.y,
                  left: menuInfo.mPosition.x,
                }}
              >
                <div className="contextMenuOption" onClick={DeleteFriend}>
                  Delete Friend
                </div>
                <div className="contextMenuOption" onClick={createRoom}>
                  Send Message
                </div>
                <div className="contextMenuOption" onClick={handleClick}>
                  Close
                </div>
              </div>
            )}

          {menuInfo.isOpen &&
            menuInfo.mType === "Suggestions" &&
            type === "Suggestions" && (
              <div
                className="contextMenu"
                style={{
                  top: menuInfo.mPosition.y,
                  left: menuInfo.mPosition.x,
                }}
              >
                <div className="contextMenuOption" onClick={AddFriend}>
                  Add Friend
                </div>
                <div className="contextMenuOption" onClick={createRoom}>
                  Send Message
                </div>
                <div className="contextMenuOption" onClick={handleClick}>
                  Close
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FTest;
