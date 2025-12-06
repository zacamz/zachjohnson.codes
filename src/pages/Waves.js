import React, { useState, useEffect } from "react";
import WaveGif from '../components/Wave.js'



let URL = "https://api.swellcloud.net/v1/point?lat=30.680&lon=-81.429&model=gfs&vars=hs%2Ctp%2Cdp%2Css_hs%2Css_dp%2Cww_hs%2Cww_dp%2Cwndspd%2Cwnddir"

let swellRequest = new Headers()

const params = {
    method: 'GET',
    headers: swellRequest,
    redirect: 'follow',
};

swellRequest.append("X-API-KEY", "test_playground_key_12345")

function checkWaveHeight(data){
    if (data >= 5) {
        return "🔥"
    }
    else if (data >= 3 && data < 5){
        return "🌊"
    }   else{

        return"🤷‍♂️"
    }
        
}
function checkWavePeriod(data){
    if (data >= 14) {
        return "🔥"
    }
    else if (data >= 11 && data <13){
        return "👍👍"
    }
    else if (data >= 8 && data <=10){
        return "🌊"
    }   else{

        return"🤷‍♂️"
    }
        
}
function checkWaveDirection(data){

    if (data >= 40 && data <70){
        return "🔥"
    }
    else if (data >= 70 && data <=100){
        return "🌊"
    } 
        else if (data >= 0 && data <=10){
        return "👍"
    }   else{

        return"🤷‍♂️"
    }
        
}
function checkSecondarySwellDirection(data){

    if (data >= 40 && data <100){
        return "🔥"
    }

        return"🤷‍♂️"
    
        
}
function checkSecondarySwellHeight(data){

    if (data >= 1 ){
        return "🔥"
    }

        return"🤷‍♂️"
        
}
function checkWindWaveHeight(data){

    if (data <= 1 ){
        return "🔥"
    }

        return"🪓👎"
        
}
function checkWindWaveDirection(data){

    if (data >= 225 && data <325){
        return "🔥"
    }
    else if ((data >= 326 && data <=359)||(data >= 0 && data <=45)){
        return "🌊"
    } 
    else{

        return"👎"
    }
        
}
function checkWindSpeed(data){

    if (data <=8){
        return "🔥"
    }

        return"👎"
    
        
}

let loading = {data: [
    {
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/640px-Question_mark_%28black%29.svg.png",
        "answer": "undecided",
        "hs": ""
    }
]
}

function getWindDirection(degrees) {
  // Normalize degrees to be between 0 and 360
  let normalizedDegrees = (degrees % 360 + 360) % 360;

  const directions = [
    "North", "North-Northeast", "Northeast", "East-Northeast",
    "East", "East-Southeast", "Southeast", "South-Southeast",
    "South", "South-Southwest", "Southwest", "West-Southwest",
    "West", "West-Northwest", "Northwest", "North-Northwest"
  ];

  // Each direction covers 22.5 degrees (360 / 16)
  // We add 11.25 to shift the boundaries so that, for example,
  // North covers 348.75 to 11.25 degrees.
  const index = Math.floor((normalizedDegrees + 11.25) / 22.5);

  return directions[index % 16]; // Use modulo 16 to handle the wrap-around for North
}



function ShoreCheck() {
    
    
    let swellCloudAPICall = async () => {
        setIsLoading(true);
        try{
            setAnswer(loading)
            let data = await fetch(URL, params)
            let json = await data.json();
            setAnswer(json)
            return json;
        }catch(error){
            console.error("Error fetching data:", error);
            setIsLoading(false);
            setAnswer({data: [{hs: "Error Fetching Data"}]})
            return;
        }finally{
            setIsLoading(false);             
        }
        
    }
    let [isLoading, setIsLoading] = useState(false);
    let [answer, setAnswer] = useState(loading)

    let results = `Wave Height: ${answer.data[0].hs} 
    Wave Period: ${answer.data[0].tp}
    Wave Direction: ${answer.data[0].dp}
    `

    return (
        <div>

            <button onClick={()=> swellCloudAPICall()}>Check the Shore, Grom!</button>
            
            <div>
                {isLoading ? (
                    <WaveGif/>
                ) : (
                    <div>
                        <h2>What the waves are looking like at Fernandina Beach Access #11N E 8th Street Access:</h2>
                        <h3>{checkWaveHeight(answer.data[0].hs)}Wave Height: {answer.data[0].hs} ft</h3>
                        <h3>{checkWavePeriod(answer.data[0].tp)}Wave Period: {answer.data[0].tp}s</h3>
                        <h3>{checkWaveDirection(answer.data[0].dp)}Wave Direction: {answer.data[0].dp}° {getWindDirection(answer.data[0].dp)}</h3>
                        <h3>{checkSecondarySwellHeight(answer.data[0].ss_hs)}Secondary Swell Height: {answer.data[0].ss_hs}ft</h3>
                        <h3>{checkSecondarySwellDirection(answer.data[0].ss_dp)}Secondary Swell Direction: {answer.data[0].ss_dp}° {getWindDirection(answer.data[0].ss_dp)}</h3>
                        <h3>{checkWindWaveHeight(answer.data[0].ww_hs)}Wind Wave Height: {answer.data[0].ww_hs} ft</h3>
                        <h3>{checkWindWaveDirection(answer.data[0].ww_dp)}Wind Wave Direction: {answer.data[0].ww_dp}° {getWindDirection(answer.data[0].ww_dp)} </h3>
                        <h3>{checkWindSpeed(answer.data[0].wndspd)}Wind Speed: {answer.data[0].wndspd} mph</h3>
                        <h3>{checkWindWaveDirection(answer.data[0].wnddir)}Wind Direction: {answer.data[0].wnddir}° {getWindDirection(answer.data[0].wnddir)}</h3>
                        <h3><a href="https://www.seasideameliainn.com/beach-cam/">Cool Webcam of Fernandina Beach</a></h3>
                    </div>
                )}
            </div>



        </div>
    )

}


export default ShoreCheck