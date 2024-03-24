
import "./Friend.css";
import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import FriendManagement from "./FriendManagement/FriendManagement";

const Friend = ({ user, setUser }) => {
  const [menuInfo, setMenuInfo] = useState({
    isOpen: false,
    mid: "",
    mPosition: { x: 0, y: 0 },
    mType: "",
  });
  
  return (
    <div className="fContainer">
      <Sidebar
        user={user}
        setUser={setUser}
        menuInfo={menuInfo}
        setMenuInfo={setMenuInfo}
      />
      <div className="fMain">
      
        <FriendManagement user={user}
          setUser={setUser}
          menuInfo={menuInfo}
          setMenuInfo={setMenuInfo}/>
      </div>
    </div>
  );
};

export default Friend;
