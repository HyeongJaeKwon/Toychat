import { useContext, useEffect, useState } from "react";
import FriendList from "../../../components/FriendList/FriendList";
import FriendSuggestion from "../../../components/FriendSuggestion/FriendSuggestion";
import "./FriendManagement.css";
import { FaUserFriends } from "react-icons/fa";
import FTest from "../../../components/FTEST/FTest";
import socket from "../../../server";
import axios from "axios";
import AddFriend from "../../../components/AddFriend/AddFriend";
import { ListContext } from "../../../context/ListContext";

const FriendManagement = ({ user, setUser, menuInfo, setMenuInfo }) => {
  const arr = ["Online", "All", "Pending", "Suggestions", "Blocked"];
  const [userList, setUserList] = useState([]);
  const [section, setSection] = useState("Online");

  const { friendList, pendingList, blockedList } =
    useContext(ListContext);

  useEffect(() => {
    if (user !== null) {
      axios.get("/api/v1/users").then((userres) => {
        console.log("ax all users");
        setUserList(
          userres.data.filter((u) => {
            return (
              u._id.toString() !== user._id.toString() &&
              !friendList.some((each) => {
                return each._id.toString() === u._id.toString();
              }) &&
              !pendingList.some((each) => {
                return each._id.toString() === u._id.toString();
              }) &&
              !blockedList.some((each) => {
                return each._id.toString() === u._id.toString();
              })
            );
          })
        );
      });
    }
  }, [user, friendList, pendingList, blockedList]);

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
        <button
          className={
            section === "AddFriend" ? "fmAddFriendSelected" : "fmAddFriend"
          }
          onClick={() => {
            setSection("AddFriend");
            setMenuInfo((prev) => ({ ...prev, isOpen: false }));
          }}
        >
          Add Friend
        </button>
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
          <FTest
            menuInfo={menuInfo}
            setMenuInfo={setMenuInfo}
            friendList={userList}
            type={section}
          />
        ) : section === "Online" ? (
          <FTest
            menuInfo={menuInfo}
            setMenuInfo={setMenuInfo}
            friendList={friendList.filter((each) => {
              return each.online;
            })}
            type={section}
          />
        ) : section === "Blocked" ? (
          <FTest
            menuInfo={menuInfo}
            setMenuInfo={setMenuInfo}
            friendList={blockedList}
            type={section}
          />
        ) : section === "AddFriend" ? (
          <AddFriend />
        ) : (
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
