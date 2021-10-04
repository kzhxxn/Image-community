import { createAction, handleActions } from "redux-actions"; 
import {produce} from "immer"; 
import { firestore, storage } from "../../shared/firebase";
import "moment";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

//액션생성
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";

const setPost = createAction(SET_POST, (post_list) => ({post_list}));
const addPost = createAction(ADD_POST, (post) => ({post}));
const editPost = createAction(EDIT_POST, (post_id, post) => ({post_id, post}));

//왜 포스트리스트가 아니고 리스트일까? 컴퍼넌트에서 데이터 가지고 올때 스테이트.포스트.리스트를 가져오기에 굳이 붙이지 않는다.
//리듀서가 사용할 이니셜 스테이트
const initialState = {
    list: [],
};

//게시글 하나에대한 기본정보
const initialPost = {
    id: 0,
    user_info: {
        user_name: "kzhxxn",
        user_profile: "https://images.unsplash.com/photo-1622126812734-35a1d6c46f22?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
      },
      image_url: "https://images.unsplash.com/photo-1622126812734-35a1d6c46f22?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
      contents: "",
      comment_cnt: 0,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, {history}) {

    if(!post_id){
      console.log("게시물 정보가 없어요!");
      return;
    }

    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex(p => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection("post");

    if(_image === _post.image_url){
      postDB.doc(post_id).update(post).then(doc => {
        dispatch(editPost(post_id, {...post}))
        history.replace("/");
      });
      return;
    }else{
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");
  
      _upload
        .then((snapshot) => {
          snapshot.ref
            .getDownloadURL()
            .then((url) => {
              // url을 확인해봐요!
              console.log(url);
              dispatch(imageActions.uploadImage(url));
              return url;
            })
            .then((url) => {
              postDB.doc(post_id).update({...post, image_url: url}).then(doc => {
                dispatch(editPost(post_id, {...post, image_url : url}))
                history.replace("/");
              })
            });
        })
        .catch((err) => {
                  window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log(err);
        });

    }

  }
}

//파이어스토어에 데이터 추가하기
const addPostFB = (contents = "") => {
    return function (dispatch, getState, { history }) {
      const postDB = firestore.collection("post");
  
      const _user = getState().user.user;
      const user_info = {
        user_name: _user.user_name,
        user_id: _user.uid,
        user_profile: _user.user_profile,
      };
  
      const _post = {
        ...initialPost,
        contents: contents,
        insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
      };
  
      // 잘 만들어졌나 확인해보세요!!
      console.log(_post);
  
      // getState()로 store의 상태값에 접근할 수 있어요!
      const _image = getState().image.preview;
  
      // 데이터가 어떤 타입인지 확인해봐요!
      console.log(typeof _image);
  
      // 파일 이름은 유저의 id와 현재 시간을 밀리초로 넣어줍시다! (혹시라도 중복이 생기지 않도록요!)
      const _upload = storage
        .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");
  
      _upload
        .then((snapshot) => {
          snapshot.ref
            .getDownloadURL()
            .then((url) => {
              // url을 확인해봐요!
              console.log(url);
              dispatch(imageActions.uploadImage(url));
              return url;
            })
            .then((url) => {
              // return으로 넘겨준 값이 잘 넘어왔나요? :)
              // 다시 콘솔로 확인해주기!
              console.log(url);
  
              postDB
                .add({ ...user_info, ..._post, image_url: url })
                .then((doc) => {
                  // 아이디를 추가해요!
                  let post = { user_info, ..._post, id: doc.id, image_url: url };
                  // 이제 리덕스에 넣어봅시다.
                  dispatch(addPost(post));
                  history.replace("/");
                })
                .catch((err) => {
                                  window.alert("앗! 포스트 작성에 문제가 있어요!");
                  console.log("post 작성 실패!", err);
                });
            });
        })
        .catch((err) => {
                  window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log(err);
        });
    };
  };




//파이어스토어에있는 데이터 가져오기
const getPostFB = () => {
    return function (dispatch, getState, {history}) {
        const postDB = firestore.collection("post");

        postDB.get().then((docs) => {
            let post_list = [];
            docs.forEach((doc) => {
                //doc.data는 파이어스토어에서 가지고 온 값
                let _post = doc.data();
                //['comment_cnt', 'contetn', ...] reduce 누산해주는 배열 내장함수, 키값만 뽑아서 배열로 만들기위해.
                let post = Object.keys(_post).reduce((acc, cur) => {

                    
                    //만약 cur에 키값에 유저언더바가 포함이 되? -1은 포함이 된다면을 의미
                    if(cur. indexOf("user_") !== -1) {
                        return {
                            ...acc, 
                            user_info: {...acc.user_info, [cur]: _post[cur]},
                        };
                    }
                    //cur이 comment_cnt'라면, 밸류값이 합산값, cur에 인수가 도는동안 밸류값이 값을 누산해준
                    return {...acc, [cur]: _post[cur]};
                },
              {id: doc.id, user_info: {}}
              );
                
              post_list.push(post);
            });
            console.log(post_list);

            dispatch(setPost(post_list));

        });
    };
};

//리듀서
export default handleActions (
    {
        [SET_POST]: (state, action) => produce(state, (draft)=> {
            draft.list = action.payload.post_list;
        }),
    
        [ADD_POST]: (state, action) => produce(state, (draft)=> {
            // unshift는 배열 맨 앞에 데이터를 넣어줘요!
         draft.list.unshift(action.payload.post);
            
        }),
        [EDIT_POST]: (state, action) => 
          produce(state, (draft) => {
          let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
          draft.list[idx] = {...draft.list[idx], ...action.payload.post}
        }),
    
    }, initialState
);

const actionCreators = {
    setPost,
    addPost,
    editPost,
    getPostFB,
    addPostFB,
    editPostFB,
}

export {actionCreators};