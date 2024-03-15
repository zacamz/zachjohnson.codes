import React, { useCallback, useEffect } from 'react';
import p5 from 'p5'

let drops = []

class Drop {
    constructor() {
        this.x = random(0, width)
        this.y = this.gety(),
            this.yspeed = random(4, 10)
    };

    gety() {
        return random(-1, -500)
    }

    fall() {
        this.y = this.y + this.yspeed
        if (this.y > height) { this.y = this.gety() }
    };
    show() {
        stroke(138, 42, 226)
        line(this.x, this.y, this.x, this.y + 10)
    };
}
const RainSketch = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/p5@1.9.1/lib/p5.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (

        <div>
            <div id="p5-sketch-container"></div>

        </div>
    )

}
export default RainSketch;
const setup=()=> {
    let canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style("z-index", "-1")
    canvas.parent('p5-sketch-container');

    for (let i = 0; i < windowWidth; i += 1) {
        drops[i] = new Drop()
    }
};
const draw = useCallback(p5) => {

    background(230, 230, 250)
    for (let i = 0; i < drops.length; i += 1) {
        drops[i].fall()
        drops[i].show()
    }

}

