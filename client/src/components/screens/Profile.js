import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from "../../App"



const Profile = () => {
    const [mypics, setPics] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("");
    

    useEffect(() => {
      fetch("/mypost", {
        headers: {
          "Authorization":"Bearer " + localStorage.getItem("jwt")
        }
      }).then(res=>res.json())
      .then(result=>{
        
        setPics(result.mypost);
      })
    }, [])

    useEffect(() => {
      if(image) {
           
           const data = new FormData();
           data.append("file", image);
           data.append("upload_preset", "insta-clone");
           data.append("cloud_name", "techno23");
           fetch("https://api.cloudinary.com/v1_1/techno23/image/upload", {
             method: "post",
             body: data,
           })
             .then((res) => res.json())
             .then((data) => {
               
               
               fetch('/updatepic', {
                 method:"put",
                 headers: {
                   "Content-Type": "application/json",
                   "Authorization": "Bearer " + localStorage.getItem("jwt"),
                 },
                 body:JSON.stringify({
                   pic:data.url
                 })
               }).then(res=>res.json())
               .then(result=>{
                 localStorage.setItem(
                   "user",
                   JSON.stringify({ ...state, pic: result.pic })
                 );
                 dispatch({ type: "UPDATEPIC", payload: result.pic });
               })
             })
             .catch((err) => {
               console.error(err);
             });
      }
    }, [image])
    const updatePhoto = (file)=> {
     setImage(file)
    }

    return (
      <div
        style={{
          maxWidth: "550px",
          margin: "0px auto",
        }}
      >
        <div
          style={{
            margin: "10px 0px",
            borderBottom: "1px solid grey",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={state ? state.pic : "loading"}
                alt="profile-pic"
              />
            </div>

            <div>
              <h5>{state ? state.name : "loading"}</h5>
              <h6>{state ? state.email : "loading"}</h6>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h7>{mypics.length ? mypics.length + " " : "0 "} posts</h7>
                <h7>
                  {state && state.followers.length ? state.followers.length : "0"}{" "}
                  followers
                </h7>
                <h7>
                  {state && state.following.length ? state.following.length : "0"}{" "}
                  following
                </h7>
              </div>
            </div>
          </div>
          
          <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn  #42a5f5 blue darken-2">
              <span>Update Pic</span>
              <input
                type="file"
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div className="gallary">
          {!mypics ? (
            <p>No posts!</p>
          ) : (
            mypics.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })
          )}
        </div>
      </div>
    );
}

export default Profile