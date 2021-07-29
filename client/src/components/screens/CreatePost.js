import React, {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import M from "materialize-css";


const CreatePost = () => {

  

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")  
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const history = useHistory()

    useEffect(() => {
      if(url) {
        fetch("/createpost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt")
          },
          body: JSON.stringify({
            title,
            body,
            pic: url
          })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              M.toast({
                html: data.error,
                classes: "#c62828 red darken-2 rounded"
              })
            } else {
              M.toast({
                html: "created post successfully",
                classes: "#43a047 green darken-1 rounded"
              })
              history.push("/")
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
      

    }, [url])    


    const postDetails = () => {
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset","insta-clone")
      data.append("cloud_name", "techno23")
      fetch("https://api.cloudinary.com/v1_1/techno23/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url)
        })
        .catch((err) => {
          console.error(err)
        })

        
        
    }
        
    return (
      <div
        className="card input-field"
        style={{
          margin: "30px auto",
          maxWidth: "500px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn  #42a5f5 blue darken-2">
            <span className="upload" style={{textTransform:"lowercase"}}>upload image</span>
            <input 
            type="file"
            onChange={(e) => setImage(e.target.files[0])} 
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #42a5f5 blue darken-2"
          type="submit"
          onClick={()=> postDetails()}
        >
          Submit Post
        </button>
      </div>
    );
}

export default CreatePost
