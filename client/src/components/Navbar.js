/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useContext, useRef, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from "../App"
import M from 'materialize-css'


const Navbar = () => {
    const searchModal = useRef(null)
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [width, setWidth] = useState(window.innerWidth);
    const history = useHistory()
    useEffect(()=> {
      M.Modal.init(searchModal.current)
      setWidth(window.innerWidth)
    },[width])
    const renderList = () => {
      if(state) {
        return [
          <li key="1" className="option" onClick={closeMobileMenu}>
            <i
              data-target="modal1"
              className="large material-icons modal-trigger"
              style={{ color: "black" }}
            >
              search
            </i>
          </li>,
          <li key="2" className="option" onClick={closeMobileMenu}>
            <Link  to="/profile">
              <span className="btn-option">Profile</span>
            </Link>
          </li>,
          <li key="3" className="option" onClick={closeMobileMenu}>
            <Link  to="/create">
              <span className="btn-option">Create</span>
            </Link>
          </li>,
          <li key="4" className="option" onClick={closeMobileMenu}>
            <Link  to="/myfollowingpost">
              {" "}
              <span className="btn-option">following</span>
            </Link>
          </li>,
          <li key="5" onClick={closeMobileMenu}>
            <a
              className="option butn"
              type="submit"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/signin");
              }}
            >
              {console.log(width, typeof width)}
              <span className="option-button">Logout</span>
            </a>
          </li>,
        ];
      } else {
        return [
          <li key="6" className="option" onClick={closeMobileMenu}>
            <Link to="/signin" className="btn-option" onClick={closeMobileMenu}>
              Login
            </Link>
          </li>,
          <li key="7" className="option">
            <Link to="/signup" className="btn-option" onClick={closeMobileMenu}>
              Signup
            </Link>
          </li>,
        ];
      }
    }

    const fetchUsers = (query) => {
      setSearch(query);
      fetch("/search-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          // console.log(results);
          setUserDetails(results.user)
        });
    }
    return (
      <nav className="nav">
        <div className="nav-wrapper" style={{ backgroundColor: "#1C86DD" }}>
          <Link
            style={{ padding: "6px" }}
            to={state ? "/" : "/signin"}
            className="brand-logo left"
          >
            <img
              className="logo"
              src="https://res.cloudinary.com/techno23/image/upload/v1620991920/sociallogo_pxmfxm.png"
              style={{ width: "15%", height: "50px", marginRight: "5px", marginLeft:"0px" }}
              alt=""
            />
          </Link>

          <ul
            id="nav-mobile"
            className="right nav-icons"
          >
            {renderList()}
          </ul>
        </div>

        <div
          id="modal1"
          className="modal"
          ref={searchModal}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="search user"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />

            <ul className="collection">
              {userDetails.map((item, index) => {
                return (
                  <Link
                    to={
                      item._id === state._id
                        ? "/profile"
                        : "/profile/" + item._id
                    }
                    onClick={() => {
                      M.Modal.getInstance(searchModal.current).close();
                      setSearch("");
                    }}
                  >
                    <li key={item._id} className="collection-item">
                      {item.email}
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              className="modal-close waves-effect waves-green btn-flat"
              onClick={(e) => setSearch("")}
            >
              close
            </button>
          </div>
        </div>
      </nav>
    );
}


export default Navbar
