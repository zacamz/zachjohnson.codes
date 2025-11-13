import React, { useState, useEffect } from 'react';
import './BdayCountDay.css';

function BdayCountDown() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const birthDate = new Date("1997-02-05");
    const ninetyBday = new Date("2087-02-05");

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, []);

    // Calculate weeks
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksLived = Math.floor((currentTime - birthDate) / msPerWeek);
    const totalWeeks = Math.floor((ninetyBday - birthDate) / msPerWeek);
    const weeksRemaining = totalWeeks - weeksLived;
    const percentageLived = ((weeksLived / totalWeeks) * 100).toFixed(2);

    // Create array for visualization
    const weeksArray = Array.from({ length: totalWeeks }, (_, i) => i < weeksLived);

    // Calculate other stats
    const daysRemaining = Math.floor((ninetyBday - currentTime) / (1000 * 60 * 60 * 24));
    const yearsLived = ((currentTime - birthDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2);
  
    return (
      <div>
        <p>Current Time: {currentTime.toLocaleTimeString()}</p>
        <p>Current Date: {currentTime.toLocaleDateString()}</p>
        <p>Weeks Lived: {weeksLived.toLocaleString()}</p>
        <p>Weeks Remaining: {weeksRemaining.toLocaleString()}</p>
        <p>Total Weeks (90 years): {totalWeeks.toLocaleString()}</p>
        <p>Days till Zach is 90: {daysRemaining.toLocaleString()}</p>
        
        <div className="weeks-grid">
          {weeksArray.map((isLived, index) => (
            <div
              key={index}
              className={`week-square ${isLived ? 'lived' : 'remaining'}`}
            />
          ))}
        </div>
      </div>
    );
  }

export default BdayCountDown