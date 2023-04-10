import "./NewHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewHotel = () => {
  const [files, setFiles] = useState("");

  const [info,setInfo] = useState({});
  const [rooms,setRooms] = useState([]);
  const {data,loading,error} = useFetch("/rooms");

  const handleChange = e =>{
    setInfo(prev=> ({...prev,[e.target.id]: e.target.value}))
  }

  const handleSelect = e => {
    const value = Array.from(e.target.selectedOptions,(option) => option.value); //list id rooms select
    setRooms(value);
  }

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      // cau hinh cloundinary de luu tru hinh anh 
      const CLOUD_NAME = 'dczfad4x6';
      const API_KEY = '638815743715775';
      const API_SECRET = '2ZCjTDWM3qTskMDwKSBMTtIpOhg';
      
      const list = await Promise.all( /*convert object files to array*/ Object.values(files).map( async (file)=>{        
        e.preventDefault();
        const data = new FormData(); // tao form data
        data.append("file", file); // truyen file hinh anh 
        data.append("upload_preset", "upload");
        data.append('api_key', API_KEY)

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, // clound luu tru image
          data
        );
  
        const { url } = uploadRes.data; 
        return url;

      }))

      const newHotel = {
        ...info,
        rooms,
        photos: list
      }

      await axios.post("/hotels",newHotel);
    } catch (error) {
      
    }
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0]) //tạo tạm files chọn thành link ảnh
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input id={input.id} onChange={handleChange} type={input.type} placeholder={input.placeholder} />
                </div>
              ))}

              <div className="formInput">
                <label>Đặc sắc</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false} > NO </option>
                  <option value={true} > YES </option>

                </select>
              </div>

              <div className="selectRooms">
                <label>Phòng</label>
                <select id="rooms" multiple onChange={handleSelect}>
                  {loading ? "loading... " : data && data.map(room => (
                    <option value={room._id}  key={room._id}> {room.title} </option>
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

export default NewHotel;
