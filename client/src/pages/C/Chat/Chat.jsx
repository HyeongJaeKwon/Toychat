import { useEffect, useState } from "react";
import InputField from "../../../components/InputField/InputField.jsx";
import MessageContainer from "../../../components/MessageContainer/MessageContainer.js";
import socket from "../../../server.js";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/base/Button";
import axios from "axios";
import useFetch from "../../../hooks/useFetch.js";
import ChatProfile from "../../../components/ChatProfile/ChatProfile.jsx";

const Chat = ({ user, id }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const navigate = useNavigate();
  const [other, setOther] = useState(null);
  const [isHere, setIsHere] = useState(false);
  console.log("messageList:", messageList);

  useEffect(() => {
    setMessageList([]);
    setIsHere(false)

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
    socket.off("deleteMessage");
    socket.on("deleteMessage", (res) => {
      console.log("delete Message", res);
      setMessageList((prevMessageList) =>
        prevMessageList.filter((message) => message._id !== res.chatid)
      );
    });

    /** when new message comes */
    socket.off("message");
    socket.on("message", (res) => {
      if (res.user.name === "system" && res.user.id) {
        if (res.user.id === "join") {
          setIsHere(true)
        } else if (res.user.id === "leave") {
          setIsHere(false)
        }
      }
      if( res.user.name !== "system"){
        setMessageList((prevMessageList) => [...prevMessageList, res]);
      }
    });

    /** tell that I have joined to room id */
    if (user !== null) {
      socket.emit("joinRoom", id, (res) => {
        if (res && res.ok) {
          console.log("success join", res);
        } else {
          console.log("failed", res);
        }
      });
    }

    /** When leaving the page */
    return () => {
      console.log("Chat unmounted");
      socket.emit("leaveRoom", id, (res) => {
        if (res && res.ok) {
          console.log("success leave", res);
        } else {
          console.log("failed", res);
        }
      });
    };
  }, [user, id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log(message);
    socket.emit("sendMessage", message, id, (res) => {
      console.log("Res", res);
      if (!res.ok) {
        console.log("error message", res.error);
      }
    });
    setMessage("");
  };

  // const leaveRoom = async () => {
  //   socket.emit("leaveRoom", user, id, (res) => {
  //     if (res.ok) navigate("/");
  //   });
  // };

  return (
    <div>
      {user === null ? (
        "Loading"
      ) : (
        <div className="cContainer">
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
            isHere = {
              isHere
            }
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
