import React, { useContext, useEffect, useState } from "react";

import "./Voice.css";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { IoRocketSharp } from "react-icons/io5";
import { MdScreenShare } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import { ImPhoneHangUp } from "react-icons/im";

import { VideoPlayer } from "./VideoPlayer";
import { CallContext } from "../../context/CallContext";

const VoiceClone = ({ myuser, setJoined }) => {
  const {
    micMuted,
    camMuted,
    audioTrack,
    videoTrack,
    users,
    client,
    dispatch,
  } = useContext(CallContext);

  useEffect( () => {
    dispatch({type:"INIT", payload: myuser})
    client.on("user-published", handleUserPublished);
   
    

    // client.on("user-left", handleUserLeft);


    /** (Wrong) when unmount.... delete mic&Cam + off sockets + unpublish the user from the channel */
    /** (Correct) But Connection should persist even when away from the page */
    // const cleanupFunction = async () => {
    //   try {
    //     micMuted = false;
    //     camMuted = true;
    //     console.log("Return Logic Triggered");
    //     console.log("Removing AudioTrack: ", audioTrack);
    //     audioTrack.stop();
    //     audioTrack.close();
    //     audioTrack = null;
    //     console.log("Is VideoTrack null??: ", videoTrack);
    //     if (videoTrack !== null) {
    //       console.log("Removing VideoTrack: ", audioTrack);
    //       videoTrack.stop();
    //       videoTrack.close();
    //       videoTrack = null;
    //     }
    //     client.off("user-published", handleUserPublished);
    //     client.off("user-left", handleUserLeft);
    //     client.off("volume-indicator", handleVolume);
    //     client.unpublish();
    //     client.leave();
    //     console.log("Return Logic Ended");
    //   } catch (err) {
    //     alert(`Something went wrong, please refresh: ${err.message}`);
    //   }
    // };

    // return cleanupFunction;
  }, [setJoined]);

  const handleCancel = () => {
    // returnLogic();
    setJoined(false);
  };

//   /** client.on("volume-indicator") + handleVolume */
//   const initVolumeIndicator = async () => {
//     AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);
//     client.enableAudioVolumeIndicator();
//     client.on("volume-indicator", handleVolume);
//   };

  /** Set that user's volume from users */
  const handleVolume = (volumes) => {
    dispatch({type:"HANDLE_VOLUME", payload: volumes})
  };

  /** Add User into UserList + Audio Play O + Video Play X */
  const handleUserPublished = async (user, mediaType) => {

    dispatch({type:"HANDLE_USER_PUBLISHED", payload :{user:user, mediaType: mediaType}})
  
  };

 
  const handleUserLeft = (user) => {
    dispatch({type:"HANDLE_USER_LEFT", payload: user})
 
  };

  const handleCamera = () => {
    // console.log("handle Cam");
    // console.log("videoTrack: ", videoTrack);
    // if (videoTrack === null) {
    //   Promise.all([AgoraRTC.createCameraVideoTrack(), myuser.name]).then(
    //     ([track, uid]) => {
    //       console.log("Promise.all Success: ", track);
    //       videoTrack = track;
    //       setUsers((previousUsers) =>
    //         previousUsers.filter((user) => {
    //           if (user.uid === uid) {
    //             user.videoTrack = track;
    //           }
    //           return true;
    //         })
    //       );
    //       camMuted = false;
    //       client.publish(track);
    //       // initVolumeIndicator();
    //     }
    //   );
    // } else {
    //   videoTrack.setEnabled(camMuted);
    //   camMuted = !camMuted;
    // }
  };

  const handleMic = () => {
    dispatch({type:"HANDLE_MIC"})
  };

  const arr = [
    // {
    //   icon: <BsCameraVideoOffFill size={25} />,
    //   id: "camera",
    //   function: handleCamera,
    //   style: !camMuted ? { backgroundColor: "white", color: "black" } : {},
    // },
    // {
    //   icon: <IoRocketSharp size={25} />,
    //   id: "rocket",
    //   function: () => {},
    //   style: {},
    // },
    // {
    //   icon: <MdScreenShare size={25} />,
    //   id: "screen",
    //   function: () => {},
    //   style: {},
    // },
    // {
    //   icon: !micMuted ? (
    //     <FaMicrophone size={25} />
    //   ) : (
    //     <FaMicrophoneSlash size={25} />
    //   ),
    //   id: "mic",
    //   function: handleMic,
    //   style: !micMuted ? { backgroundColor: "white", color: "black" } : {},
    // },
    // {
    //   icon: <ImPhoneHangUp size={25} />,
    //   id: "cancel",
    //   function: handleCancel,
    //   style: { backgroundColor: "red" },
    // },
  ];

  return (
    <div className="vContainer" onClick={()=>console.log(users)}>
      <div className="vUsers" >
      {users.some((each) => {
          if (each.uid === myuser.name) {
            return !camMuted;
          } else {
            return each.videoTrack;
          }
        }) ? (
          <div className="vCams">
            {users.map((each, index) =>
              each.uid === myuser.name && camMuted ? (
                <div className="vVid">
                  {" "}
                  <div className="vDefault">
                    <img src={"/profile.jpeg"}></img>
                  </div>
                  {each.volume > 50 && <div className="vGreenVid"></div>}
                </div>
              ) : (
                <div key={`${each.uid}-${index}`}>
                  {each.videoTrack ? (
                    <div className="vVid">
                      <VideoPlayer user={each} />
                      {each.volume > 50 && <div className="vGreenVid"></div>}
                    </div>
                  ) : (
                    <div className="vVid">
                      <div className="vDefault">
                        <img src={"/profile.jpeg"}></img>
                      </div>
                      {each.volume > 50 && <div className="vGreenVid"></div>}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          users.map((each, index) => (
            <div key={`${each.uid}-${index}`}>
              <div className="vImg">
                <img src={"/profile.jpeg"}></img>
                {each.volume > 50 && <div className="vGreen"></div>}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="vOptions">
        {arr.map((each) => (
          <div
            className="vOneOption"
            style={each.style}
            onClick={each.function}
            key={each.id}
          >
            {each.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceClone;
