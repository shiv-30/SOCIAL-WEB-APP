import React, {useState, useEffect} from "react";
import {Link, useHistory} from "react-router-dom"
import M from 'materialize-css'

const Signup = () => {

  const history=useHistory()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState('')
  const [url, setUrl] = useState(undefined)

  useEffect(() => {
    if(url) {
      uploadFields()
    }
  }, [url])
  
  const uploadPic = ()=> {
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
        setUrl(data.url);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const uploadFields = () => {
    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      fetch("/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
          email,
          pic:url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({
              html: data.error,
              classes: "#c62828 red darken-2 rounded",
            });
          } else {
            M.toast({
              html: data.message,
              classes: "#43a047 green darken-1 rounded",
            });
            history.push("/signin");
          }
        })
        .catch((err) => {
          
        });
    } else {
      M.toast({
        html: "invalid email",
        classes: "#c62828 red darken-2 rounded",
      });
      return;
    }
  }
  const PostData = () => {
    if(image) {
      uploadPic()
    } else {
      uploadFields()
    }
    
  }

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>
          <img
            src="https://res.cloudinary.com/techno23/image/upload/v1620989347/sociallogo_cnrgev.png"
            style={{
              width: "200px",
              height: "80px",
              marginTop: "10px",
              marginRight: "5px",
            }}
            alt=""
          />
          
        </h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="file-field input-field">
          <div className="btn  #42a5f5 blue darken-2">
            <span>Upload Pic</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #42a5f5 blue darken-2"
          type="submit"
          onClick={() => {
            PostData();
          }}
        >
          SignUp
        </button>
        <h6>
          <Link to="/signin">Already have an account?</Link>
        </h6>
      </div>
    </div>
  );
}

export default Signup;
