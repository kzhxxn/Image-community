// PostList.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post";
import { actionCreators as postActions } from "../redux/modules/post";

const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user);
    //포스트리스트가 잘 넘어오는지 확인!
    console.log(post_list);

    //한번만 파이어베이스에 요청하려면? 빈배열이 들어가야 한번만 호출
    React.useEffect(() => {
        if(post_list.length === 0){
            dispatch(postActions.getPostFB());
        }
        
    }, []);
    return (
        <React.Fragment>
            {/* 맴돌리려면 무족건 키값입력 */}
            {post_list.map((p, idx)=> {
                if(p.user_info.user_id === user_info?.uid) {
                    return <Post key={p.id} {...p} is_me/>;
                } else {
                    return <Post key={p.id} {...p} />
                }
            })}
        </React.Fragment>
    )
}

export default PostList;

