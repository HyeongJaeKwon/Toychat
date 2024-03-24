import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { FaUserFriends } from "react-icons/fa";
import { GiSpeedBoat } from "react-icons/gi";
import { AiFillShop } from "react-icons/ai";
import RoomContainer from "../RoomContainer/RoomContainer";
import MyInfo from "../MyInfo/MyInfo";
import { ModalContext } from "../../context/ModalContext";

const Sidebar = ({ user, setUser, menuInfo, setMenuInfo }) => {
  const navigate = useNavigate();

  const {dispatch} = useContext(ModalContext)

  const handleClick = (e) => {
    e.preventDefault();
    // setMenu(false);
    setMenuInfo((prev) => ({ ...prev, isOpen: false }));
    dispatch({type:"CLOSE"})
  };

  const moveTo = (address) => {
    dispatch({type:"CLOSE"})
    navigate(`/${address}`);
  };

  const arr = [
    {
      title: "Friends",
      icon: <FaUserFriends className="tIcon" />,
      address: "",
    },
    {
      title: "Nitro",
      icon: <GiSpeedBoat className="tIcon" />,
      address: "nitro",
    },
    { title: "Shop", icon: <AiFillShop className="tIcon" />, address: "shop" },
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
              <div
                key={each.title}
                className="sbSideItem"
                onClick={() => {  dispatch({type:"CLOSE"});moveTo(each.address)}}
              >
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
        <RoomContainer
          user={user}
          setUser={setUser}
          menuInfo={menuInfo}
          setMenuInfo={setMenuInfo}
        />
      </div>
      <MyInfo user={user} />
    </div>
  );
};

export default Sidebar;
