import selfie from '../images/BostonHarborSelfie.MP.jpg'

function About() { 
    return(
        <div>
            <h2>
            Hello My name is Zach Johnson and I code.
            </h2>
            <img src={selfie} alt="Selfie of Zach overlooking the Boston Harbor Musuem"/>
            <h3>
                I am Litterally just typing in an h3 tag right now so I am not sure how much you would consider me a Front End Developer.<br/>
                But I love the Idea of building this portfolio as simple and with as much fun as possible.<br/>
                As this is my first ever React Project coming from the ground up and First time Self Hosting a Website,<br/>
                I am sure there will be a lot to figure out.<br/>

                But as for me I am a lot of things besides a "coder"<br/>
                I am a:
            </h3>
            <ul>
                <li>Reader</li>
                <li>Christian</li>
                <li>Plant Nerd</li>
                <li>Artist</li>
                <li>Skateboard Poser</li>
                <li>Unique Individual</li>
                <li>Hippy</li>
                <li>Writer</li>
            </ul>
        </div>
    )
}

export default About