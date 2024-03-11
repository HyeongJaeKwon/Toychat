import { useEffect, useState } from "react";
import socket from "./server.js";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Chat from "./pages/chat/Chat";
import RoomList from "./pages/roomList/RoomList.jsx";
import Test from "./pages/Test/Test.jsx";


function App() {

  const [user, setUser] = useState({})
  const [roomList, setRoomList] = useState([]);

  console.log("roomlist:", roomList)
  console.log("user info:", user)

  useEffect(()=>{

    socket.on("rooms", (res)=>{
      console.log("GOt ROOMS")
      setRoomList(res)
    })

    askUserName();

  },[])

  const askUserName = () =>{
    const username = prompt("What's your username?")

    socket.emit("login", username, (res)=>{
      
      if (res.ok){
        setUser(res.data)
      }else{
        alert("Something Went Wrong. Try Refresh")
      }

    });

  }



  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<RoomList user ={user} setUser = {setUser} roomList = {roomList} setRoomList= {setRoomList}/>}/>
      <Route path="/chat/:id" element={<Chat user={user}/>}/>
      <Route path="/test" element={<Test user ={user} setUser = {setUser} roomList = {roomList} setRoomList= {setRoomList}/>}/>
    </Routes>
  </BrowserRouter>

  );
}

export default App;
