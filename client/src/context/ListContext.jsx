import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  chatRoomList: [],
  friendList: [],
  pendingList: [],
  blockedList: [],
};

export const ListContext = createContext(INITIAL_STATE);

const ListReducer = (state, action) => {
  switch (action.type) {
    case "INIT_LIST":
      return {
        chatRoomList: action.payload,
        friendList: state.friendList,
        pendingList: state.pendingList,
        blockedList: state.blockedList,
      };
      case "INIT_FRIENDS":
        return {
          chatRoomList: state.chatRoomList,
          friendList: action.payload,
          pendingList:state.pendingList,
          blockedList: state.blockedList,
        };
    case "INIT_PENDING":
      return {
        chatRoomList: state.chatRoomList,
        friendList: state.friendList,
        pendingList: action.payload,
        blockedList: state.blockedList,
      };
    case "INIT_BLOCKED":
      return {
        chatRoomList: state.chatRoomList,
        friendList: state.friendList,
        pendingList: state.pendingList,
        blockedList: action.payload,
      };
    case "ADD_ROOM":
      return {
        chatRoomList: [action.payload, ...state.chatRoomList],
        friendList: state.friendList,
        pendingList: state.pendingList,
        blockedList: state.blockedList,
      };
    case "DELETE_ROOM":
      return {
        chatRoomList: state.chatRoomList.filter(
          (room) => room.room._id !== action.payload
        ),
        friendList: state.friendList,
        pendingList: state.pendingList,
        blockedList: state.blockedList,
      };
    case "ONLINE":
      return {
        chatRoomList: state.chatRoomList.filter((room) => {
          if (room.other._id === action.payload._id) {
            room.other.online = action.payload.online;
            room.other.token = action.payload.token;
          }
          return true;
        }),
        friendList: state.friendList.filter((user) => {
            if (user._id === action.payload._id) {
              user.online = action.payload.online;
              user.token = action.payload.token;
            }
            return true;
          }),
        pendingList: state.pendingList.filter((user) => {
          if (user._id === action.payload._id) {
            user.online = action.payload.online;
            user.token = action.payload.token;
          }
          return true;
        }),
        blockedList: state.blockedList.filter((user) => {
          if (user._id === action.payload._id) {
            user.online = action.payload.online;
            user.token = action.payload.token;
          }
          return true;
        }),
      };
    default:
      return state;
  }
};

export const ListContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ListReducer, INITIAL_STATE);

  //   useEffect(() => {
  //     localStorage.setItem("user", JSON.stringify(state.user));
  //   }, [state.user]);

  return (
    <ListContext.Provider
      value={{
        chatRoomList: state.chatRoomList,
        friendList: state.friendList,
        pendingList: state.pendingList,
        blockedList: state.blockedList,
        dispatch,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
