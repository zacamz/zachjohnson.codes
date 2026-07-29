import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GUITAR_STRINGS,
  centsFromTarget,
  detectPitch,
  frequencyToNote,
  nearestGuitarString,
} from "../utils/pitch";
import "./Tuner.css";

const IN_TUNE_CENTS = 5;
const GAUGE_RANGE = 50;

function Tuner() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [selectedString, setSelectedString] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const bufferRef = useRef(null);
  const smoothingRef = useRef([]);

  const stopListening = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    bufferRef.current = null;
    smoothingRef.current = [];
    setListening(false);
    setFrequency(null);
  }, []);

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    const ctx = audioContextRef.current;
    if (!analyser || !ctx || !bufferRef.current) return;

    analyser.getFloatTimeDomainData(bufferRef.current);
    const detected = detectPitch(bufferRef.current, ctx.sampleRate);

    if (detected) {
      const next = [...smoothingRef.current, detected].slice(-5);
      smoothingRef.current = next;
      const avg = next.reduce((a, b) => a + b, 0) / next.length;
      setFrequency(avg);
    } else if (smoothingRef.current.length > 0) {
      const next = smoothingRef.current.slice(1);
      smoothingRef.current = next;
      setFrequency(
        next.length
          ? next.reduce((a, b) => a + b, 0) / next.length
          : null
      );
    } else {
      setFrequency(null);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;
      if (ctx.state === "suspended") await ctx.resume();

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      bufferRef.current = new Float32Array(analyser.fftSize);

      setListening(true);
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      setError(
        err.name === "NotAllowedError"
          ? "Microphone permission denied. Allow mic access and try again."
          : "Could not access the microphone."
      );
      stopListening();
    }
  }, [tick, stopListening]);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  const note = frequency ? frequencyToNote(frequency) : null;
  const autoString = frequency ? nearestGuitarString(frequency) : null;
  const target = selectedString
    ? GUITAR_STRINGS.find((s) => s.id === selectedString)
    : autoString;

  const cents =
    frequency && target
      ? centsFromTarget(frequency, target.frequency)
      : note
        ? note.cents
        : null;

  const clampedCents =
    cents === null ? 0 : Math.max(-GAUGE_RANGE, Math.min(GAUGE_RANGE, cents));
  const needlePercent = ((clampedCents + GAUGE_RANGE) / (GAUGE_RANGE * 2)) * 100;
  const inTune = cents !== null && Math.abs(cents) <= IN_TUNE_CENTS;

  return (
    <div className="Tuner">
      <h2>Guitar Tuner</h2>
      <p className="tuner-hint">
        Standard tuning — pluck a string, aim for the center
      </p>

      <button
        className={`tuner-mic-btn${listening ? " active" : ""}`}
        onClick={listening ? stopListening : startListening}
      >
        {listening ? "Stop" : "Start mic"}
      </button>

      {error && <p className="tuner-error">{error}</p>}

      <div className={`tuner-display${inTune ? " in-tune" : ""}`}>
        <div className="tuner-note">
          {note ? (
            <>
              <span className="tuner-note-name">{note.name}</span>
              <span className="tuner-note-octave">{note.octave}</span>
            </>
          ) : (
            <span className="tuner-note-idle">—</span>
          )}
        </div>

        <p className="tuner-target">
          {target
            ? `Target: ${target.name} (${target.frequency.toFixed(1)} Hz)`
            : listening
              ? "Listening…"
              : "Start the mic, then pluck a string"}
        </p>

        <div className="tuner-gauge" aria-hidden="true">
          <div className="tuner-gauge-track">
            <div className="tuner-gauge-center" />
            <div
              className="tuner-needle"
              style={{ left: `${needlePercent}%` }}
            />
          </div>
          <div className="tuner-gauge-labels">
            <span>♭ flat</span>
            <span>in tune</span>
            <span>sharp ♯</span>
          </div>
        </div>

        <p className="tuner-cents">
          {cents === null
            ? "—"
            : `${cents > 0 ? "+" : ""}${cents} cents`}
        </p>
        {frequency && (
          <p className="tuner-hz">{frequency.toFixed(1)} Hz</p>
        )}
      </div>

      <div className="tuner-strings">
        <p className="tuner-strings-label">
          Lock to a string{" "}
          {selectedString && (
            <button
              type="button"
              className="tuner-clear"
              onClick={() => setSelectedString(null)}
            >
              (auto)
            </button>
          )}
        </p>
        <div className="tuner-string-row">
          {GUITAR_STRINGS.map((string) => (
            <button
              key={string.id}
              type="button"
              className={`tuner-string-btn${
                selectedString === string.id ? " selected" : ""
              }${
                !selectedString && autoString?.id === string.id && frequency
                  ? " detected"
                  : ""
              }`}
              onClick={() =>
                setSelectedString((prev) =>
                  prev === string.id ? null : string.id
                )
              }
            >
              {string.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tuner;
