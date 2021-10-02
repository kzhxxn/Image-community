
import './App.css';
import React from "react";

import {BrowserRouter, Route} from "react-router-dom";
import {ConnectedRouter} from "connected-react-router";
import { history } from '../redux/configureStore';

import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PostWrite from '../pages/PostWrite';
import PostDetail from '../pages/PostDetail';

import Header from "../components/Header";
import {Grid} from "../elements";
import Permit from './Permit';

import {useDispatch} from "react-redux";
import {actionCreators as userActions} from "../redux/modules/user";

import {apiKey} from "./firebase";

function App() {

  const dispatch = useDispatch();
  //라이프사이클의 디드업데이트와 디드마운트를 동시에 수행하는 것이 유즈이펙트
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key)? true : false;
  
  React.useEffect(() => {
   
    if(is_session){
      dispatch(userActions.loginCheckFB());
      
    }
  }, []); //대괄호값이 비어있으면 디드마운트 역할은 한번 수행하고, 인수가있으면 합친다.
  return (
    <React.Fragment>
      <Grid>
        <Header></Header>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup}/>
          <Route path="/write" exact component={PostWrite}/>
          <Route path="/post/:id" exact component={PostDetail}/>
        </ConnectedRouter>
      </Grid>
      {/* <Permit>
        <div style={{backgroundColor: "#888", width:"50px", height:"50px"}}>
          글쓰기
          </div>
      </Permit> */}
    </React.Fragment>
    
  );
}

export default App;
