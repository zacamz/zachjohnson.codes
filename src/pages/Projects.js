import React from "react"
import ProjectPreview from "../components/ProjectPreview.js"
import jepoardy from "../images/Jepoardy.jpg"
function Projects (){
    return(
        <div>
            <h2>
                Want to see some of the projects I have been working on?
            </h2>
             {/* <img src={jepoardy}></img> */}
             <ProjectPreview
             imgSrc={jepoardy}
             >

             </ProjectPreview>

        </div>
    )
}

export default Projects