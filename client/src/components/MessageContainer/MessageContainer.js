import React, { useState } from "react";
import "./MessageContainer.css";
import { Container } from "@mui/system";
import axios from "axios";
import socket from "../../server";

const MessageContainer = ({ messageList, setMessageList, rid, user }) => {
  const [menu, setMenu] = useState(false);
  const [menuId, setMenuId] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event, chatid) => {
    event.preventDefault();

    setMenu(true);
    setMenuId(chatid);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleClick = (e) => {
    e.preventDefault();
    setMenu(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("delete this chat");
    socket.emit("deleteChat", rid, menuId, (res) => {
      if (!res.ok) alert(res.error);
      else {
        setMenu(false);
      }
    });
  };

  return (
    <>
      <div
        className="message-container-wrapper"
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        {messageList.map((message, index) => {
          return (
            <div key={message._id} className="message-container">
              {message.user.name === "system" ? (
                <div className="system-message-container">
                  <p className="system-message">{message.chat}</p>
                </div>
              ) : message.user.name === user.name ? (
                index === 0 ||
                messageList[index - 1].user.name !== user.name ||
                messageList[index - 1].user.name === "system" ? (
                  <div className="bigMessage">
                    <img
                      src="/profile.jpeg"
                      className="profile-image"
                      style={{ visibility: "visible" }}
                    />
                    <div className="namechat">
                      <div className="nametime">
                        <div className="username">{message.user.name}</div>
                        <div className="timestamp">
                          {message.createdAt.toString()}
                        </div>
                      </div>
                      <div
                        className="message"
                        onContextMenu={(e) => handleContextMenu(e, message._id)}
                      >
                        {message.chat}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="my-message-container">
                    <img
                      src="/profile.jpeg"
                      className="profile-image"
                      style={
                        (index === 0
                          ? { visibility: "visible" }
                          : messageList[index - 1].user.name !== user.name) ||
                        messageList[index - 1].user.name === "system"
                          ? { visibility: "visible" }
                          : { visibility: "hidden" }
                      }
                    />
                    <div
                      className="my-message"
                      onContextMenu={(e) => handleContextMenu(e, message._id)}
                    >
                      {message.chat}
                    </div>
                  </div>
                )
              ) : (
                index === 0 ||
                messageList[index - 1].user.name == user.name ||
                messageList[index - 1].user.name === "system" ?
                <div className="bigMessage">
                <img
                  src="/profile.jpeg"
                  className="profile-image"
                  style={{ visibility: "visible" }}
                />
                <div className="namechat">
                  <div className="nametime">
                    <div className="username">{message.user.name}</div>
                    <div className="timestamp">
                      {message.createdAt.toString()}
                    </div>
                  </div>
                  <div
                    className="message"
                    onContextMenu={(e) => handleContextMenu(e, message._id)}
                  >
                    {message.chat}
                  </div>
                </div>
              </div>
             :   <div className="your-message-container">
                  <img
                    src="/profile.jpeg"
                    className="profile-image"
                    style={
                      (index === 0
                        ? { visibility: "visible" }
                        : messageList[index - 1].user.name === user.name) ||
                      messageList[index - 1].user.name === "system"
                        ? { visibility: "visible" }
                        : { visibility: "hidden" }
                    }
                  />
                  <div className="your-message">{message.chat}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {menu && (
        <div
          className="contextMenu"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <div className="contextMenuOption" onClick={handleDelete}>
            Delete
          </div>
          <div className="contextMenuOption">Reply</div>
        </div>
      )}
    </>
  );
};

export default MessageContainer;
