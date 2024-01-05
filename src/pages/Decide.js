import React, { useState } from "react";

let URL = "https://yesno.wtf/api"


let loading = {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/640px-Question_mark_%28black%29.svg.png",
    "answer": "undecided"
}


function Decide() {
    
    let yesNoAPICall = async () => {
        setAnswer(loading)
        let data = await fetch(URL)
    
        let json = await data.json();
    
        setAnswer(json)
        return json
    
    }
    let [answer, setAnswer] = useState(loading)


    return (
        <div>

            <button onClick={()=> yesNoAPICall()}>Decide</button>
            <img src={`${answer.image}`} alt={answer.answer} />
            <h2>{answer.answer}</h2>


        </div>
    )

}


export default Decide