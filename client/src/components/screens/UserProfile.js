import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import {useParams} from 'react-router-dom'

const UserProfile = () => {

  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const {userid} = useParams()
  
  
  useEffect(() => {
    fetch(`/profile/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
       
        setProfile(result)
      });
  }, []);

  const followUser = ()=>{
      fetch("/follow", {
          method:"put",
          headers:{
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
          },
          body: JSON.stringify({
              followId:userid
          })
      }).then(res=>res.json())
      .then(data=>{
         dispatch({ type:"UPDATE", payload:{following:data.following, followers:data.followers} })
         localStorage.setItem("user", JSON.stringify(data))
         setProfile((prevState)=>{
             return {
                 ...prevState,
                 user:{
                   ...prevState.user,
                  followers:[...prevState.user.followers, data._id]
                }
             }
         })
         
         
      })
  }

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        
        setProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(item => {
            return item !== data._id
          })
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        
      });
  };

  return (
    <>
      {/* {console.log(userProfile)} */}
      {userProfile ? (
        <div
          style={{
            maxWidth: "550px",
            margin: "0px auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "10px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.pic}
                alt="userProfilepic"
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h7>{userProfile.posts.length + " "} posts</h7>
                <h7>{userProfile.user.followers.length + " "} followers</h7>
                <h7>{userProfile.user.following.length + " "} following</h7>
              </div>
              {!userProfile.user.followers.includes(state._id) ? (
                <button
                  style={{ margin: "10px" }}
                  className="btn btn waves-effect waves-light #64b5f6 blue darker-1"
                  onClick={() => followUser()}
                >
                  follow
                </button>
              ) : (
                <button
                  style={{margin: "10px"}}
                  className="btn btn waves-effect waves-light #64b5f6 blue darker-1"
                  onClick={() => unfollowUser()}
                >
                  unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallary">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...!</h2>
      )}
    </>
  )

}

export default UserProfile
