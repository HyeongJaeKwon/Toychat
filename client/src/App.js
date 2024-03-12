import { useEffect, useState } from "react";
import socket from "./server.js";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Chat from "./components/chat/Chat.jsx";
import RoomList from "./pages/roomList/RoomList.jsx";
import Test from "./pages/Test/Test.jsx";
import FriendList from "./components/FriendList/FriendList.jsx";
import Friend from "./pages/friends/Friend.jsx";
import C from "./pages/C/C.jsx";


function App() {

  const [user, setUser] = useState(null)
  console.log("user info:", user)

  useEffect(()=>{
    socket.on("myuser", (res)=>{
      console.log("Got myuser")
      setUser(res)
    })
    askUserName();
  },[])

  const askUserName = () =>{
    // const username = prompt("What's your username?")
   const username  = "a"; 

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
      <Route path="/" element={<Test user ={user} setUser = {setUser} />}/>
      <Route path="/chat/:cid" element={<C user={user} setUser = {setUser} />}/>
      <Route path="/friends" element={<Friend user={user} setUser = {setUser}/>}/>
      {/* <Route path="/test" element={<Test user ={user} setUser = {setUser} roomList = {roomList} setRoomList= {setRoomList}/>}/> */}
    </Routes>
  </BrowserRouter>

  );
}

export default App;
