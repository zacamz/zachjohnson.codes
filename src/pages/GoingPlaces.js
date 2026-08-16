import React from "react"
import { Link } from "react-router-dom"

import SnailSpace from "../components/SnailSpace"
import "./GoingPlaces.css"

function GoingPlaces() {
    return (
        <div className="GoingPlaces">
            <p className="GoingPlaces-back">
                <Link to="/ArtQuestionMark?file=08102026.png">back to the drawing</Link>
            </p>
            <SnailSpace />
        </div>
    )
}

export default GoingPlaces
