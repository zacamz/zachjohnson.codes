import React, { useCallback, useEffect } from 'react';
import p5 from 'p5'


class ExampleTitle extends React.Component{
    constructor() {
        super()
        this.myRef = React.createRef()
    }


    Sketch = (p) =>{

        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
}

        p.setup =()=>{
            let canvas = p.createCanvas(p.windowWidth, p.windowHeight)
            canvas.position(0, 0)
            canvas.style("z-index", "-1")
            canvas.parent('p5-sketch-container');
            
        }
        p.draw=()=>{
            p.fill(0,25)
            p.stroke(0,50)
            p.circle(getRandomInt(p.width),getRandomInt(p.height),16)
            
        }
}
componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current)
}

componentDidUpdate() {
    this.myP5.remove()
    this.myP5 = new p5(this.Sketch, this.myRef.current)
}

componentWillUnmount() {
    this.myP5.remove()
}


render(){
    
    return (
        
        <div>
            <div id="p5-sketch-container" ref={this.myRef}></div>

        </div>
    )
    
}
}

export default ExampleTitle;