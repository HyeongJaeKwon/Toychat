import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import RoomList from "../../pages/roomList/RoomList";
import FriendSuggestion from "../FriendSuggestion/FriendSuggestion";
import { FaUserFriends } from "react-icons/fa";
import { GiSpeedBoat } from "react-icons/gi";
import { AiFillShop } from "react-icons/ai";
import RoomContainer from "../RoomContainer/RoomContainer";

const Sidebar = ({ user, setUser, menuInfo, setMenuInfo, }) => {
  const navigate = useNavigate();
  const [friendList, setFriendList] = useState([]);

  // useEffect(() => {
  //   if (user !== null) {
  //     axios.get(`/api/v1/users/friends/${user._id}`).then((res) => {
  //       console.log("freindlist", res.data);
  //       setFriendList(res.data);
  //     });
  //   }

  //   socket.on("online", (res) => {
  //     console.log("FriendList refresh");
  //     setFriendList((prev) =>
  //       prev.filter((each) => {
  //         if (each._id === res._id) {
  //           each.online = res.online;
  //           each.token = res.token;
  //         }
  //         return true;
  //       })
  //     );
  //   });
  // }, [user]);

  const handleClick = (e) => {
    e.preventDefault();
    // setMenu(false);
    setMenuInfo((prev) => ({ ...prev, isOpen: false }));
  };

  const moveTo = (address) => {
   
    navigate(`/${address}`)
  }

  const arr = [
    { title: "Friends", icon: <FaUserFriends className="tIcon"/>, address:"friends" },
    { title: "Nitro", icon: <GiSpeedBoat className="tIcon" /> , address:"nitro"},
    { title: "Shop", icon: <AiFillShop className="tIcon" /> , address:"shop"},
  ];

  return (
    <div
      className="tSidebar"
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="tSearch">Find or start a conversation</div>
      <div className="tLine" />
      <div className="tScrollPart">
        <div className="tAdditionalMenus">
          {arr.map((each) => {
            return (
              <div className="fsSideItem" onClick={()=>moveTo(each.address)}>
                {/* <FaUserFriends className="tIcon"/> */}
                {each.icon}
                {each.title}
              </div>
            );
          })}
        </div>
        <div className="tDM">
          <div>DIRECT MESSAGES</div>
          <div>+</div>
        </div>
        <FriendSuggestion menuInfo={menuInfo} setMenuInfo={setMenuInfo} />
        <RoomContainer
          user={user}
          setUser={setUser}
          menuInfo={menuInfo} setMenuInfo={setMenuInfo}/>
        {/* <FriendList menuInfo = {menuInfo}
       setMenuInfo = {setMenuInfo} friendList={friendList} /> */}
      </div>
    </div>
  );
};

export default Sidebar;
