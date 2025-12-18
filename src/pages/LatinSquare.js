
import React,{useState} from 'react';

function LatinSquare() { 
const [inputValue, setInputValue] = useState('');

  // The function to execute on submit
  const handleFormSubmit = (event) => {
    // Prevent the default browser form submission behavior
    event.preventDefault();

    // Execute your desired function (e.g., log the input value, make API call)
    console.log('Function executed with input value:', inputValue);
    latinsquaregenerator(inputValue);
    // Optional: Clear the input field after submission
    setInputValue('');
  }

const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

// A pure function for the Fisher-Yates shuffle (does not mutate the original array)
const shuffleArray = (array) => {
  const newArray = [...array]; // Create a shallow copy to ensure immutability
  let currentIndex = newArray.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex],
    ];
  }

  return newArray;
};

const getRandomHexColor = () => {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
};

const latinsquaregenerator = (num_square) => {
    let square = []
    for (let i = 0; i < num_square; i++) {
        let newrow = []
        for (let j = 0; j < num_square; j++) {
            newrow.push((i + j) % num_square + 1);
        }
        square.push(newrow)
    }
    square = shuffleArray(square)
    console.log(square)
    return square
}

function generateColorMap(values) {
  const map = {};
  values.forEach(v => {
    map[v] = getRandomHexColor();
  });
  return map;
}

const colorMap = generateColorMap(latinsquaregenerator(inputValue).flat());
console.log(colorMap);
    return(
        <div className='LatinSquare'>
           <form onSubmit={handleFormSubmit}> 
           <h3>How big do you want your <a href="https://en.wikipedia.org/wiki/Latin_square">Latin square</a>?</h3> <input type="number" value={inputValue} onChange={handleInputChange}></input>
              {/* <button type="submit">Generate</button> */}
              </form>
           <div className='LatinSquareGrid'>
            <div className="latin-grid">
            {latinsquaregenerator(inputValue).map((row, rowIdx) => (
            <div className="latin-row" key={rowIdx} >
      {row.map((value, colIdx) => (
        <div className="latin-cell" key={colIdx} style={{ backgroundColor: colorMap[value] }}>
          {value}
        </div>
      ))}
    </div>
  ))}
</div>
          </div>
        </div>
    )
}

export default LatinSquare