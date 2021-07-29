import React, {useEffect, createContext, useReducer, useContext} from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/screens/Home'
import Signin from './components/screens/SignIn'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import {reducer, initialState} from "./reducers/userReducer"

import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribedUserPosts'

export const UserContext = createContext()

const Routing = () => {

  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))


    if(user) {
      dispatch({type:"USER", payload:user})
    } else {
      history.push("/signin")
    }
  }, [])

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/signin">
        <Signin />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/create">
        <CreatePost />
      </Route>
      <Route exact path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route exact path="/myfollowingpost">
        <SubscribedUserPosts />
      </Route>
    </Switch>
  );
}

const App = () => {
  
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state, dispatch}}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
