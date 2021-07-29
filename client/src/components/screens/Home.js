import React, {useEffect, useState, useContext, useCallback} from 'react'
import {UserContext} from "../../App"
import {Link} from "react-router-dom"

const Home = () => {

    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
   

    
    const fetchRequest = useCallback(() => {
       // Api request here
       fetch("/allpost", {
         headers: {
           Authorization: "Bearer " + localStorage.getItem("jwt"),
         },
       })
         .then((res) => res.json())
         .then((result) => {
           // console.log(result)
           setData(result.posts);
         });
   }, [data]);
   
    useEffect(() => {
      fetchRequest()
    }, [])
    
    const likePost = (id)=> {
      fetch("/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = data.map((item) => {
            if (item._id === result._id) {
              return result;
            } else {
              return item;
            }
          });
          console.log(newData);
          setData(newData);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const unlikePost = (id) => {

      fetch("/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = data.map((item) => {
            if (item._id === result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const makeComment = (text, postId)=> {
      fetch("/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(result);
          const newData = data.map((item) => {
            if (item._id === result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        })
        .catch((err) => {
          console.log(err);
        })
    }

    const deletePost = (postId) => {
      fetch(`/deletepost/${postId}`, {
        method: "delete",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
      }).then(res=>res.json())
      .then(result=>{
        // console.log(result)
        const newData = data.filter(item=> {
          return item._id !== result._id
        })
        setData(newData)
        fetchRequest()
      })
    }

    const deleteComment = (postId, commentId) => {
      
         fetch(`/deletecomment/${postId}/${commentId}`, {
           method: "put",
           headers: {
             "Content-Type": "application/json",
             Authorization: "Bearer " + localStorage.getItem("jwt"),
           },
           body: JSON.stringify({
             postId,
             commentId
           }),
         })
           .then((res) => res.json())
           .then((result) => {
             const newData = data.map((item) => {
               if (item._id === result._id) {
                 return result;
               } else {
                 return item;
               }
             });
             setData(newData);
           })
           .catch((err) => {
             console.log(err);
           });
        
    };
    return (
      <div className="row">
      <div className="home">
      {
        data.map((item, index)=>{
          return (
            <>
              <div
                className="col s12 m6 l4 card home-card"
                key={"" + index + "_" + item.postedBy._id}
              >
                <h5 style={{ padding: "5px" }}>
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile/"
                    }
                  >
                    {item.photo && (
                      <img
                        style={{
                          cursor: "pointer !important",
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          marginRight: "10px",
                          float: "left",
                          marginBottom: "10px",
                        }}
                        src={item.photo}
                        alt="profile-pic"
                      />
                    )}
                    <span
                      className="post-heading"
                      style={{
                        cursor: "pointer !important",
                        float: "left",
                        marginTop: "10px",
                        fontWeight: "700",
                        fontSize: "40px",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.postedBy.name}
                    </span>
                  </Link>
                  {item.postedBy._id === state._id && (
                    <i
                      className="material-icons"
                      style={{ float: "right" }}
                      onClick={() => {
                        deletePost(item._id);
                      }}
                    >
                      delete{" "}
                    </i>
                  )}
                </h5>
                <div className="card-image">
                  <img
                    className="activator"
                    src={item.photo}
                    alt="wallpaper"
                    height="300px"
                    weidth="150px"
                  />
                </div>
                <div className="card-content">
                  <i className="material-icons" style={{ color: "red" }}>
                    favorite
                  </i>

                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons"
                      onClick={() => {
                        unlikePost(item._id);
                      }}
                    >
                      thumb_down
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      onClick={() => {
                        likePost(item._id);
                      }}
                    >
                      thumb_up
                    </i>
                  )}
                  <h6>{item.likes.length} likes</h6>
                  {/* {console.log(item)} */}
                  <span className="card-title activator text-darken-4">
                    {item.title}
                    <i
                      className="material-icons right"
                      style={{ color: "blue" }}
                    >
                      more_vert
                    </i>
                  </span>
                  <p>{item.body}</p>
                </div>
                <div className="card-reveal">
                  <span className="card-title  text-darken-4">
                    {item.title}
                    <i
                      className="material-icons right"
                      style={{ color: "red" }}
                    >
                      close
                    </i>
                  </span>
                  <p>{item.body}</p>
                  {item.comments.map((record) => {
                    return (
                      <>
                        <h6 key={record._id}>
                          <span style={{ fontWeight: "500" }}>
                            {record.postedBy.name + " : "}
                          </span>
                          {record.text}
                          {record.postedBy._id === state._id && (
                            <i
                              className="material-icons"
                              style={{ float: "right" }}
                              onClick={() => {
                                deleteComment(item._id, record._id);
                              }}
                            >
                              delete
                            </i>
                          )}
                        </h6>
                      </>
                    );
                  })}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(e.target[0].value, item._id);
                    }}
                  >
                    <input type="text" placeholder="add a comment" />
                  </form>
                </div>
              </div>
            </>
          );
        })
      }

      </div>
      </div>
    );
}

export default Home
