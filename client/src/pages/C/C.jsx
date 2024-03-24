import { useNavigate, useParams } from "react-router-dom";
import "./C.css";
import { useEffect, useState } from "react";
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
