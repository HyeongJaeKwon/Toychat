import React, { useState } from "react";
import "./AddFriend.css";
import socket from "../../server";
const AddFriend = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState("");
  const [green, setGreen] = useState(true);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const sendRequest = () => {
    socket.emit("sendRequestByName", searchQuery, (res) => {
      console.log("sendRequestByName", res.ok);
      if (!res.ok) {
        console.log("sendRequest Error: ", res.error)
        if (res.error === "you already friend") {
          setResult("You're already friend with that user!");
          alert("You're already friend with that user!");
          setGreen(false)
        } else if (res.error === "you already pending"){
          setResult("You've already sent the request!");
          alert("You've already sent the request!");
          setGreen(false)
        }
        
        else {
          setResult(
            `Hm, didn't work. Double check that the username is correct.`
          );
          alert("Friend request didn't work");
          setGreen(false)
        }
      } else {
        setResult(`Success! Your friend request to ${searchQuery} was sent`);
        setGreen(true)
      }
    });
  };

  return (
    <div className="afContainer">
      <div className="afMain">
        <div className="afAddFriend">ADD FRIEND</div>
        <div className="afYoucan">
          You can add freinds with their Discord username.
        </div>
        <div className="afSearch">
          <input
            type="text"
            placeholder="You can add freinds with their Discord username."
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button className="afButton" onClick={sendRequest}>
            Send Friend Request
          </button>
        </div>
        <div className={green ? "afResultSuccess" : "afResultFail"}>{result}</div>
      </div>
    </div>
  );
};

export default AddFriend;
