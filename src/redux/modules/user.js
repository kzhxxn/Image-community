import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";

import { auth } from "../../shared/firebase"
import firebase from "firebase/app";

//액션타입
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SER_USER";

//액션생성함수

const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));
//리덕스 액션 임포트 하기 이전에 만들었던 액션생성함수.
//const logIn = (user) => {
//     return {
//         type: LOG_IN,
//         user
//     }
// }

//initialState
const initialState = {
    user: null,
    is_login: false,
  };



//middleware actions

const loginFB = (id, pwd) => {
    return function (dispatch, getState, { history }) {
      auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res) => {
        auth
          .signInWithEmailAndPassword(id, pwd)
          .then((user) => {
            console.log(user);
  
            dispatch(
              setUser({
                user_name: user.user.displayName,
                id: id,
                user_profile: "",
                uid: user.user.uid,
              })
            );
  
            history.push("/");
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
  
            console.log(errorCode, errorMessage);
          });
      });
    };
  };
    
    
// const loginAction = (user) => {
//     return function (dispatch, getState, {history}){
//         console.log(history);
//         dispatch(setUser(user));
//         history.push('/')
//     }
// }

const signupFB = (id, pwd, user_name) => {
    return function (dispatch, getState, {history}){

        auth
        .createUserWithEmailAndPassword(id, pwd)
        .then((user) => {
            console.log(user);

            auth.currentUser
                .updateProfile({
                displayName: user_name,
            })
            .then(()=>{
                dispatch(
                    setUser({user_name: user_name, id:id, user_profile:"",uid: user.user.uid}))
                history.push('/')
            }).catch((error)=> {
                console.log(error);
            })
        
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode,errorMessage)
            // ..
  });

    }
}

const loginCheckFB = () => {
    return function (dispatch, getState, {history}){
     auth.onAuthStateChanged((user)=>{
         if(user){
             dispatch(
                 setUser({
             user_name: user.displayName,
             user_profile: "",
             id: user.email,
             uid: user.uid,
             
                })
            );
        }else {
            dispatch(logOut());
        }
     })
 }
}

const logoutFB = () => {
    return function (dispatch, getState, {history}) {
        auth.signOut().then(()=> {
            dispatch(logOut());
            history.replace('/');
        });
    };
};

//리듀서
export default handleActions(
    {
      [SET_USER]: (state, action) =>
        produce(state, (draft) => {
          setCookie("is_login", "success");
          ///payload안에 우리가 바꾼 데이터가 들어있다.
          draft.user = action.payload.user;
                  draft.is_login = true;
        }),
          [LOG_OUT]: (state, action) =>
        produce(state, (draft) => {
          deleteCookie("is_login");
          draft.user = null;
        draft.is_login = false;
        }),
      [GET_USER]: (state, action) => produce(state, (draft) => {}),
    },
    initialState
  );


//리덕스 액션 임포트 하기 이전에 만들었던 액션생성함수로 리듀서 작업시
//const reducer = (state={}, action={} =>{
//     switch(actions.type){
//         case "LOG_IN" : {
//             state.user = action.user;
//         }
//     }
// }

//actionCreators 내보내기
const actionCreators = {
    getUser,
    logOut,
    loginFB,
    signupFB,
    loginCheckFB,
    logoutFB,
  };
  
  export { actionCreators };