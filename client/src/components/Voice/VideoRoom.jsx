import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";

const APP_ID = "6660596f84a742c5b48b85879ef009b1";
const TOKEN =
  "007eJxTYEiuYWG6Yh/I+minAMtMqed7M+0VuqOyzDiajjb251xs/KvAYGZmZmBqaZZmYZJobmKUbJpkYpFkYWphbpmaZmBgmWTYa/kltSGQkeH1cm5mRgYIBPFZGcryM5NTGRgAmrQdmA==";
const CHANNEL = "voice";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

export const VideoRoom = ({ myuser }) => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

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

  useEffect(() => {
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
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserPublished);
      client.off("user-left", handleUserLeft);
      client.off("volume-indicator", handleVolume);
      client.unpublish(localTracks).then(() => client.leave());
    };



  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 200px)",
        }}
      >
        {users.map((user) => (
          //   <VideoPlayer key={user.uid} user={user} />
          <div
            style={{
              width: "400px",
              height: "400px",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: user.volume > 50 ? "green" : "gray",
              color: "white",
            }}
          >
            <VideoPlayer key={user.uid} user={user} />
            <div>{user.uid}</div>
            <div>{user.volume}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// import React, { useEffect, useState } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";

// const VideoRoom = () => {
//   const [users, setUsers] = useState([]);
//   const [localTracks, setLocalTracks] = useState(null);

//   const APP_ID = "6660596f84a742c5b48b85879ef009b1";
//   const TOKEN =
//     "007eJxTYEiuYWG6Yh/I+minAMtMqed7M+0VuqOyzDiajjb251xs/KvAYGZmZmBqaZZmYZJobmKUbJpkYpFkYWphbpmaZmBgmWTYa/kltSGQkeH1cm5mRgYIBPFZGcryM5NTGRgAmrQdmA==";
//   const CHANNEL = "voice";
//   const rtcUid = Math.floor(Math.random() * 2032);
//   const audioTracks = {
//     localAudioTrack: null,
//     remoteAudioTracks: {},
//   };

//   let rtcClient;

//   const initRtc = async () => {
//     // rtcClient.on("user-joined", handleUserJoined);

//     rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//     rtcClient.on("user-published", handleUserPublished);
//     rtcClient.on("user-left", handleUserLeft);
//     rtcClient
//       .join(APP_ID, CHANNEL, TOKEN, rtcUid)
//       .then((uid) =>
//         // Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
//         Promise.all([AgoraRTC.createMicrophoneAudioTrack(), uid])
//       )
//       .then(([tracks, uid]) => {
//         // const [audioTrack, videoTrack] = tracks;
//         const audioTrack = tracks;
//         setLocalTracks(tracks);
//         // setUsers((previousUsers) => [
//         //   ...previousUsers,
//         //   {
//         //     uid,
//         //     videoTrack,
//         //     audioTrack,
//         //   },
//         // ]);
//         setUsers((previousUsers) => [
//           ...previousUsers,
//           {
//             uid,
//             // videoTrack,
//             audioTrack,
//           },
//         ]);
//         rtcClient.publish(tracks);
//         initVolumeIndicator();
//       });

//     // await rtcClient.join(appid, roomId, token, rtcUid);
//     // audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
//     // await rtcClient.publish(audioTracks.localAudioTrack);

//     // document
//     //   .getElementById("members")
//     //   .insertAdjacentHTML(
//     //     "beforeend",
//     //     `<div class="speaker user-rtc-${rtcUid}" id="${rtcUid}"><p>${rtcUid}</p></div>`
//     //   );
//   };

//   let initVolumeIndicator = async () => {
//     //1
//     AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);
//     rtcClient.enableAudioVolumeIndicator();

//     //2
//     rtcClient.on("volume-indicator", (volumes) => {
//       volumes.forEach((volume) => {
//         console.log(`UID ${volume.uid} Level ${volume.level}`);
//         // //3
//         // try{
//         //     let item = document.getElementsByClassName(`user-rtc-${volume.uid}`)[0]

//         //    if (volume.level >= 50){
//         //      item.style.borderColor = '#00ff00'
//         //    }else{
//         //      item.style.borderColor = "#fff"
//         //    }
//         // }catch(error){
//         //   console.error(error)
//         // }
//       });
//     });
//   };

//   const handleUserPublished = async (user, mediaType) => {
//     console.log("new user published: ", user);
//     console.log("mediaType:", mediaType);
//     await rtcClient.subscribe(user, mediaType);

//     if (mediaType === "video") {
//       // setUsers((previousUsers) => [...previousUsers, user]);
//     }

//     if (mediaType === "audio") {
//       setUsers((previousUsers) => [...previousUsers, user]);
//       //   user.audioTrack.play()
//     }
//   };

//   const handleUserLeft = (user) => {
//     setUsers((previousUsers) =>
//       previousUsers.filter((u) => u.uid !== user.uid)
//     );
//   };

//   useEffect(() => {
//     initRtc();
//     return () => {
//       for (let localTrack of localTracks) {
//         localTrack.stop();
//         localTrack.close();
//       }
//       rtcClient.off("user-published", handleUserPublished);
//       rtcClient.off("user-left", handleUserLeft);
//       rtcClient.unpublish(localTracks).then(() => rtcClient.leave());
//     };
//   }, []);

//   return (
//     <div id="container">
//       <div id="room-header">
//         <h1 id="room-name"></h1>

//         <div id="room-header-controls">
//           <img id="mic-icon" class="control-icon" src="icons/mic-off.svg" />
//           <img id="leave-icon" class="control-icon" src="icons/leave.svg" />
//         </div>
//       </div>

//       <form id="form">
//         {/* <input name="displayname" type="text" placeholder="Enter display name..."/> */}
//         <input name="username" type="submit" value="Enter Room" />
//       </form>

//       <div id="members"></div>
//     </div>
//   );
// };

export default VideoRoom;
