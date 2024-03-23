import { createContext, useReducer } from "react";

const INITIAL_STATE = {
    isOpen: false,
    mid: "",
    mPosition: { x: 0, y: 0 },
    mType: "",
};

export const ModalContext = createContext(INITIAL_STATE);

const ModalReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        isOpen: false,
        mid: "",
        mPosition: { x: 0, y: 0 },
        mType: "",
      };
      case "CLOSE":
        return {
          ...state, 
          isOpen: false
        };
    case "CLICK":
      return {
        isOpen: true, 
        mid: action.payload.mid,
        mPosition: {x : action.payload.x, y: action.payload.y},
        mType: action.payload.mType
      };
    default:
      return state;
  }
};

export const ModalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ModalReducer, INITIAL_STATE);

  //   useEffect(() => {
  //     localStorage.setItem("user", JSON.stringify(state.user));
  //   }, [state.user]);

  return (
    <ModalContext.Provider
      value={{
        chatRoomList: state.chatRoomList,
        friendList: state.friendList,
        pendingList: state.pendingList,
        blockedList: state.blockedList,
        dispatch,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
