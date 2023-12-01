import { Link } from "react-router-dom"


function Links () {
    return(
        <div>
            <h2>
                Here is a list of links to my Social Media Platforms
            </h2>
            <Link to="https://www.instagram.com/zachtheposer/">Instagram</Link> 
            <Link to="https://www.goodreads.com/user/show/12059807-zachary-johnson">goodreads</Link>
            <Link to="https://www.codewars.com/users/zacamz">codewars</Link>
            <Link to="https://www.youtube.com/channel/UCNG-ZB5RUAS7_PX-VrTMXlg">youtube</Link>
            <Link to="https://twitter.com/whatittou">X</Link>
            <Link to="https://steamcommunity.com/profiles/76561198037080487/">steam</Link>
        </div>
    )
}

export default Links