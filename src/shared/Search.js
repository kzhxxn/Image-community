// shared/Search.js
import React from "react";
import _ from "lodash"; // lodash 부르기

const Search = () => {

    const [text, setText] =React.useState("");

    const debounce = _.debounce((e) => {
        console.log(e.target.value);
    }, 1000);

    const throttle = _.throttle((e) => {
        console.log(e.target.value);
    }, 1000);

    const keyPress = React.useCallback(debounce, []);
   
    const onChange = (e) => {
       setText(e.target.value);
       keyPress(e);
      };

    

    // const onChange = (e) => {
    //     keyPress(e.target.value);
    //   };

    // const debounce = _.debounce((k) => console.log("디바운스! :::", k), 1000);
    // const keyPress = React.useCallback(debounce, []);
  
    // const throttle = _.throttle((k) => console.log("쓰로틀! :::", k), 1000);
    // const keyPress = React.useCallback(throttle, []);


  

  

  return (
    <div>
      <label>Search:</label>
      <input type = "text" onChange={onChange} />
    </div>
  );
};

export default Search;