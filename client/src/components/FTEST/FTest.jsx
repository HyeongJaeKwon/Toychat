import { useNavigate } from "react-router-dom";
import "./FTest.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import RoomContainer from "../../components/RoomContainer/RoomContainer";
import FriendSuggestion from "../FriendSuggestion/FriendSuggestion";
import { IoChatbubbleSharp } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { FaPersonCirclePlus } from "react-icons/fa6";

const FTest = ({ menuInfo, setMenuInfo, friendList, setFriendList, type }) => {
  const [out, setOut] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = friendList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createRoom = () => {
    // console.log(menuInfo.mid)
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
    closeMenuInfo();
  };

  const handleContextMenu = (event, uid, userInfo) => {
    event.preventDefault();
    if (type === "Pending") {
      setOut(userInfo.out);
      console.log("Pending out :", userInfo.out.toString());
    }
    setMenuInfo({
      isOpen: true,
      mid: uid,
      mPosition: { x: event.clientX, y: event.clientY },
      mType: type,
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    closeMenuInfo();
  };

  const DeleteFriend = () => {
    console.log("delete friend");

    closeMenuInfo();

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
    closeMenuInfo();

    socket.emit("addFriend", menuInfo.mid, (res) => {
      console.log("add Friend", res.ok);
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const AddPending = () => {
    console.log("Add pending");
    closeMenuInfo();
    socket.emit("addPending", menuInfo.mid, (res) => {
      console.log("add Pending", res.ok);
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const DeletePending = () => {
    console.log("delete pending");

    closeMenuInfo();

    socket.emit("deletePending", menuInfo.mid, (res) => {
      console.log("delete pending", res.ok.toString());
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const closeMenuInfo = () => {
    setMenuInfo((prev) => ({ ...prev, isOpen: false }));
  };

  const Block = () => {
    console.log("Block");
    closeMenuInfo();
    socket.emit("block", menuInfo.mid, (res) => {
      console.log("block", res.ok.toString());
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const Unblock = () => {
    console.log("Unblock");
    closeMenuInfo();
    socket.emit("unblock", menuInfo.mid, (res) => {
      console.log("unblock", res.ok.toString());
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flContainer">
      <div className="flSearch">
        {" "}
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>
      {type === "All" ? (
        <div className="flOnline">ALL FRIENDS - {friendList.length}</div>
      ) : type === "Online" ? (
        <div className="flOnline">ONLINE FRIENDS - {friendList.length}</div>
      ) : type === "Suggestions" ? (
        <div className="flOnline">FRIEND SUGGESTIONS - {friendList.length}</div>
      ) : type === "Blocked" ? (
        <div className="flOnline">BLOCKED - {friendList.length}</div>
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
            : searchQuery === ""
            ? friendList.map((each) => {
                return (
                  <div
                    className="flSideItem"
                    onContextMenu={(e) => handleContextMenu(e, each._id, each)}
                    onClick={handleClick}
                    key={each._id.toString()}
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
                          {type === "Pending"
                            ? each.out
                              ? "Outgoing Friend Request"
                              : "Incoming Friend Request"
                            : each.online
                            ? "Online"
                            : "Offline"}
                        </div>
                      </div>
                    </div>
                    <div className="flFlag">
                      {type === "All"  || type === "Online"? (
                        <>
                          <div className="flMore" onClick={()=>{
                              setMenuInfo((prev) => ({ ...prev, mid: each._id.toString() })).then(()=>{
                                createRoom()
                              })
                       
                          }}>
                            <IoChatbubbleSharp />
                          </div>
                          <div className="flMore">
                            <HiOutlineDotsVertical />
                          </div>
                        </>
                      ) : type === "Suggestions" ? (
                        <>
                   <div className="flMore">
                            <FaCheck />
                          </div>
                          <div className="flMore">
                            <RxCross1 />
                          </div>
                        </>
                      ) : type === "Blocked" ? (
                        <>
                    
                          <div className="flMore">
                            <FaPersonCirclePlus />
                          </div>
                        </>
                      ) : type === "Pending" ? (
                        <>
                             {!each.out &&(<div className="flMore">
                            <FaCheck />
                          </div>)}
                          <div className="flMore">
                            <RxCross1 />
                          </div>
                        </>
                      ) :(
                        <>
                          <div className="flMore">
                            <FaCheck />
                          </div>
                          <div className="flMore">
                            <RxCross1 />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            : filteredUsers.map((each) => {
                return (
                  <div
                    className="flSideItem"
                    onContextMenu={(e) => handleContextMenu(e, each._id, each)}
                    onClick={handleClick}
                    key={each._id.toString()}
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
                          {type === "Pending"
                            ? each.out
                              ? "Outgoing Friend Request"
                              : "Incoming Friend Request"
                            : each.online
                            ? "Online"
                            : "Offline"}
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
            ((menuInfo.mType === "All" && type == "All") ||
              (menuInfo.mType === "Online" && type == "Online")) && (
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
                <div className="contextMenuOption" onClick={Block}>
                  Block
                </div>
                <div className="contextMenuOption" onClick={handleClick}>
                  Close
                </div>
              </div>
            )}

          {menuInfo.isOpen &&
            menuInfo.mType === "Blocked" &&
            type === "Blocked" && (
              <div
                className="contextMenu"
                style={{
                  top: menuInfo.mPosition.y,
                  left: menuInfo.mPosition.x,
                }}
              >
                <div className="contextMenuOption" onClick={Unblock}>
                  Unblock
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
                <div className="contextMenuOption" onClick={AddPending}>
                  Friend Request
                </div>
                <div className="contextMenuOption" onClick={createRoom}>
                  Send Message
                </div>
                <div className="contextMenuOption" onClick={Block}>
                  Block
                </div>
                <div className="contextMenuOption" onClick={handleClick}>
                  Close
                </div>
              </div>
            )}

          {menuInfo.isOpen &&
            menuInfo.mType === "Pending" &&
            type === "Pending" && (
              <div
                className="contextMenu"
                style={{
                  top: menuInfo.mPosition.y,
                  left: menuInfo.mPosition.x,
                }}
              >
                {out ? (
                  <div className="contextMenuOption" onClick={DeletePending}>
                    Cancel Request
                  </div>
                ) : (
                  <div className="contextMenuOption" onClick={AddFriend}>
                    Add Friend
                  </div>
                )}
                <div className="contextMenuOption" onClick={createRoom}>
                  Send Message
                </div>
                <div className="contextMenuOption" onClick={Block}>
                  Block
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
