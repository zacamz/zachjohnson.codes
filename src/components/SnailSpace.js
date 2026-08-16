import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const ASSET_BASE = `${process.env.PUBLIC_URL}/art/Snail`;
const STAR_FILES = ['Star1.png', 'Star2.png', 'Star3.png', 'Star4.png', 'Star5.png'];

const PAPER = [252, 250, 244];

const INITIAL_DRIFTERS = 26;
const MAX_DRIFTERS = 60;
const SPAWN_MIN = 4;
const SPAWN_MAX = 10;
const PLANET_CHANCE = 0.12;

const SNAIL_SPEED = 20;
const EASE_RADIUS = 90;

function SnailSpace() {
    const hostRef = useRef(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return undefined;

        let disposed = false;

        const sketch = (p) => {
            let stars = [];
            let planet = null;
            let snailImg = null;
            let wordsImg = null;

            let drifters = [];
            let spawnTimer = SPAWN_MIN;
            let snail = null;
            let ready = false;
            let failed = false;

            // Every layer was exported at the full 1512x947 page size, so each one is
            // mostly empty space. Trimming to the inked area lets a sprite be scaled and
            // rotated about its own center instead of the original page's center.
            const trim = (img) => {
                img.loadPixels();
                const w = img.width;
                const h = img.height;
                const px = img.pixels;
                let minX = w;
                let minY = h;
                let maxX = -1;
                let maxY = -1;

                for (let y = 0; y < h; y += 1) {
                    const row = y * w * 4;
                    for (let x = 0; x < w; x += 1) {
                        if (px[row + x * 4 + 3] > 8) {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }

                if (maxX < 0) return img;
                return img.get(minX, minY, maxX - minX + 1, maxY - minY + 1);
            };

            // The canvas is fixed to the viewport so the starfield runs behind the header.
            // clientWidth/Height rather than innerWidth/Height so a scrollbar can't feed
            // back into the size and grow the page on every resize.
            const viewW = () => document.documentElement.clientWidth;
            const viewH = () => document.documentElement.clientHeight;

            const snailWidth = () => p.constrain(p.width * 0.28, 190, 360);

            const makeDrifter = (x) => {
                const usePlanet = planet && p.random() < PLANET_CHANCE;
                const sprite = usePlanet ? planet : stars[Math.floor(p.random(stars.length))];
                // 0 is far off in the distance, 1 is close enough to read clearly.
                const depth = p.random();
                // Squaring biases the field toward small specks, which sells the distance.
                const w = usePlanet ? p.lerp(16, 64, depth * depth) : p.lerp(7, 30, depth * depth);

                return {
                    sprite,
                    x,
                    y: p.random(p.height * 0.04, p.height * 0.94),
                    w,
                    h: w * (sprite.height / sprite.width),
                    speed: p.lerp(1.6, 11, depth),
                    alpha: p.lerp(45, 165, depth),
                    angle: usePlanet ? p.random(-0.35, 0.35) : p.random(p.TWO_PI),
                };
            };

            const updateDrifters = (dt) => {
                for (const d of drifters) {
                    d.x -= d.speed * dt;
                }
                drifters = drifters.filter((d) => d.x + d.w > -20);

                spawnTimer -= dt;
                if (spawnTimer <= 0) {
                    spawnTimer = p.random(SPAWN_MIN, SPAWN_MAX);
                    if (drifters.length < MAX_DRIFTERS) {
                        drifters.push(makeDrifter(p.width + p.random(20, 120)));
                    }
                }
            };

            const updateSnail = (dt) => {
                const dx = snail.tx - snail.x;
                const dy = snail.ty - snail.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 0.5) {
                    const ease = dist < EASE_RADIUS ? Math.max(0.12, dist / EASE_RADIUS) : 1;
                    const step = Math.min(SNAIL_SPEED * ease * dt, dist);
                    snail.x += (dx / dist) * step;
                    snail.y += (dy / dist) * step;
                }

                snail.facing += (snail.facingTarget - snail.facing) * Math.min(1, dt * 1.6);
            };

            const drawDrifter = (d) => {
                p.push();
                p.translate(d.x, d.y);
                p.rotate(d.angle);
                p.tint(255, d.alpha);
                p.image(d.sprite, 0, 0, d.w, d.h);
                p.pop();
            };

            const drawSnail = () => {
                p.push();
                p.translate(snail.x, snail.y);
                // Passing through zero as it flips reads as the snail turning around.
                p.scale(snail.facing, 1);
                p.image(snailImg, 0, 0, snail.w, snail.h);
                p.pop();
            };

            const drawWords = () => {
                const w = p.constrain(p.width * 0.34, 220, 420);
                const h = w * (wordsImg.height / wordsImg.width);
                p.image(wordsImg, p.width / 2, p.height - h / 2 - 24, w, h);
            };

            const aimAt = (x, y) => {
                if (!ready) return;
                // Keep the whole snail in frame rather than letting it clip off an edge.
                const tx = p.constrain(x, snail.w / 2, p.width - snail.w / 2);
                const ty = p.constrain(y, snail.h / 2, p.height - snail.h / 2);
                if (Math.abs(tx - snail.x) > 8) {
                    snail.facingTarget = tx < snail.x ? -1 : 1;
                }
                snail.tx = tx;
                snail.ty = ty;
            };

            p.setup = async () => {
                if (disposed) return;

                const cnv = p.createCanvas(viewW(), viewH());
                p.imageMode(p.CENTER);
                p.background(...PAPER);

                // p5 2.x routes touch through the same pointer-backed mouse events.
                cnv.mousePressed(() => aimAt(p.mouseX, p.mouseY));

                try {
                    const loaded = await Promise.all([
                        p.loadImage(`${ASSET_BASE}/Snail.png`),
                        p.loadImage(`${ASSET_BASE}/Words.png`),
                        p.loadImage(`${ASSET_BASE}/Planet.png`),
                        ...STAR_FILES.map((f) => p.loadImage(`${ASSET_BASE}/${f}`)),
                    ]);

                    snailImg = trim(loaded[0]);
                    wordsImg = trim(loaded[1]);
                    planet = trim(loaded[2]);
                    stars = loaded.slice(3).map(trim);
                } catch (err) {
                    failed = true;
                    return;
                }

                if (disposed) return;

                const w = snailWidth();
                snail = {
                    x: p.width / 2,
                    y: p.height / 2,
                    tx: p.width / 2,
                    ty: p.height / 2,
                    w,
                    h: w * (snailImg.height / snailImg.width),
                    facing: 1,
                    facingTarget: 1,
                };

                for (let i = 0; i < INITIAL_DRIFTERS; i += 1) {
                    drifters.push(makeDrifter(p.random(-10, p.width)));
                }

                ready = true;
            };

            p.draw = () => {
                if (disposed) {
                    p.noLoop();
                    return;
                }

                p.background(...PAPER);

                if (failed) {
                    p.push();
                    p.noStroke();
                    p.fill(120);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.textSize(14);
                    p.text('The drawing could not be loaded.', p.width / 2, p.height / 2);
                    p.pop();
                    return;
                }
                if (!ready) return;

                // Clamped so a backgrounded tab doesn't teleport everything on return.
                const dt = Math.min(p.deltaTime / 1000, 0.1);

                updateDrifters(dt);
                updateSnail(dt);

                drifters.forEach(drawDrifter);
                drawSnail();
                drawWords();
            };

            p.windowResized = () => {
                const prevW = p.width;
                const prevH = p.height;
                p.resizeCanvas(viewW(), viewH());
                if (!ready || prevW === 0 || prevH === 0) return;

                const kx = p.width / prevW;
                const ky = p.height / prevH;

                for (const d of drifters) {
                    d.x *= kx;
                    d.y *= ky;
                }

                snail.x *= kx;
                snail.y *= ky;
                snail.tx *= kx;
                snail.ty *= ky;
                snail.w = snailWidth();
                snail.h = snail.w * (snailImg.height / snailImg.width);
            };
        };

        // p5 runs setup asynchronously, so an instance can still append its canvas long
        // after React has torn the effect down. Giving each instance its own mount means
        // detaching that node is enough to keep a discarded sketch off the page, which
        // StrictMode's double mount would otherwise leave stacked behind the live one.
        const mount = document.createElement('div');
        host.appendChild(mount);

        const instance = new p5(sketch, mount);
        return () => {
            disposed = true;
            try {
                instance.remove();
            } catch (err) {
                // remove() can throw when setup has not finished running yet.
            }
            mount.remove();
        };
    }, []);

    return <div className="SnailSpace" ref={hostRef}></div>;
}

export default SnailSpace;
