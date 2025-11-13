import React, { useState, useEffect } from 'react';


function BdayCountDown() {
    const [currentTime, setCurrentTime] = useState(new Date());
    let NinetyBday = new Date("2087-02-05")

    function monthsLeft(startDate, endDate) {
        let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        months -= startDate.getMonth();
        months += endDate.getMonth();
        
        // Adjust for the day of the month to get a fractional result
        // If you want only the full months left (e.g., Math.floor(months))
        // you might not need this fractional adjustment.
        const daysDifference = endDate.getDate() - startDate.getDate();
        if (daysDifference < 0) {
            // If the end date is earlier in its month than the start date was, 
            // decrement the month count slightly.
            months -= 1; 
        }

        return months
    
    }

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000); // Update every second
  
      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this effect runs once on mount
  
    return (
      <div>
        <p>Current Time: {currentTime.toLocaleTimeString()}</p>
        <p>Current Date: {currentTime.toLocaleDateString()}</p>
        <p>Days till Zach is 90: {Math.round((NinetyBday - currentTime)/(1000*60*60*24))}</p>
        <p>Weeks till Zach is 90: {Math.round((NinetyBday - currentTime)/(1000*60*60*24*7))}</p>
        <p>Months till Zach is 90: {monthsLeft(currentTime,NinetyBday)}</p>
      </div>
    );
  }

export default BdayCountDown