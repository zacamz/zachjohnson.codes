import React from "react"
import { Link } from "react-router-dom"
import Emoji from "./Emoji"

const Header = () =>{

    return(
        <div className="Header">
            <h1>Zach Codes 
                <Link to="/About"> ? </Link>   
                <Link to="/Resume"> . </Link> 
                <Link to="/Projects" > ! </Link> 
                <Link to="/Links"> @ </Link> 
                <Link to="/Blog"> * </Link> 
                <Link to="/Waves"><Emoji symbol="🌊" label="water-wave"/></Link>
                <Link to="/Decide"><Emoji symbol="🤔" label="water-wave"/></Link>
            </h1>
        </div>
    )
}

export default Header