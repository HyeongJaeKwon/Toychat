import React, { useEffect } from "react";
import "./ChatProfile.css"

function ChatProfile({ myuser, other }) {
  return other === null ? (
    <div style={{color:"white"}}>Loading</div>
  ) : (
    <div className="cpContainer">
      <img
        src="/profile.jpeg"
        className="cpImage"
      />
      <div className="cpName">{other.name}</div>
      <div className="cpThis">This is the beginning of your direct message history with {other.name}</div>
      <div className="cpButtonRow">
      <div className="cpCommonServer">No server in common</div>
      <div className="cpDot"></div>
      <button className="cpAddFriend">Add Friend</button>
      <button className="cpBlock">Block</button>
      </div>
    </div>
  );
}

export default ChatProfile;
