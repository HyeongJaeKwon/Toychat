import { createContext, useReducer } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
AgoraRTC.setLogLevel(4);
AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);

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

export const CallContext = createContext(INITIAL_STATE);

const CallReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      const newState = {
        ...state,
        audioTrack: null,
        videoTrack: null,
        users: [],
      };
      return newState;

    case "AUDIOTRACK":
      return {
        ...state,
        audioTrack: action.payload.track,
        users: [
          ...state.users,
          {
            uid: action.payload.uid,
            audioTrack: action.payload.track,
            volume: 0,
          },
        ],
      };

    case "VIDEOTRACK":
      return {
        ...state,
        videoTrack: action.payload.track,
        users: state.users.filter((user) => {
          if (user.uid === action.payload.uid) {
            user.videoTrack = action.payload.track;
          }
          return true;
        }),
        camMuted: false,
      };
    case "HANDLE_MIC":
      const newMicMuted = !state.micMuted;
      if (state.audioTrack) {
        state.audioTrack.setMuted(newMicMuted);
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

    case "HANDLE_USER_PUBLISHED":
      const { user, mediaType } = action.payload;

      if (mediaType === "video") {
        console.log("hup: ", user);
        const newUser = {
          videoTrack: user.videoTrack,
        };
        return {
          ...state,
          users: state.users.filter((each) => {
            if (each.uid === user.uid) {
              each.videoTrack = newUser.videoTrack;
            }
            return true;
          }),
        };
      }

      if (mediaType === "audio") {
        user.volume = 0;
        user.audioTrack.play();
        const updatedUsers = state.users.some((each) => each.uid === user.uid)
          ? state.users
          : [...state.users, user];
        return {
          ...state,
          users: updatedUsers,
        };
      }

      return state;
    case "CLEAN":
      state.audioTrack.stop();
      state.audioTrack.close();
      if (state.videoTrack !== null) {
        state.videoTrack.stop();
        state.videoTrack.close();
      }

      return {
        ...state,
        audioTrack: null,
        videoTrack: null,
        micMuted: false,
        camMuted: true,
      };

    case "HANDLE_CAMERA":
      // state.videoTrack.stop();
      // state.videoTrack.close();
      state.videoTrack.setEnabled(state.camMuted)
      return {
        ...state,
        // videoTrack: state.videoTrack,
        camMuted: !state.camMuted,
      };
    case "TOGGLE_OTHER_CAMERA":
      return{
        ...state,
        users: state.users.filter((user)=>{
          if(user.uid === "a"){
            user.videoTrack = null;
          }
          return true
        })
      }
      default:
      return state;
  }
};

export const CallContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CallReducer, INITIAL_STATE);

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
