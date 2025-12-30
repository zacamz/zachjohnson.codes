import React, { useCallback, useEffect, useState } from 'react';
import p5 from 'p5'


class RandomWalk extends React.Component{
    constructor() {
        super()
        this.myRef = React.createRef()
    }
    
    
    Sketch = (p) =>{
        let walker
        let outcomeText
        
        class Walker {
            constructor() {
                this.probability = [.25,.25,.25,.25]
                this.x = p.width / 2;
                this.y = p.height / 2;
            };
        

            setProbability(newProb) {
                if (!Array.isArray(newProb) || newProb.length !== 4) return;
                const sum = newProb.reduce((a,b)=>a+b,0);
                if (sum <= 0) return;
                this.probability = newProb.map(v => v / sum); // normalize
    }
            step() {
                    const choice = Math.random(1);
                if (choice < (this.probability[0])) {
                this.x++;
                } else if (choice < (this.probability[0]+this.probability[1])) {
                this.x--;
                } else if (choice < (this.probability[0]+this.probability[1]+this.probability[2])) {
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

              let centerX = p.windowWidth / 2;
              let bottomY = p.windowHeight - 80; 
              let spacing = 40; 
              let upButton = p.createButton('▲');
                upButton.position(centerX - 15, bottomY - spacing);
                upButton.mousePressed(() => {
                    outcomeText = "Moving Up!";
                    if (walker) walker.setProbability([.2,.2,.2,.4])
                });

                // Down Button
                let downButton = p.createButton('▼');
                downButton.position(centerX - 15, bottomY);
                downButton.mousePressed(() => {
                    outcomeText = "Moving Down!";
                    if (walker) walker.setProbability([.2,.2,.4,.2])
                });

                // Left Button
                let leftButton = p.createButton('◄');
                leftButton.position(centerX - 15 - spacing, bottomY);
                leftButton.mousePressed(() => {
                    outcomeText = "Moving Left!";
                    if (walker) walker.setProbability([.2,.4,.2,.2]);
                });

                // Right Button
                let rightButton = p.createButton('►');
                rightButton.position(centerX - 15 + spacing, bottomY);
                rightButton.mousePressed(() => {
                    outcomeText = "Moving Right!";
                    if (walker) walker.setProbability([.4,.2,.2,.2]);
                });
                
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

