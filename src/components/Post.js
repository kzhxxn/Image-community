import React from "react";
import {Grid, Image, Text, Button} from "../elements";
import { history } from "../redux/configureStore";

const Post = (props) => {

    return (
      <React.Fragment>
        <Grid>
          <Grid is_flex padding="16px">
            <Grid is_flex width="auto">
              <Image shape="circle" src={props.src} />
              <Text bold>{props.user_info.user_name}</Text>
            </Grid>
            <Grid is_flex width="auto">
              <Text>{props.insert_dt}</Text>
              {props.is_me && <Button width="auto" margin="4px" padding="4px" _onClick={()=> {
                history.push(`/write/${props.id}`)}}>
                수정
                </Button>}
            </Grid>
          </Grid>
          <Grid padding="16px">
            <Text>{props.contents}</Text>
          </Grid>
          <Grid>
            <Image shape="rectangle" src={props.image_url} />
          </Grid>
          <Grid padding="16px">
            <Text margin="0px" bold>댓글 {props.comment_cnt}개</Text>
          </Grid>
        </Grid>
      </React.Fragment>
    );
}

Post.defaultProps = {
  user_info: {
    user_name: "kzhxxn",
    user_profile: "https://images.unsplash.com/photo-1622126812734-35a1d6c46f22?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  },
  image_url: "https://images.unsplash.com/photo-1622126812734-35a1d6c46f22?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  contents: "책이네요!",
  comment_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
  is_me : false,
};

export default Post;