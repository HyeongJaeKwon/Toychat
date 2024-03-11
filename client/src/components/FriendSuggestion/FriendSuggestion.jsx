import { useNavigate } from "react-router-dom";
import "./FriendSuggestion.css";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import socket from "../../server";
import RoomContainer from "../../components/RoomContainer/RoomContainer";

const FriendSuggestion = () => {
  //   const { data, loading, error } = useFetch("/api/v1/users");
  const [userList, setUserList] = useState(null)

  useEffect(() => {
    socket.on("online", (res) => {
      setUserList((prev) =>
        prev.filter((each) => {
          if (each._id === res._id) {
            each.online = res.online;
          }
          return true;
        })
      );
    });

    axios.get("/api/v1/users").then((res) => {
      setUserList(res.data);
    });

  }, []);

  return (
    <div className="fSidebar">
      {userList === null
        ? "Loading"
        : userList.map((each) => {
            return (
              <div className="fSideItem">
                <div className="fUsername">{each.name}</div>
                <div className="fUserStatus">{each.online.toString()}</div>
              </div>
            );
          })}
    </div>
  );
};

export default FriendSuggestion;
