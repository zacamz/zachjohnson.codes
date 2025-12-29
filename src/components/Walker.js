import React, { useCallback, useEffect } from 'react';
import p5 from 'p5'



class RandomWalk extends React.Component{
    constructor() {
        super()
        this.myRef = React.createRef()
    }


    Sketch = (p) =>{
        let walker

        class Walker {
            constructor() {
                this.x = p.width / 2;
                this.y = p.height / 2;
            };
        
            step() {
                    const choice = Math.floor(Math.random() * 4);
                if (choice === 0) {
                this.x++;
                } else if (choice === 1) {
                this.x--;
                } else if (choice === 2) {
                this.y++;
                } else {
                this.y--;
                }
            };
            show() {
                p.stroke(0);
                p.strokeWeight(1);
                p.point(this.x, this.y)
            };
        }
        p.setup =()=>{
            let canvas = p.createCanvas(p.windowWidth, p.windowHeight)
            canvas.position(0, 0)
            canvas.style("z-index", "-1")
            walker = new Walker()
        }
        p.draw=()=>{
            walker.step()
            walker.show()
            
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

export default RandomWalk;

