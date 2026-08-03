import React,{useState} from "react";
import Intro from "../components/CodingTrain/Intro";
import ExampleTitle from "../components/CodingTrain/HashtagHashtag";

export default function CodingTrain() {
    let [currentExercise,setCurrentExercise] = useState(0)

    let exercises = [
        {title:"0.0 - Introduction", component: Intro},
        {title:"#.# - Example Title", component: ExampleTitle},
    ]



    let nextButtonHandle = () =>{
        if( currentExercise +1 < exercises.length){
            setCurrentExercise(currentExercise+1)
        }
        else setCurrentExercise(0)
    }
    let backButtonHandle = () =>{
        if( currentExercise === 0){
            setCurrentExercise(exercises.length -1)
        }
        else setCurrentExercise(currentExercise-1)
    }
    
    let Current = exercises[currentExercise].component
    return (
        <div>
            <button onClick={backButtonHandle}>back</button>
            <div>{exercises[currentExercise].title}</div>
            <button onClick={nextButtonHandle}>next</button>
           <div><Current/></div>
        </div>
    );
}

