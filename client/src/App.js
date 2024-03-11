import { useEffect, useState } from "react";
import socket from "./server.js";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Chat from "./pages/chat/Chat";
import RoomList from "./pages/roomList/RoomList.jsx";


function App() {

  const [user, setUser] = useState({})
  const [roomList, setRoomList] = useState([]);

  console.log("roomlist:", roomList)
  

  useEffect(()=>{

    socket.on("rooms", (res)=>{
      setRoomList(res)
    })
    askUserName();
  },[])

  const askUserName = () =>{
    const username = prompt("What's your username?")
    console.log("uuu", username)

    
    socket.emit("login", username, (res)=>{
      
      if (res.ok){
        setUser(res.data)
      }
    });
  }



  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<RoomList rooms = {roomList}/>}/>
      <Route path="/chat/:id" element={<Chat user={user}/>}/>
    </Routes>
  </BrowserRouter>

  );
}

export default App;
