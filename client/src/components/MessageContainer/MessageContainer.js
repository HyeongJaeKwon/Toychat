import React, { useState } from "react";
import "./MessageContainer.css";
import { Container } from "@mui/system";
import axios from "axios";
import socket from "../../server";

const MessageContainer = ({ messageList, setMessageList, rid, user }) => {
  const [menu, setMenu] = useState(false);
  const [menuId, setMenuId] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  console.log(menuId);

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
            <Container key={message._id} className="message-container">
              {message.user.name === "system" ? (
                <div className="system-message-container">
                  <p className="system-message">{message.chat}</p>
                </div>
              ) : message.user.name === user.name ? (
                <div className="my-message-container">
                  <div
                    className="my-message"
                    onContextMenu={(e) => handleContextMenu(e, message._id)}
                  >
                    {message.chat}
                  </div>
                </div>
              ) : (
                <div className="your-message-container">
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
            </Container>
          );
        })}
      </div>
      {menu && (
        <div
          className="contextMenu"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <div className="contextMenuOption" onClick={handleDelete}>
            Option 1
          </div>
          <div className="contextMenuOption">Option 2</div>
        </div>
      )}
    </>
  );
};

export default MessageContainer;
