import { useNavigate } from "react-router-dom"
import "./RoomList.css"


const RoomList = ({rooms}) =>  {

    const navigate = useNavigate();

    const moveToChat = (rid) => {
        // console.log(e)
        navigate(`/chat/${rid}`);
    }

    console.log("rooms",rooms)




  return (
    <div className="rContainer">
        <div className="rNav">Chats ...</div>
        {rooms.length > 0 ? (<>{rooms.map((room)=> (
            <div className="rList" key={room._id} onClick={()=>moveToChat(room._id)} value={room._id}>
                <div className="rTitle">
                    <img src={"/profile.jpeg"}/>
                    <p>{room.name}</p>
                </div>
                <div className="usersNumber">{room.users.length}</div>
            </div>
        ))}</>):<div>g</div>}
    </div>
  )
}

export default RoomList