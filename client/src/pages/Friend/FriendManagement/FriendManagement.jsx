import { useEffect, useState } from "react";
import FriendList from "../../../components/FriendList/FriendList";
import FriendSuggestion from "../../../components/FriendSuggestion/FriendSuggestion";
import "./FriendManagement.css";
import { FaUserFriends } from "react-icons/fa";
import FTest from "../../../components/FTEST/FTest";
import socket from "../../../server";
import axios from "axios";

const FriendManagement = ({ user, setUser, menuInfo, setMenuInfo }) => {
  const arr = ["Online", "All", "Pending", "Suggestions", "Blocked"];
  const [friendList, setFriendList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [section, setSection] = useState("Online");

  useEffect(() => {
    if (user !== null) {
      axios.get(`/api/v1/users/friends/${user._id}`).then((res) => {
        console.log("freindlist", res.data);
        setFriendList(res.data);
      });
    }

    if (user !== null) {
      axios.get("/api/v1/users").then((res) => {
        setUserList(res.data);
      });
    }

    socket.on("online", (res) => {
      console.log("FriendList refresh");
      setFriendList((prev) =>
        prev.filter((each) => {
          if (each._id === res._id) {
            each.online = res.online;
            each.token = res.token;
          }
          return true;
        })
      );
    });
  }, [user]);

  return (
    <div className="fmContainer">
      <div className="fmTopbar">
        <FaUserFriends className="fmIcon" />
        <div className="fmFriends">Friends</div>
        <div className="fmLine" />
        <div className="fmSlide">
          {arr.map((each) => {
            return (
              <div
                className={
                  section === each ? "fmSlideItemSelected" : "fmSlideItem"
                }
                onClick={() => {
                  setSection(each);
                  setMenuInfo((prev) => ({ ...prev, isOpen: false }));
                }}
              >
                {each}
              </div>
            );
          })}
        </div>
        <button className="fmAddFriend">Add Friend</button>
      </div>

      <div className="fmHoriLine" />

      <div className="fmMain">
        {section === "All" ? (
          <FriendList
            menuInfo={menuInfo}
            setMenuInfo={setMenuInfo}
            friendList={friendList}
            type={section}
          />
        ) : section === "Suggestions" ? (
          // <FriendSuggestion menuInfo={menuInfo} setMenuInfo={setMenuInfo}  type={section}/>

          <FTest
            menuInfo={menuInfo}
            setMenuInfo={setMenuInfo}
            friendList={userList}
            type={section}
          />
        ) : section === "Online" ? (
          // <FriendSuggestion menuInfo={menuInfo} setMenuInfo={setMenuInfo}  type={section}/>

          <FTest
            menuInfo={menuInfo}
            setMenuInfo={setMenuInfo}
            friendList={friendList.filter((each)=>{
             
              return each.online
            })}
            type={section}
          />
        ) : (
          <FTest
            menuInfo={menuInfo}
            setMenuInfo={setMenuInfo}
            friendList={friendList}
            type={section}
          />
        )}
      </div>
    </div>
  );
};

export default FriendManagement;
