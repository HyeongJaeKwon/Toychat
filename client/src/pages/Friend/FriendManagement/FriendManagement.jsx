import { useEffect, useState } from "react";
import FriendList from "../../../components/FriendList/FriendList";
import FriendSuggestion from "../../../components/FriendSuggestion/FriendSuggestion";
import "./FriendManagement.css";
import { FaUserFriends } from "react-icons/fa";
import FTest from "../../../components/FTEST/FTest";
import socket from "../../../server";
import axios from "axios";
import AddFriend from "../../../components/AddFriend/AddFriend";

const FriendManagement = ({ user, setUser, menuInfo, setMenuInfo }) => {
  const arr = ["Online", "All", "Pending", "Suggestions", "Blocked"];
  const [friendList, setFriendList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [blockedList, setBlockedList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [section, setSection] = useState("Online");

  useEffect(() => {
    if (user !== null) {
      axios.get(`/api/v1/users/friends/${user._id}`).then((res) => {
        // console.log("freindlist", res.data);
        setFriendList(res.data);

        axios.get(`/api/v1/users/pending/${user._id}`).then((pendingres) => {
          setPendingList(pendingres.data);
          // console.log("pending list: ", pendingres.data);

          axios.get(`/api/v1/users/blocked/${user._id}`).then((blockedres) => {
            setBlockedList(blockedres.data);

            axios.get("/api/v1/users").then((res2) => {
              setUserList(
                res2.data.filter((u) => {
                  return (
                    u._id.toString() !== user._id.toString() &&
                    !res.data.some((each) => {
                      return each._id.toString() === u._id.toString();
                    }) &&
                    !pendingres.data.some((each) => {
                      return each._id.toString() === u._id.toString();
                    }) &&
                    !blockedres.data.some((each) => {
                      return each._id.toString() === u._id.toString();
                    })
                  );
                })
              );
            });
          });
        });
      });
    }

    /** ONLY friendList gets updated for friends' login */
    /** Pending, Blocked, Suggestions will remain same  */
    socket.off("online");
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
                key={each}
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
        <button className={section === "AddFriend" ? "fmAddFriendSelected":"fmAddFriend"}  onClick={() => {
                  setSection("AddFriend");
                  setMenuInfo((prev) => ({ ...prev, isOpen: false }));
                }}>Add Friend</button>
      </div>

      <div className="fmHoriLine" />

      <div className="fmMain">
        {section === "All" ? (
          <FTest
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
            friendList={friendList.filter((each) => {
              return each.online;
            })}
            type={section}
          />
        ) : section === "Blocked" ? (
          // <FriendSuggestion menuInfo={menuInfo} setMenuInfo={setMenuInfo}  type={section}/>

          <FTest
            menuInfo={menuInfo}
            setMenuInfo={setMenuInfo}
            friendList={blockedList}
            type={section}
          />
        ) : 
        section === "AddFriend" ? (
          // <FriendSuggestion menuInfo={menuInfo} setMenuInfo={setMenuInfo}  type={section}/>

          <AddFriend
       
          />
        ) :(
          <FTest
            menuInfo={menuInfo}
            setMenuInfo={setMenuInfo}
            friendList={pendingList}
            type={section}
          />
        )}
      </div>
    </div>
  );
};

export default FriendManagement;
