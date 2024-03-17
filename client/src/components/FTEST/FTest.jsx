import { useNavigate } from "react-router-dom";
import "./FTest.css";
import { useState } from "react";

import socket from "../../server";
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

  const createRoom = (uid) => {
    // console.log(menuInfo.mid)
    const data = {
      otheruid: uid === null ? menuInfo.mid : uid,
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

  const DeleteFriend = (uid) => {
    console.log("delete friend");

    closeMenuInfo();

    socket.emit("deleteFriend", uid === null ? menuInfo.mid : uid, (res) => {
      console.log("delete Friend", res.ok);
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const AddFriend = (uid) => {
    console.log("add friend");
    // setMenu(false)
    closeMenuInfo();

    socket.emit("addFriend", uid === null ? menuInfo.mid : uid, (res) => {
      console.log("add Friend", res.ok);
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const AddPending = (uid) => {
    console.log("Add pending");
    closeMenuInfo();
    socket.emit("addPending", uid === null ? menuInfo.mid : uid, (res) => {
      console.log("add Pending", res.ok);
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const DeletePending = (uid) => {
    console.log("DeletePending");

    closeMenuInfo();

    socket.emit("deletePending", uid === null ? menuInfo.mid : uid, (res) => {
      console.log("se deletePending: ", res.ok.toString());
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const closeMenuInfo = () => {
    setMenuInfo((prev) => ({ ...prev, isOpen: false }));
  };

  const Block = (uid) => {
    console.log("Block");
    closeMenuInfo();
    socket.emit("block", uid === null ? menuInfo.mid : uid, (res) => {
      console.log("block", res.ok.toString());
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const Unblock = (uid) => {
    console.log("Unblock");
    closeMenuInfo();
    socket.emit("unblock", uid === null ? menuInfo.mid : uid, (res) => {
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
          PENDING - {friendList.length}
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
                    onClick={()=>createRoom(each._id)}
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
                      {type === "All" || type === "Online" ? (
                        <>
                          <div
                            className="flMore"
                            onClick={() => {
                              createRoom(each._id);
                            }}
                          >
                            <IoChatbubbleSharp />
                          </div>
                          <div className="flMore">
                            <HiOutlineDotsVertical />
                          </div>
                        </>
                      ) : type === "Suggestions" ? (
                        <>
                          <div
                            className="flMore"
                            onClick={() => AddPending(each._id)}
                          >
                            <FaCheck />
                          </div>
                          <div className="flMore">
                            <RxCross1 />
                          </div>
                        </>
                      ) : type === "Blocked" ? (
                        <>
                          <div
                            className="flMore"
                            onClick={() => Unblock(each._id)}
                          >
                            <FaPersonCirclePlus />
                          </div>
                        </>
                      ) : type === "Pending" ? (
                        <>
                          {!each.out && (
                            <div
                              className="flMore"
                              onClick={() => AddFriend(each._id)}
                            >
                              <FaCheck />
                            </div>
                          )}
                          <div className="flMore">
                            <RxCross1 onClick={() => DeletePending(each._id)} />
                          </div>
                        </>
                      ) : (
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
                <div
                  className="contextMenuOption"
                  onClick={() => DeleteFriend(null)}
                >
                  Delete Friend
                </div>
                <div
                  className="contextMenuOption"
                  onClick={() => createRoom(null)}
                >
                  Send Message
                </div>
                <div className="contextMenuOption" onClick={() => Block(null)}>
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
                <div
                  className="contextMenuOption"
                  onClick={() => Unblock(null)}
                >
                  Unblock
                </div>
                <div
                  className="contextMenuOption"
                  onClick={() => createRoom(null)}
                >
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
                <div
                  className="contextMenuOption"
                  onClick={() => AddPending(null)}
                >
                  Friend Request
                </div>
                <div
                  className="contextMenuOption"
                  onClick={() => createRoom(null)}
                >
                  Send Message
                </div>
                <div className="contextMenuOption" onClick={() => Block(null)}>
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
                  <div
                    className="contextMenuOption"
                    onClick={() => DeletePending(null)}
                  >
                    Cancel Request
                  </div>
                ) : (
                  <div
                    className="contextMenuOption"
                    onClick={() => AddFriend(null)}
                  >
                    Add Friend
                  </div>
                )}
                <div
                  className="contextMenuOption"
                  onClick={() => createRoom(null)}
                >
                  Send Message
                </div>
                <div className="contextMenuOption" onClick={() => Block(null)}>
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
