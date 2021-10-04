import React from "react";
import {Grid, Text, Image} from "../elements";
import Card from "../components/Card";

const Notification = (props) => {
    let noti =[
        {user_name: "aaaaa", post_id: "post1", image_url: ""},
        {user_name: "aaaaa", post_id: "post1", image_url: ""},
        {user_name: "aaaaa", post_id: "post1", image_url: ""},
        {user_name: "aaaaa", post_id: "post1", image_url: ""},
        {user_name: "aaaaa", post_id: "post1", image_url: ""},
    ]
    return(
        <>
        <Grid padding = "16px" bg="#EFF6FF">
        {noti.map((n) => {
            return (
                <Card key={n.post_id} {...n}/>
            )
        })}
        </Grid>
        </>
    )
}

export default Notification;