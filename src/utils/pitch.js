const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const A4 = 440;

export const GUITAR_STRINGS = [
  { id: "E2", label: "E", name: "Low E", frequency: 82.41 },
  { id: "A2", label: "A", name: "A", frequency: 110.0 },
  { id: "D3", label: "D", name: "D", frequency: 146.83 },
  { id: "G3", label: "G", name: "G", frequency: 196.0 },
  { id: "B3", label: "B", name: "B", frequency: 246.94 },
  { id: "E4", label: "e", name: "High E", frequency: 329.63 },
];

export function frequencyToNote(frequency) {
  if (!frequency || frequency <= 0) return null;
  const noteNum = Math.round(12 * Math.log2(frequency / A4)) + 69;
  const name = NOTE_NAMES[((noteNum % 12) + 12) % 12];
  const octave = Math.floor(noteNum / 12) - 1;
  const ideal = A4 * Math.pow(2, (noteNum - 69) / 12);
  const cents = Math.round(1200 * Math.log2(frequency / ideal));
  return { name, octave, frequency: ideal, cents, noteNum };
}

export function centsFromTarget(frequency, targetHz) {
  if (!frequency || !targetHz) return null;
  return Math.round(1200 * Math.log2(frequency / targetHz));
}

export function nearestGuitarString(frequency) {
  if (!frequency) return null;
  let best = GUITAR_STRINGS[0];
  let bestDiff = Infinity;
  for (const string of GUITAR_STRINGS) {
    const diff = Math.abs(centsFromTarget(frequency, string.frequency));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = string;
    }
  }
  return best;
}

/**
 * Autocorrelation pitch detection on a time-domain sample buffer.
 * Returns frequency in Hz, or null if signal is too quiet / unclear.
 */
export function detectPitch(buffer, sampleRate) {
  const SIZE = buffer.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return null;

  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  const trimmed = buffer.slice(r1, r2);
  const n = trimmed.length;
  if (n < 2) return null;

  const corr = new Array(n).fill(0);
  for (let lag = 0; lag < n; lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) {
      sum += trimmed[i] * trimmed[i + lag];
    }
    corr[lag] = sum;
  }

  let d = 0;
  while (d < n - 1 && corr[d] > corr[d + 1]) d++;

  let maxVal = -1;
  let maxPos = -1;
  for (let i = d; i < n; i++) {
    if (corr[i] > maxVal) {
      maxVal = corr[i];
      maxPos = i;
    }
  }
  if (maxPos <= 0) return null;

  const x1 = corr[maxPos - 1] ?? corr[maxPos];
  const x2 = corr[maxPos];
  const x3 = corr[maxPos + 1] ?? corr[maxPos];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  let T0 = maxPos;
  if (a !== 0) T0 = maxPos - b / (2 * a);

  const frequency = sampleRate / T0;
  if (frequency < 60 || frequency > 1200) return null;
  return frequency;
}
