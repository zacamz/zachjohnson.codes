import DecisionWheel from "../components/DecisionWheel";
import "./Wheel.css";

function Wheel() {
  return (
    <div className="Wheel">
      <h2>What should I do?</h2>
      <p className="wheel-hint">Drag the wheel or press Spin</p>
      <DecisionWheel />
    </div>
  );
}

export default Wheel;
