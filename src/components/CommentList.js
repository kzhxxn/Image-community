import React from "react";
import { Button, Grid, Image, Input, Text, } from "../elements";

const CommentList = (props) => {
    return(
        <>
         <Grid padding="16px">
            <CommentItem />
            <CommentItem />
            <CommentItem />
            <CommentItem />
            <CommentItem />
         </Grid>
        </>
    )
}

export default CommentList;

const CommentItem = (props) => {
    const {user_prifile, user_name, user_id, post_id, insert_dt, contents} = props;
    return (
        <>
            <Grid is_flex>
                <Grid is_flex width="auto">
                    <Image shape="circle"/>
                    <Text bold>{user_name}</Text>    
                </Grid>
                <Grid is_flex margin="0px 10px">
                    <Text margin="0px">{contents}</Text>
                    <Text margin="0px">{insert_dt}</Text>
                </Grid>        
            </Grid>
        </>
    )
}

CommentItem.defaultProps = {
    user_prifile: "",
    user_name: "kzhxxn",
    user_id:"",
    post_id: 1,
    contents: "아무거나 일단 트러",
    insert_dt: '2021-01-01 19:00:00'
}