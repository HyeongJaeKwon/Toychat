import React, { useContext, useEffect, useRef, useState } from "react";
import "./MessageContainer.css";
import { Container } from "@mui/system";
import axios from "axios";
import socket from "../../server";
import ChatProfile from "../ChatProfile/ChatProfile";
import Voice from "../Voice/Voice";
import { ModalContext } from "../../context/ModalContext";

const MessageContainer = ({
  messageList,
  setMessageList,
  rid,
  user,
  other,
  setJoined,
}) => {
  const [style, setStyle] = useState("");
  const messagesEndRef = useRef(null);

  const {
    isOpen,
    mid,
    mPosition,
    mType,
    dispatch: modalDispatch,
  } = useContext(ModalContext);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  // console.log(style);

  const handleContextMenu = (event, chatid) => {
    event.preventDefault();
    modalDispatch({
      type: "CLICK",
      payload: {
        mid: chatid,
        x: event.clientX,
        y: event.clientY,
        mType: "Chat",
      },
    });

    // setMenu(true);
    // setMenuId(chatid);
    // setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (isOpen) modalDispatch({ type: "CLOSE" });
    // setMenu(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    // console.log("delete this chat");
    socket.emit("deleteChat", rid, mid, (res) => {
      if (!res.ok) alert(res.error);
      else {
        if (isOpen) modalDispatch({ type: "CLOSE" });
      }
    });
  };

  /**TEMP TEMP TEMP TEMP */
  const handleCall = (e) => {
    e.preventDefault();
    setJoined(true);
  };

  return (
    <>
      <div
        className="message-container-wrapper"
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        <ChatProfile myuser={user} other={other} />

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
                  <div
                    className="bigMessage"
                    onContextMenu={(e) => handleContextMenu(e, message._id)}
                  >
                    <img
                      src="/profile.jpeg"
                      className="profile-image"
                      style={{ visibility: "visible" }}
                    />
                    <div className="namechat">
                      <div className="nametime">
                        <div className="username">{message.user.name}</div>
                        <div className="timestamp">
                          {new Date(message.createdAt).toLocaleDateString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </div>
                      <div className="message">{message.chat}</div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="my-message-container"
                    onMouseEnter={() => {
                      setStyle(message._id);
                    }}
                    onMouseLeave={(e) => {
                      setStyle("");
                    }}
                    onContextMenu={(e) => handleContextMenu(e, message._id)}
                  >
                    <div
                      className="timestamp2"
                      style={
                        style === message._id
                          ? { visibility: "visible" }
                          : { visibility: "hidden" }
                      }
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>

                    <div className="my-message">{message.chat}</div>
                  </div>
                )
              ) : index === 0 ||
                messageList[index - 1].user.name == user.name ||
                messageList[index - 1].user.name === "system" ? (
                <div className="bigMessage" onClick={handleCall}>
                  <img
                    src="/profile.jpeg"
                    className="profile-image"
                    style={{ visibility: "visible" }}
                  />
                  <div className="namechat">
                    <div className="nametime">
                      <div className="username">{message.user.name}</div>
                      <div className="timestamp">
                        {new Date(message.createdAt).toLocaleDateString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>
                    <div className="message">{message.chat}</div>
                  </div>
                </div>
              ) : (
                <div
                  className="your-message-container"
                  onMouseEnter={() => {
                    setStyle(message._id);
                  }}
                  onMouseLeave={(e) => {
                    setStyle("");
                  }}
                >
                  <div
                    className="timestamp2"
                    style={
                      style === message._id
                        ? { visibility: "visible" }
                        : { visibility: "hidden" }
                    }
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <div className="your-message">{message.chat}</div>
                </div>
              )}
            </div>
          );
        })}
        <div className="mcEmpty" ref={messagesEndRef}></div>
      </div>
      {isOpen && mType === "Chat" && (
        <div
          className="contextMenu"
          style={{ top: mPosition.y, left: mPosition.x }}
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
