import React, { useEffect, useState } from "react";
// import VideoRoom from "./VideoRoom";
import "./Voice.css";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { IoRocketSharp } from "react-icons/io5";
import { MdScreenShare } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import { ImPhoneHangUp } from "react-icons/im";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";

const APP_ID =
const TOKEN =
 const CHANNEL = 

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

let micMuted = false;

const Voice = ({ myuser, setJoined }) => {
  const [localTracks, setLocalTracks] = useState([]);

  const [users, setUsers] = useState([]);

  const handleCancel = () => {
    returnLogic();
    setJoined(false);
  };

  /** client.on("volume-indicator") + handleVolume */
  const initVolumeIndicator = async () => {
    AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);
    client.enableAudioVolumeIndicator();

    client.on("volume-indicator", handleVolume);
  };

  /** Set that user's volume from users */
  const handleVolume = (volumes) => {
    volumes.forEach((volume) => {
      setUsers((previousUsers) =>
        previousUsers.filter((u) => {
          if (u.uid === volume.uid) {
            u.volume = volume.level;
          }
          return true;
        })
      );
    });
  };

  /** Add User into UserList + Audio Play O + Video Play X */
  const handleUserPublished = async (user, mediaType) => {
    /**Video Comes First, then Audio Comes!! */
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      user.volume = 0;
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  /** Simply remove the user */
  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  const handleCamera = () => {};

  const handleMic = () => {
    console.log("handleMic");
    const [audioTrack, videoTrack] = localTracks;
    console.log("localTracks: ", localTracks);
    micMuted = !micMuted;
    audioTrack.setMuted(micMuted);
  };

  const returnLogic = () => {
    try {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserPublished);
      client.off("user-left", handleUserLeft);
      client.off("volume-indicator", handleVolume);
      client.unpublish(localTracks).then(() => client.leave());
    } catch (err) {
      alert(`Something went wrong, please refresh: ${err.message}`);
    }
  };
  const arr = [
    {
      icon: <BsCameraVideoOffFill size={25} />,
      id: "camera",
      function: handleCamera,
      style: {},
    },
    {
      icon: <IoRocketSharp size={25} />,
      id: "rocket",
      function: () => {},
      style: {},
    },
    {
      icon: <MdScreenShare size={25} />,
      id: "screen",
      function: () => {},
      style: {},
    },
    {
      icon: !micMuted ? (
        <FaMicrophone size={25} />
      ) : (
        <FaMicrophoneSlash size={25} />
      ),
      id: "mic",
      function: handleMic,
      style: !micMuted ? { backgroundColor: "white", color: "black" } : {},
    },
    {
      icon: <ImPhoneHangUp size={25} />,
      id: "cancel",
      function: handleCancel,
      style: { backgroundColor: "red" },
    },
  ];

  useEffect(() => {
    setUsers([]);
    client.on("user-published", handleUserPublished);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, myuser.name)
      .then(
        (uid) => Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
        // Promise.all([AgoraRTC.createMicrophoneAudioTrack(), uid])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        // const audioTrack = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
            volume: 0,
          },
        ]);

        client.publish(tracks);
        initVolumeIndicator();
      });

    /** (Wrong) when unmount.... delete mic&Cam + off sockets + unpublish the user from the channel */
    /** (Correct) But Connection should persist even when away from the page */
    return () => {
      returnLogic();
    };
  }, []);

  return (
    <div className="vContainer">
      <div className="vUsers">
        {users.map((each) => (
          <div className="vImg">
            <img src={"/profile.jpeg"}></img>
            {each.volume > 50 && <div className="vGreen"></div>}
            {/* <div style={{ color: "white" }}>dwdw</div> */}
          </div>
        ))}
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

export default Voice;
