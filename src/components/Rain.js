import React, { useCallback, useEffect } from 'react';
import p5 from 'p5'


class Rain extends React.Component{
    constructor() {
        super()
        this.myRef = React.createRef()
    }


    Sketch = (p) =>{
        let drops = []

        class Drop {
            constructor() {
                this.x = p.random(0, p.width);
                this.y = this.gety();
                this.yspeed = p.random(4, 10);
            };
        
            gety() {
                return p.random(-1, -500)
            }
        
            fall() {
                this.y = this.y + this.yspeed
                if (this.y > p.height) { this.y = this.gety() }
            };
            show() {
                p.stroke(138, 42, 226)
                p.line(this.x, this.y, this.x, this.y + 10)
            };
        }
        p.setup =()=>{
            let canvas = p.createCanvas(p.windowWidth, p.windowHeight)
            canvas.position(0, 0)
            canvas.style("z-index", "-1")
            canvas.parent('p5-sketch-container');
            
            for (let i = 0; i < p.windowWidth; i += 1) {
                drops[i] = new Drop()
            }
            
        }
        p.draw=()=>{
            p.background(230, 230, 250)
            for (let i = 0; i < drops.length; i += 1) {
                drops[i].fall()
                drops[i].show()
            }
            
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

export default Rain;

