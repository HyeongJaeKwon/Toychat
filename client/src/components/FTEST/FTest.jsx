import { useNavigate } from "react-router-dom";
import "./FTest.css";
import { useContext, useState } from "react";

import socket from "../../server";
import { IoChatbubbleSharp } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { FaPersonCirclePlus } from "react-icons/fa6";
import { ModalContext } from "../../context/ModalContext";
import { CallContext } from "../../context/CallContext";

const FTest = ({ menuInfo, setMenuInfo, friendList, setFriendList, type }) => {
  const [out, setOut] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isOpen,
    mid,
    mPosition,
    mType,
    dispatch: modalDispatch,
  } = useContext(ModalContext);

  const filteredUsers = friendList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    joined,
    micMuted,
    camMuted,
    audioTrack,
    videoTrack,
    users,
    client,
    dispatch: callDispatch,
  } = useContext(CallContext);

  const createRoom = (e, uid) => {
    e.stopPropagation();
    const data = {
      otheruid: uid === null ? mid : uid,
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
    modalDispatch({
      type: "CLICK",
      payload: {
        mid: uid,
        x: event.clientX,
        y: event.clientY,
        mType: type,
      },
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    closeMenuInfo();
  };

  const DeleteFriend = (uid) => {
    closeMenuInfo();

    socket.emit("deleteFriend", uid === null ? mid : uid, (res) => {
      console.log("delete Friend", res.ok);
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const AddFriend = (e, uid) => {
    e.stopPropagation();
    closeMenuInfo();

    socket.emit("addFriend", uid === null ? mid : uid, (res) => {
      console.log("add Friend", res.ok);
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const AddPending = (e, uid) => {
    e.stopPropagation();
    closeMenuInfo();
    socket.emit("addPending", uid === null ? mid : uid, (res) => {
      console.log("add Pending", res.ok);
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const DeletePending = (e, uid) => {
    e.stopPropagation();
    closeMenuInfo();

    socket.emit("deletePending", uid === null ? mid : uid, (res) => {
      console.log("se deletePending: ", res.ok.toString());
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const closeMenuInfo = () => {
    if (isOpen) modalDispatch({ type: "CLOSE" });
  };

  const Block = (uid) => {
    closeMenuInfo();
    socket.emit("block", uid === null ? mid : uid, (res) => {
      console.log("block", res.ok.toString());
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const Unblock = (e, uid) => {
    e.stopPropagation();
    closeMenuInfo();
    socket.emit("unblock", uid === null ? mid : uid, (res) => {
      console.log("unblock", res.ok.toString());
      if (!res.ok) {
        console.log(res.error);
      }
    });
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const call = (e) => {
 
    socket.emit("createRoom", {otheruid: mid}, (res) => {
      if (!res.ok) {
        console.log("CREATE ROOM FAILED: ", res.error);
      } else {
        callDispatch({ type: "INIT" });
        navigate(`/chat/${res.room._id.toString()}`);
      }
    });
    closeMenuInfo();
  }

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
        <div className="flOnline">PENDING - {friendList.length}</div>
      )}

      <div className="flLine" />
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
                    onClick={(e) => createRoom(e, each._id)}
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
                            onClick={(e) => {
                              createRoom(e, each._id);
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
                            onClick={(e) => AddPending(e, each._id)}
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
                            onClick={(e) => Unblock(e, each._id)}
                          >
                            <FaPersonCirclePlus />
                          </div>
                        </>
                      ) : type === "Pending" ? (
                        <>
                          {!each.out && (
                            <div
                              className="flMore"
                              onClick={(e) => AddFriend(e, each._id)}
                            >
                              <FaCheck />
                            </div>
                          )}
                          <div className="flMore">
                            <RxCross1
                              onClick={(e) => DeletePending(e, each._id)}
                            />
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

          {isOpen &&
            ((mType === "All" && type == "All") ||
              (mType === "Online" && type == "Online")) && (
              <div
                className="contextMenu"
                style={{
                  top: mPosition.y,
                  left: mPosition.x,
                }}
              >
                <div
                  className="contextMenuOption"
                  onClick={(e) => DeleteFriend(e, null)}
                >
                  Delete Friend
                </div>
                <div
                  className="contextMenuOption"
                  onClick={(e) => createRoom(e, null)}
                >
                  Send Message
                </div>
                <div className="contextMenuOption" onClick={(e) => call(e)}>
                  Call
                </div>
                <div className="contextMenuOption" onClick={() => Block(null)}>
                  Block
                </div>
                <div className="contextMenuOption" onClick={handleClick}>
                  Close
                </div>
              </div>
            )}

          {isOpen && mType === "Blocked" && type === "Blocked" && (
            <div
              className="contextMenu"
              style={{
                top: mPosition.y,
                left: mPosition.x,
              }}
            >
              <div
                className="contextMenuOption"
                onClick={(e) => Unblock(e, null)}
              >
                Unblock
              </div>
              <div
                className="contextMenuOption"
                onClick={(e) => createRoom(e, null)}
              >
                Send Message
              </div>
              <div className="contextMenuOption" onClick={handleClick}>
                Close
              </div>
            </div>
          )}

          {isOpen && mType === "Suggestions" && type === "Suggestions" && (
            <div
              className="contextMenu"
              style={{
                top: mPosition.y,
                left: mPosition.x,
              }}
            >
              <div
                className="contextMenuOption"
                onClick={(e) => AddPending(e, null)}
              >
                Friend Request
              </div>
              <div
                className="contextMenuOption"
                onClick={(e) => createRoom(e, null)}
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

          {isOpen && mType === "Pending" && type === "Pending" && (
            <div
              className="contextMenu"
              style={{
                top: mPosition.y,
                left: mPosition.x,
              }}
            >
              {out ? (
                <div
                  className="contextMenuOption"
                  onClick={(e) => DeletePending(e, null)}
                >
                  Cancel Request
                </div>
              ) : (
                <div
                  className="contextMenuOption"
                  onClick={(e) => AddFriend(e, null)}
                >
                  Add Friend
                </div>
              )}
              <div
                className="contextMenuOption"
                onClick={(e) => createRoom(e, null)}
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
