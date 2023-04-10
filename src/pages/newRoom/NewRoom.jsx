import "./NewRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewRoom = () => {
  const [info,setInfo] = useState({});
  const [hotelId,setHotelId] = useState(undefined);
  const [rooms,setRooms] = useState([]);

  const {data,loading,error} = useFetch("/hotels");

  const handleChange = (e) =>{
    setInfo(prev=> ({...prev,[e.target.id]: e.target.value}))
  }

  const handleClick = async (e) => {
    e.preventDefault();

    const roomNumbers = rooms.split(",").map(room => ({number: room})); // convert list thành dạng object để lưu vào db
    // console(roomNumbers);
    try {
      await axios.post(`/rooms/${hotelId}`,{...info,roomNumbers})
    } catch (error) {
      
    }
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          
          <div className="right">
            <form>

              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input onChange={handleChange} id={input.id} type={input.type} placeholder={input.placeholder} />
                </div>
              ))}

              <div className="formInput">
                <label>Phòng</label>
                <textarea onChange={e=>setRooms(e.target.value)}  placeholder="Nhập danh sách số phòng cách nhau bằng dấu phẩy "/>
              </div>

              <div className="formInput">
                <label>Chọn Hotel</label>
                <select id="hotelId" onChange={e=>setHotelId(e.target.value)}>
                  {loading ? "loading..." : data && data.map((hotel)=>(
                    <option value={hotel._id}  key={hotel._id} >{hotel.name}</option>
                  ))}
                </select>
              </div>

              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
