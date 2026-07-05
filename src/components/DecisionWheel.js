import React, { useRef, useState, useCallback, useEffect } from "react";
import { activities } from "../data/activities";

const FRICTION = 0.985;
const STOP_THRESHOLD = 0.02;
const COLORS = [
  "#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c",
  "#e67e22", "#34495e", "#16a085", "#c0392b", "#8e44ad",
];
const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = SIZE / 2 - 4;

function polarToCartesian(angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + RADIUS * Math.cos(rad), y: CY + RADIUS * Math.sin(rad) };
}

function describeSlice(startAngle, endAngle) {
  const start = polarToCartesian(endAngle);
  const end = polarToCartesian(startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${CX} ${CY} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function getAngleFromCenter(clientX, clientY, rect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

function computeWinner(rotation) {
  const sliceAngle = 360 / activities.length;
  const normalized = ((rotation % 360) + 360) % 360;
  // Pointer is fixed at top; clockwise rotation moves wheel content clockwise,
  // so the slice under the pointer is at wheel-local angle (360 - rotation).
  const angleUnderPointer = (360 - normalized) % 360;
  const index = Math.floor(angleUnderPointer / sliceAngle) % activities.length;
  return activities[index];
}

function DecisionWheel() {
  const wheelRef = useRef(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef(null);
  const lastFrameTimeRef = useRef(null);
  const dragStartRef = useRef({ angle: 0, rotation: 0 });
  const velocitySamplesRef = useRef([]);
  const isDraggingRef = useRef(false);

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const sliceAngle = 360 / activities.length;

  const stopPhysics = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastFrameTimeRef.current = null;
  }, []);

  const finishSpin = useCallback(() => {
    velocityRef.current = 0;
    setIsSpinning(false);
    const result = computeWinner(rotationRef.current);
    setWinner(result);
    setShowResult(true);
  }, []);

  const physicsTick = useCallback(
    (timestamp) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
        rafRef.current = requestAnimationFrame(physicsTick);
        return;
      }

      const deltaMs = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      if (deltaMs > 0 && deltaMs < 100) {
        rotationRef.current += velocityRef.current * deltaMs;
        velocityRef.current *= Math.pow(FRICTION, deltaMs / 16);
        setRotation(rotationRef.current);
      }

      if (Math.abs(velocityRef.current) > STOP_THRESHOLD) {
        rafRef.current = requestAnimationFrame(physicsTick);
      } else {
        stopPhysics();
        finishSpin();
      }
    },
    [stopPhysics, finishSpin]
  );

  const startPhysics = useCallback(() => {
    stopPhysics();
    setIsSpinning(true);
    setShowResult(false);
    setWinner(null);
    lastFrameTimeRef.current = null;
    rafRef.current = requestAnimationFrame(physicsTick);
  }, [stopPhysics, physicsTick]);

  const handlePointerDown = useCallback(
    (e) => {
      if (isSpinning) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      const rect = wheelRef.current.getBoundingClientRect();
      dragStartRef.current = {
        angle: getAngleFromCenter(e.clientX, e.clientY, rect),
        rotation: rotationRef.current,
      };
      velocitySamplesRef.current = [
        { rotation: rotationRef.current, time: performance.now() },
      ];
      isDraggingRef.current = true;
      setIsDragging(true);
      setShowResult(false);
      setWinner(null);
      stopPhysics();
    },
    [isSpinning, stopPhysics]
  );

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const currentAngle = getAngleFromCenter(e.clientX, e.clientY, rect);
    const delta = currentAngle - dragStartRef.current.angle;
    const newRotation = dragStartRef.current.rotation + delta;
    rotationRef.current = newRotation;
    setRotation(newRotation);

    const now = performance.now();
    velocitySamplesRef.current.push({ rotation: newRotation, time: now });
    if (velocitySamplesRef.current.length > 6) {
      velocitySamplesRef.current.shift();
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const samples = velocitySamplesRef.current;
    velocitySamplesRef.current = [];

    if (samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = last.time - first.time;
      if (dt > 0) {
        velocityRef.current = (last.rotation - first.rotation) / dt;
      }
    }

    if (Math.abs(velocityRef.current) > STOP_THRESHOLD) {
      startPhysics();
    } else {
      velocityRef.current = 0;
      const result = computeWinner(rotationRef.current);
      setWinner(result);
      setShowResult(true);
    }
  }, [startPhysics]);

  const handleSpinClick = useCallback(() => {
    if (isSpinning || isDragging) return;
    const direction = Math.random() < 0.5 ? -1 : 1;
    velocityRef.current = direction * (1.2 + Math.random() * 0.8);
    startPhysics();
  }, [isSpinning, isDragging, startPhysics]);

  useEffect(() => {
    return () => stopPhysics();
  }, [stopPhysics]);

  const segments = activities.map((label, i) => {
    const startAngle = i * sliceAngle;
    const endAngle = (i + 1) * sliceAngle;
    const midAngle = startAngle + sliceAngle / 2;
    const labelRadius = RADIUS * 0.62;

    const labelRad = ((midAngle - 90) * Math.PI) / 180;
    const labelX = CX + labelRadius * Math.cos(labelRad);
    const labelY = CY + labelRadius * Math.sin(labelRad);

    return (
      <g key={label}>
        <path
          d={describeSlice(startAngle, endAngle)}
          fill={COLORS[i % COLORS.length]}
          stroke="#fff"
          strokeWidth="2"
        />
        <text
          x={labelX}
          y={labelY}
          fill="#fff"
          fontSize={label.length > 12 ? 9 : label.length > 9 ? 10 : 12}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${midAngle}, ${labelX}, ${labelY})`}
        >
          {label}
        </text>
      </g>
    );
  });

  return (
    <div className="decision-wheel">
      <div className="wheel-pointer" aria-hidden="true" />
      <div
        ref={wheelRef}
        className={`wheel-container${isDragging ? " dragging" : ""}${isSpinning ? " spinning" : ""}`}
        style={{ transform: `rotate(${rotation}deg)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width="100%"
          height="100%"
          aria-label="Activity decision wheel"
        >
          {segments}
          <circle cx={CX} cy={CY} r={18} fill="#333" stroke="#fff" strokeWidth="3" />
        </svg>
      </div>

      <button
        className="wheel-spin-btn"
        onClick={handleSpinClick}
        disabled={isSpinning || isDragging}
      >
        Spin
      </button>

      {showResult && winner && (
        <p className={`wheel-result${showResult ? " visible" : ""}`}>
          → {winner}! ←
        </p>
      )}
    </div>
  );
}

export default DecisionWheel;
