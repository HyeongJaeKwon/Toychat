import { createContext, useReducer } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
AgoraRTC.setLogLevel(4);

const INITIAL_STATE = {
  micMuted: false,
  camMuted: true,
  audioTrack: null,
  videoTrack: null,
  users: [],
  client: AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  }),
};

const APP_ID = process.env.REACT_APP_APP_ID;
const TOKEN = process.env.REACT_APP_TOKEN;
const CHANNEL = process.env.REACT_APP_CHANNEL;

export const CallContext = createContext(INITIAL_STATE);

const CallReducer =  (state, action) => {
  switch (action.type) {
    case "INIT":
      // Reset tracks and users
      console.log("-")
      const newState = {
        ...state,
        audioTrack: null,
        videoTrack: null,
        users: [],
      };

      console.log("-")
    //   newState.client.on("user-published", handleUserPublished);
      console.log("-")
      newState.client
        .join(APP_ID, CHANNEL, TOKEN, action.payload.name)
        .then((uid) =>
          Promise.all([AgoraRTC.createMicrophoneAudioTrack(), uid])
        )
        .then(([track, uid]) => {
            console.log("-")
          newState.audioTrack = track;
          newState.users = [
            ...state.users,
            {
              uid,
              audioTrack: track,
              volume: 0,
            },
          ];
          console.log("-")
          newState.client.publish(track);
          console.log("-")
        })
        .catch((error) => {
          console.error("Error during initialization:", error);
        });
        console.log("-")
      return newState;

    case "HANDLE_MIC":
      const newMicMuted = !state.micMuted;
      if (newMicMuted && state.audioTrack) {
        state.audioTrack.setMuted(true);
      }
      return {
        ...state,
        micMuted: newMicMuted,
      };
    case "HANDLE_USER_LEFT":
      return {
        ...state,
        users: state.users.filter((user) => user.uid !== action.payload.uid),
      };

    case "HANDLE_VOLUME":
      const volumes = action.payload;
      const updatedUsers = state.users.map((user) => {
        const updatedUser = volumes.find((volume) => volume.uid === user.uid);
        if (updatedUser) {
          return {
            ...user,
            volume: updatedUser.level,
          };
        }
        return user;
      });
      return {
        ...state,
        users: updatedUsers,
      };

    //////
    case "HANDLE_USER_PUBLISHED":
      const { user, mediaType } = action.payload;
      const handleUserPublished =  (user, mediaType) => {
        console.log("Handle User Published");
        console.log(user, mediaType)

         state.client.subscribe(user, mediaType);

        if (mediaType === "video") {
          // Handle video logic here if needed
        }

        if (mediaType === "audio") {
          user.volume = 0;
          user.audioTrack.play();
          const updatedUsers = state.users.some((each) => each.uid === user.uid)
            ? state.users
            : [...state.users, user];

            console.log("updatedUsers: ", updatedUsers)
          return {
            ...state,
            users: updatedUsers,
          };
        }
      };

       handleUserPublished(user, mediaType);
      return state;

    ///////////////
    default:
      return state;
  }
};

export const CallContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CallReducer, INITIAL_STATE);

  //   useEffect(() => {
  //     localStorage.setItem("user", JSON.stringify(state.user));
  //   }, [state.user]);

  return (
    <CallContext.Provider
      value={{
        micMuted: state.micMuted,
        camMuted: state.camMuted,
        audioTrack: state.audioTrack,
        videoTrack: state.videoTrack,
        users: state.users,
        client: state.client,
        dispatch,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

///// /
//d/d//d/d//d/d/
//d/d/
