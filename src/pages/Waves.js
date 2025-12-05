import React, { useState } from "react";

let URL = "https://api.swellcloud.net/v1/point?lat=30.680&lon=-81.429&model=gfs&vars=hs%2Ctp%2Cdp%2Css_hs%2Css_dp%2Cww_hs%2Cww_dp%2Cwndspd%2Cwnddir"

let swellRequest = new Headers()

const params = {
    method: 'GET',
    headers: swellRequest,
    redirect: 'follow',
};

swellRequest.append("X-API-KEY", "test_playground_key_12345")



let loading = {data: [
    {
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/640px-Question_mark_%28black%29.svg.png",
        "answer": "undecided",
        "hs": 0
    }
    ]
}


function ShoreCheck() {
    
    let swellCloudAPICall = async () => {
        setAnswer(loading)
        console.log(params)
        let data = await fetch(URL, params)
        console.log(fetch(URL, params))
        
        let json = await data.json();
        console.log(json)
    
        setAnswer(json)
        return json
    
    }
    let [answer, setAnswer] = useState(loading)


    return (
        <div>

            <button onClick={()=> swellCloudAPICall()}>Check the Shore, Grom!</button>
            
            <h2>Wave Height {answer.data[0].hs}</h2>


        </div>
    )

}


export default ShoreCheck