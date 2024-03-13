import { useNavigate } from "react-router-dom";
import "./Test.css";
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
import RoomContainer from "../../components/RoomContainer/RoomContainer";

const Test = ({ user, setUser }) => {
  const [menuInfo, setMenuInfo] = useState({
    isOpen: false,
    mid: "",
    mPosition: { x: 0, y: 0 },
    mType: "",
  });

  return (
    <div className="tContainer">
      <Sidebar
        user={user}
        setUser={setUser}
        menuInfo={menuInfo}
        setMenuInfo={setMenuInfo}
      />
      <div className="tMain">
        <RoomContainer
          user={user}
          setUser={setUser}
          menuInfo={menuInfo}
          setMenuInfo={setMenuInfo}
        />
      </div>
    </div>
  );
};

export default Test;
