import { useNavigate } from "react-router-dom";
import "./Test.css";
import { useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import RoomList from "../roomList/RoomList";
import FriendSuggestion from "../../components/FriendSuggestion/FriendSuggestion";

const Test = ({ user, setUser, roomList, setRoomList }) => {
  const navigate = useNavigate();
  
  return (
    <div className="tContainer">
      <FriendSuggestion/>
      <div className="tMain">
        <RoomList
          user={user}
          setUser={setUser}
          roomList={roomList}
          setRoomList={setRoomList}
        />
      </div>
    </div>
  );
};

export default Test;
