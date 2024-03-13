import { useNavigate, useParams } from "react-router-dom";
import "./C.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import FriendSuggestion from "../../components/FriendSuggestion/FriendSuggestion";
import FriendList from "../../components/FriendList/FriendList";
import { FaUserFriends } from "react-icons/fa";
import { GiSpeedBoat } from "react-icons/gi";
import { AiFillShop } from "react-icons/ai";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "./Chat/Chat.jsx"

const C = ({ user, setUser }) => {
  const [menuInfo, setMenuInfo] = useState({
    isOpen: false,
    mid: "",
    mPosition: { x: 0, y: 0 },
    mType: "",
  });
  const { cid } = useParams();


  // const createRoom = (other) => {
  //   const data = {
  //     user: user,
  //     other: other,
  //   };

  //   axios.post("/api/v1/rooms", data).then((res)=>{
  //       if(!roomList.some((each)=>each._id === res.data.room._id)){
  //           setRoomList(prev =>[res.data.room, ...prev])
  //       }
  //       setUser(res.data.user)
  //   })
  //   // socket.emit("createRoom", data, (res) => {});
  // };

  return (
    <div className="chatContainer">
      <Sidebar
        user={user}
        setUser={setUser}
        menuInfo={menuInfo}
        setMenuInfo={setMenuInfo}
      />
      <div className="chatMain">
        <Chat user={user} id={cid} />
      </div>
    </div>
  );
};

export default C;
