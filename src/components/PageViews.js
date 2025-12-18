import React from "react";



function ProjectPreview ({imgSrc}){

    return(
        <div className="ProjectPreview">

        <img src={imgSrc} alt="Screenshot of Portfolio Piece"/>

        </div>
    )
}

export default ProjectPreview