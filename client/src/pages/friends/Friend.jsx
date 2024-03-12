import { useNavigate } from "react-router-dom";
import "./Friend.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import RoomList from "../roomList/RoomList";
import FriendSuggestion from "../../components/FriendSuggestion/FriendSuggestion";
import FriendList from "../../components/FriendList/FriendList";
import { FaUserFriends } from "react-icons/fa";
import { GiSpeedBoat } from "react-icons/gi";
import { AiFillShop } from "react-icons/ai";
import Sidebar from "../../components/Sidebar/Sidebar";

const Friend = ({ user, setUser }) => {
  const [menuInfo, setMenuInfo] = useState({
    isOpen: false,
    mid: "",
    mPosition: { x: 0, y: 0 },
    mType: "",
  });

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
    <div className="fContainer">
      <Sidebar
        user={user}
        setUser={setUser}
        menuInfo={menuInfo}
        setMenuInfo={setMenuInfo}
      />
      <div className="fMain">
        <FriendList
          user={user}
          setUser={setUser}
          menuInfo={menuInfo}
          setMenuInfo={setMenuInfo}
        />
      </div>
    </div>
  );
};

export default Friend;
