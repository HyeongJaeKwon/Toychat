import { useNavigate } from "react-router-dom";
import "./FriendList.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import RoomContainer from "../../components/RoomContainer/RoomContainer";
import FriendSuggestion from "../FriendSuggestion/FriendSuggestion";

const FriendList = ({ menuInfo, setMenuInfo, friendList, type }) => {
  const navigate = useNavigate();

  const createRoom = () => {
    const data = {
      otheruid: menuInfo.mid,
    };

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
    <div className="flContainer">
      <div className="flSearch">Search</div>
      <div className="flOnline">ALL FRIENDS - {friendList.length}</div>
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

          {menuInfo.isOpen && menuInfo.mType === "FriendList" && (
            <div
              className="contextMenu"
              style={{ top: menuInfo.mPosition.y, left: menuInfo.mPosition.x }}
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
        </div>
      </div>
    </div>
  );
};

export default FriendList;
