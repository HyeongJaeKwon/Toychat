import { useNavigate, useLocation } from "react-router-dom";
import "./RoomContainer.css";
import { useContext } from "react";
import axios from "axios";
import { ListContext } from "../../context/ListContext";
import { ModalContext } from "../../context/ModalContext";
import { CallContext } from "../../context/CallContext";

const RoomContainer = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { chatRoomList, dispatch } = useContext(ListContext);
  const location = useLocation();
  const roomid = location.pathname.split("/")[2];
  const {
    isOpen,
    mid,
    mPosition,
    mType,
    dispatch: modalDispatch,
  } = useContext(ModalContext);

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

  const moveToChat = (rid) => {
    if (isOpen) modalDispatch({ type: "CLOSE" });
    navigate(`/chat/${rid}`);
  };



  const handleContextMenu = (event, roomid) => {
    event.preventDefault();
    modalDispatch({
      type: "CLICK",
      payload: {
        mid: roomid,
        x: event.clientX,
        y: event.clientY,
        mType: "RoomContainer",
      },
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (isOpen) modalDispatch({ type: "CLOSE" });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("handleDelete");
    const data = {
      user: user,
      roomid: mid,
    };
    axios.delete("/api/v1/rooms", { data: data }).then((res) => {
      console.log("delete room res:", res);
      if (res.data) {
        setUser(res.data);
        dispatch({ type: "DELETE_ROOM", payload: mid });
      } else {
        alert("Error happened during deletion. Please refresh the page");
      }
    });
  };

  const handleChangeName = (e) => {};

  const handleCall = () => {
    callDispatch({ type: "INIT" });
    if (isOpen) modalDispatch({ type: "CLOSE" });
    navigate(`/chat/${mid}`);
  };

  return (
    <div className="rcContainer">
      <div onClick={handleClick} onContextMenu={(e) => e.preventDefault()}>
        {chatRoomList.length > 0 ? (
          <>
            {chatRoomList.map((room, ind) => (
              <div
                className={
                  room.room._id.toString() === roomid
                    ? "rcSideItemSelected"
                    : "rcSideItem"
                }
                key={room.room._id}
                onClick={() => moveToChat(room.room._id)}
                onContextMenu={(e) =>
                  handleContextMenu(e, room.room._id.toString())
                }
              >
                <div className="rcProfile">
                  <div className="img">
                    <img src={"/profile.jpeg"}></img>
                    <div
                      className={
                        room.other.online ? "rcStatusOn" : "rcStatusOff"
                      }
                    />
                  </div>
                </div>
                <div className="rcUsername">{room.other.name}</div>
                {/* <div className="usersNumber">{room.other.online.toString()}</div> */}
              </div>
            ))}
          </>
        ) : (
          <div>No Chat</div>
        )}

        {isOpen && mType === "RoomContainer" && (
          <div
            className="contextMenu"
            style={{ top: mPosition.y, left: mPosition.x }}
          >
            <div className="contextMenuOption" onClick={handleCall}>
              Call
            </div>
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
