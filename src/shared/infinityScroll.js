import React from "react";
import _ from "lodash";
import { Spinner } from "../elements";

const InfinityScroll = (props) => {

    const { children, callNext, is_next, loading } = props;

     // 쓰로틀을 적용합시다!
    const _handleScroll = _.throttle(() => { 
        
        if(loading){
            return;
        }

        const { innerHeight } = window;
        const {scrollHeight} = document.body;

        //스크롤 계산하기 
        //도큐먼트 아래에 도큐먼트엘리먼트가 있니? 있으면 스크롤탑을 가지고와 || 만약 값을 가지고 올수 없으면 바디에 스크로탑을 가지고와
        //브라우저마다 호환성이 다르기때문에

        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop

        if(scrollHeight - innerHeight - scrollTop < 200) {
            callNext();
        }
    }, 300);

    const handleScroll = React.useCallback(_handleScroll, [loading]);
    
    React.useEffect(() => {

        if(loading) {
            return;
        }
        if(is_next) {
            window.addEventListener("scroll", handleScroll);
        }else{
            window.removeEventListener("scroll", handleScroll);
        }
        return () => window.addEventListener("scroll", handleScroll);
    }, [is_next, loading]);

    return (
         <>
        {props.children}
        {is_next && (<Spinner/>)}  
        </>

    )
}
InfinityScroll.defaultProps = {
    children : null,
    calNext: () => {},
    is_next : false,
    loading : false,
}
export default InfinityScroll;