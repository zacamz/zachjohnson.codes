import React from "react"

import Gallery from "../components/Gallery"

function Art (){
    return(
        <div>
            <div>
                <h1>Art?</h1>
                <Gallery
                    folder="../art"
                    links={{
                        "08102026.png": { to: "/GoingPlaces", label: "Set this one adrift →" },
                    }}
                ></Gallery>
            </div>

        </div>
    )
}

export default Art