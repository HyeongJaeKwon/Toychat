import { useEffect, useState, useContext } from "react";
import socket from "./server.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Test from "./pages/Test/Test.jsx";

import Friend from "./pages/Friend/Friend.jsx";
import C from "./pages/C/C.jsx";
import Voice from "./components/Voice/Voice.jsx";
import { ListContext } from "./context/ListContext.jsx";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const { chatRoomList, dispatch } = useContext(ListContext);

  useEffect(() => {
    socket.on("myuser", (res) => {
      console.log("so myuser: ", res.name);
      setUser(res);

      setListContextByUid(res._id);
    });

    askUserName();

    socket.on("rooms", (res) => {
      console.log("so rooms: ", res.length);
      dispatch({ type: "INIT_LIST", payload: res });
    });

    socket.on("online", (res) => {
      console.log("so online: ", res.name);
      dispatch({ type: "ONLINE", payload: res });
    });

    return () => {
      socket.off("rooms");
      socket.off("online");
      socket.off("myuser");
    };
  }, []);

  const askUserName = () => {
    const username = prompt("What's your username?");
    //  const username  = "a";
    console.log("se login");
    socket.emit("login", username, (res) => {
      if (res.ok) {
        setUser(res.data);
        setListContextByUid(res.data._id);
      } else {
        alert("Something Went Wrong. Try Refresh");
      }
    });
  };

  const setListContextByUid = (uid) => {
    try {
      axios.get(`/api/v1/rooms/${uid}`).then((listres) => {
        if (listres.data) {
          // this is actualy room data list => [ { room: , other: ,}, ... ]
          console.log("ax rooms", listres.data.length);
          dispatch({ type: "INIT_LIST", payload: listres.data });
        } else {
          alert("Error while getting chat room list");
        }
      });
      axios.get(`/api/v1/users/friends/${uid}`).then((friendres) => {
        if (friendres.data) {
          dispatch({ type: "INIT_FRIENDS", payload: friendres.data });
        } else {
          alert("Error while getting friends list");
        }
      });

      axios.get(`/api/v1/users/pending/${uid}`).then((pendingres) => {
        if (pendingres.data) {
          dispatch({ type: "INIT_PENDING", payload: pendingres.data });
        } else {
          alert("Error while getting pending list");
        }
      });

      axios.get(`/api/v1/users/blocked/${uid}`).then((blockedres) => {
        if (blockedres.data) {
          dispatch({ type: "INIT_BLOCKED", payload: blockedres.data });
        } else {
          alert("Error while getting blocked list");
        }
      });
    } catch (err) {
      console.log(err);
      alert("Initial Loading Error: ", err.message);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/chat/:cid"
          element={<C user={user} setUser={setUser} />}
        />
        <Route path="/" element={<Friend user={user} setUser={setUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
