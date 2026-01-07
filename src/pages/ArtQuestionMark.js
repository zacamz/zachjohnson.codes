import React from "react"

import Gallery from "../components/Gallery"

function Art (){
    return(
        <div>
            <div>
                <h1>Art?</h1>
                <Gallery folder="../art"></Gallery>
            </div>

        </div>
    )
}

export default Art