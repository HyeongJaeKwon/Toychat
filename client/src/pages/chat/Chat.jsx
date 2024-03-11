import { useEffect, useState } from "react";
import InputField from "../../components/InputField/InputField.jsx";
import MessageContainer from "../../components/MessageContainer/MessageContainer.js";
import socket from "../../server.js";
import "./Chat.css";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/base/Button";
import axios from "axios";
import useFetch from "../../hooks/useFetch.js";

const Chat = ({ user }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(messageList)

  //   const {data, loading, error } = useFetch(`/api/v1/chats/${id}`)
  //   console.log(data)

  useEffect(() => {
    /** load previous messages */
    axios.get(`/api/v1/chats/${id}`).then((res) => {
      setMessageList((prevMessageList) => [...res.data, ...prevMessageList]);
    });

    /** when message got deleted */
    socket.on("deleteMessage", (res) => {
      console.log(res)
      
      // setMessageList((prev) => prev.concat({chat:"dwqdwq", user:{id:null, name:"system"}}));
      setMessageList((prevMessageList) =>
      prevMessageList.filter((message) => message._id !== res.chatid)
    );
    });

    /** when new message comes */
    socket.on("message", (res) => {
      console.log("socket on", res);
      setMessageList((prev) => prev.concat(res));
    });

    /** tell that I have joined to room id */
    socket.emit("joinRoom", id, (res) => {
      if (res && res.ok) {
        console.log("success join", res);
      } else {
        console.log("failed", res);
      }
    });
  }, []);

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
  const back = async () => {
    navigate("/")
  }

  return (
    <div>
      <div className="cContainer">
        <nav>
          <Button onClick={back} className="backButton">
            X
          </Button>
          <div className="navUser">{user.name}</div>
        </nav>
        <MessageContainer
          messageList={messageList}
          setMessageList={setMessageList}
          rid={id}
          user={user}
        />
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
