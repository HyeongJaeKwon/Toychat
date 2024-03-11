import { useNavigate } from "react-router-dom";
import "./RoomList.css";
import { useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import RoomContainer from "../../components/RoomContainer/RoomContainer";

const RoomList = ({ user, setUser, roomList , setRoomList}) => {
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const { data, loading, error } = useFetch(`/api/v1/users`);
  console.log("data", data);
  console.log("rooms", roomList);


  const openModal = () => {
    setModal(!modal);
  };

  const createRoom = (other) => {
    const data = {
      user: user,
      other: other,
    };

    axios.post("/api/v1/rooms", data).then((res)=>{
        if(!roomList.some((each)=>each._id === res.data.room._id)){
            setRoomList(prev =>[res.data.room, ...prev])
        }
        setUser(res.data.user)
    })
    // socket.emit("createRoom", data, (res) => {});
  };

  return (
    <div className="rContainer">
      <div className="rNav">
        Chats ...<button onClick={openModal}>+</button>
        {modal ? (
          <ul className="menu">
            {loading
              ? "loading"
              : data.map((each) => {
                  return each._id !== user._id ? (
                    <li className="menu-item" key = {each._id}>
                      <button onClick={() => createRoom(each)}>
                        {each.name}
                      </button>
                    </li>
                  ) : (
                    <></>
                  );
                })}
          </ul>
        ) : null}
      </div>

      <RoomContainer user ={user} setUser={setUser} roomList={roomList} setRoomList = {setRoomList}/>
    </div>
  );
};

export default RoomList;
