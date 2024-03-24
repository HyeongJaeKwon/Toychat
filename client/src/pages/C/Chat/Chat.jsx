import { useContext, useEffect, useState } from "react";
import InputField from "../../../components/InputField/InputField.jsx";
import MessageContainer from "../../../components/MessageContainer/MessageContainer.js";
import socket from "../../../server.js";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/base/Button";
import axios from "axios";
import useFetch from "../../../hooks/useFetch.js";
import ChatProfile from "../../../components/ChatProfile/ChatProfile.jsx";
import Voice from "../../../components/Voice/Voice.jsx";
import VoiceClone from "../../../components/Voice/VoiceClone.jsx";
import { CallContext } from "../../../context/CallContext.jsx";
import { ModalContext } from "../../../context/ModalContext.jsx";

const Chat = ({ user, id }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const navigate = useNavigate();
  const [other, setOther] = useState(null);
  const [isHere, setIsHere] = useState(false);

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
    dispatch,
  } = useContext(CallContext);

  useEffect(() => {
    setMessageList([]);
    setIsHere(false);

    /** Load previous messages */
    axios.get(`/api/v1/chats/${id}`).then((res) => {
      setMessageList((prevMessageList) => [...res.data, ...prevMessageList]);
    });

    /** Load other profile */
    if (user !== null) {
      axios.get(`/api/v1/rooms/roomid/${id}/${user._id}`).then((res) => {
        // res.data => room + other
        setOther(res.data.other);
      });
    }

    /** when message got deleted */
    socket.on("deleteMessage", (res) => {
      // console.log("delete Message", res);
      setMessageList((prevMessageList) =>
        prevMessageList.filter((message) => message._id !== res.chatid)
      );
    });

    /** when new message comes */
    socket.on("message", (res) => {
      if (res.user.name === "system" && res.user.id) {
        if (res.user.id === "join") {
          setIsHere(true);
        } else if (res.user.id === "leave") {
          setIsHere(false);
        }
      }
      if (res.user.name !== "system") {
        setMessageList((prevMessageList) => [...prevMessageList, res]);
      }
    });

    /** tell that I have joined to room id */
    if (user !== null) {
      socket.emit("joinRoom", id, (res) => {
        if (res && res.ok) {
          // console.log("success join", res);
        } else {
          console.log("failed", res);
        }
      });
    }

    return () => {
      socket.off("deleteMessage");
      socket.off("message");
      socket.emit("leaveRoom", id, (res) => {
        if (!(res && res.ok)) {
          alert("Error happened when leaving the chat");
        }
      });
    };
  }, [user, id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    // console.log(message);
    socket.emit("sendMessage", message, id, (res) => {
      // console.log("Res", res);
      if (!res.ok) {
        console.log("error message", res.error);
      }
    });
    setMessage("");
  };

  const handleContextMenu = (e, othername) => {
    e.preventDefault();
    modalDispatch({
      type: "CLICK",
      payload: {
        mid: othername,
        x: e.clientX,
        y: e.clientY,
        mType: "ChatOtherInfo",
      },
    });
  };

  const handleCall = () => {
    dispatch({ type: "INIT" });
    if (isOpen) modalDispatch({ type: "CLOSE" });
  };

  return (
    <div>
      {user === null ? (
        "Loading"
      ) : (
        <div className="cContainer">
          {other && (
            <div
              className="cOtherInfo"
              style={joined ? { backgroundColor: "black" } : null}
              onContextMenu={(e) => handleContextMenu(e, other.name)}
            >
              <div className="cProfile">
                <div className="cImg">
                  <img src={"/profile.jpeg"}></img>
                  <div className={other.online ? "cStatusOn" : "cStatusOff"} />
                </div>
              </div>
              <div className="cUsername">{other.name}</div>
            </div>
          )}
          {joined && <VoiceClone myuser={user} />}
          <MessageContainer
            messageList={messageList}
            setMessageList={setMessageList}
            rid={id}
            user={user}
            other={other}
          />
          <InputField
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            isHere={isHere}
          />
          {isOpen && mType === "ChatOtherInfo" && (
            <div
              className="contextMenu"
              style={{
                top: mPosition.y,
                left: mPosition.x,
              }}
            >
              <div className="contextMenuOption" onClick={handleCall}>
                Call
              </div>

              <div
                className="contextMenuOption"
                onClick={() => {
                  if (isOpen) modalDispatch({ type: "CLOSE" });
                }}
              >
                Profile
              </div>
              <div
                className="contextMenuOption"
                onClick={() => {
                  if (isOpen) modalDispatch({ type: "CLOSE" });
                }}
              >
                Block
              </div>
              <div
                className="contextMenuOption"
                onClick={() => {
                  if (isOpen) modalDispatch({ type: "CLOSE" });
                }}
              >
                Close
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
