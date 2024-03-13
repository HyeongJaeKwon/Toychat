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
  const [ other, setOther] = useState(null);
  console.log("messageList:", messageList);

  //   const {data, loading, error } = useFetch(`/api/v1/chats/${id}`)
  //   console.log(data)

  useEffect(() => {
    console.log("message reset")
    setMessageList([])

    /** load previous messages */
    axios.get(`/api/v1/chats/${id}`).then((res) => {
      setMessageList((prevMessageList) => [...res.data, ...prevMessageList]);
    });

    if( user !== null){
      axios.get(`/api/v1/rooms/roomid/${id}/${user._id}`).then((res)=>{
        // res.data => room + other
        setOther(res.data.other)
      })
    }

    /** when message got deleted */
    socket.on("deleteMessage", (res) => {
      console.log(res);

      // setMessageList((prev) => prev.concat({chat:"dwqdwq", user:{id:null, name:"system"}}));
      setMessageList((prevMessageList) =>
        prevMessageList.filter((message) => message._id !== res.chatid)
      );
    });

    
    /** when new message comes */
    socket.off("message")
    socket.on("message", (res) => {
      setMessageList((prevMessageList) =>[...prevMessageList, res]);
    });

    if(user !== null){
      /** tell that I have joined to room id */
    socket.emit("joinRoom", id, (res) => {
      if (res && res.ok) {
        console.log("success join", res);
      } else {
        console.log("failed", res);
      }
    });
    }
  }, [user,id]);

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
            other = {other}
          />
          <InputField
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
