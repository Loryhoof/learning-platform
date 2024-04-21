"use client"

import { useEffect, useRef, useState } from "react";
import { thaiVocabulary } from "./categories/thai-100";
import { getSumInArray, randomBetween, shuffleArray } from "./utils";
import { vietnameseWords } from "./categories/viet-100";

function RevealCard({lesson, onCloseReveal}: any) {

  const renderAnswer = (): any => {

    let str = lesson.answer;

    if(Array.isArray(lesson.answer)) {
      str = lesson.answer.join(' / ')
    }

    return (
      <div className="text-green-400 text-xl font-semibold">
        {str}
      </div>
    )
  }
  
  return (
    <div className="flex flex-col w-full text-center items-center">
      Answer: {renderAnswer()}
      <button onClick={onCloseReveal} className="bg-white rounded-lg p-2 w-1/2 mt-5 text-black font-semibold">Go Back</button>
    </div>
  )
}

function Card({lesson, onNextLesson}: any) {

  const [textContent, setTextContent] = useState("")
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [statusText, setStatusText] = useState("")

  const [isReveal, setIsReveal] = useState(false)

  const handleReveal = () => {
    setIsReveal(true)
  }

  const handleCloseReveal = () => {
    setIsReveal(false)
  }

  const handleInput = (e: Event | any) => {
    setTextContent(e.target.value)
  }

  const renderStatus = () => {

    // if(statusText == "Correct") {
    //   return (
    //     <div></div>
    //   )
    // }


    return (
      <div className={`${statusText === "Correct" ? `text-red-500`: `text-green-500`} mt-4`}>{statusText}</div>
    )
  }

  function InputCard() {
    return (
      <div className="flex flex-col items-center text-black text-lg font-semibold p-2">
        <textarea ref={textAreaRef} onChange={handleInput} placeholder="Type the English word..." className="bg-black text-white p-2 resize-none w-full mt-2 border"></textarea>
        <div className="flex flex-row gap-4 w-full">
          <button onClick={handleReveal} className="bg-white rounded-lg p-2 w-full mt-5">Peek 👀</button>
          <button onClick={handleCheck} className="bg-white rounded-lg p-2 w-full mt-5">Submit</button>
        </div>
        <div className={`${statusText === "Correct" ? `text-green-500`: `text-red-500`} mt-4`}>{statusText}</div>
      </div>
    )
  }

  function PickCard() {
    return (
      <div className="flex flex-col items-center text-black text-lg font-semibold p-2">

      </div>
    )
  }

  const handleCheck = () => {

    setTimeout(() => {
      setStatusText("")
    }, 1000)

    if (textContent.length == 0) {
      setStatusText("Field is empty")
      return
    }

    if (Array.isArray(lesson.answer)) {
      for (let i = 0; i < lesson.answer.length; i++) {
        if(lesson.answer[i].toLowerCase() == textContent.trim().toLowerCase()) {
          //console.log("correct!!")
          setStatusText("Correct")
          setTextContent('')
          onNextLesson()
          
          if(textAreaRef.current) {
            textAreaRef.current.value = ''
          }

          break
        }
        else {
          setStatusText("Incorrect")
        }
      }
    }
    else if(textContent.trim().toLowerCase() == lesson.answer.toLowerCase()) {
      //console.log("correct!!")
      setStatusText("Correct")
      setTextContent('')
      onNextLesson()
      
      if(textAreaRef.current) {
        textAreaRef.current.value = ''
      }
    }
    else {
      //console.log("incorrect!!")
      //console.log("incorrect")
      setStatusText("Incorrect")
    }
  }

  const handleRenderInputMethod = () => {
    return (
      <InputCard/>
    )
  }

  return (
    <div className="bg-black w-1/2 rounded-lg">
      {isReveal ? (
        <>
          <RevealCard lesson={lesson} onCloseReveal={handleCloseReveal}></RevealCard>
        </>
      ) :
      (
        <div className="flex flex-col items-center text-black text-lg font-semibold p-2">
          <textarea ref={textAreaRef} onChange={handleInput} placeholder="Type the English word..." className="bg-black text-white p-2 resize-none w-full mt-2 border"></textarea>
          <div className="flex flex-row gap-4 w-full">
            <button onClick={handleReveal} className="bg-white rounded-lg p-2 w-full mt-5">Peek 👀</button>
            <button onClick={handleCheck} className="bg-white rounded-lg p-2 w-full mt-5">Submit</button>
          </div>
          <div className={`${statusText === "Correct" ? `text-green-500`: `text-red-500`} mt-4`}>{statusText}</div>
      </div>
      )
      }
    </div>
  )
}

const lessons = vietnameseWords //thaiVocabulary
const course = "Vietnamese" //"Thai"

const ChoiceElement = ({str, onClick}: any) => {
  return (
    <button onClick={onClick} className="p-4 border rounded-lg items-center text-center hover:bg-slate-800">{str}</button>
  )
}

function PickChoice({lessons, currentIndex, handleChoice}: any) {

  const [hasMounted, setHasMounted] = useState(false); // <-- add this

  useEffect(() => {
    setHasMounted(true); // <-- toggle on client-side, because useEffect doesn't run on server-side/during SSG build
  }, []);

  let randomizedArray = [] as any

  if(Array.isArray(lessons[currentIndex].answer)) {
    randomizedArray[0] = lessons[currentIndex].answer[0]
  }
  else {
    randomizedArray[0] = lessons[currentIndex].answer
  }

  while(randomizedArray.length < 4) {
    let randomElement = lessons[Math.floor(Math.random() * lessons.length)].answer;

    if(Array.isArray(randomElement)) {
      randomElement = randomElement[0]
    }

    if(randomElement != lessons[currentIndex].answer) {
      randomizedArray.push(randomElement)
    }
  }

  shuffleArray(randomizedArray)

  return (
    <>
    {hasMounted && (
    <div className="flex flex-row gap-4">
      <ChoiceElement onClick= {() => handleChoice(randomizedArray[0])} str={randomizedArray[0]}></ChoiceElement>
      <ChoiceElement onClick= {() => handleChoice(randomizedArray[1])} str={randomizedArray[1]}></ChoiceElement>
      <ChoiceElement onClick= {() => handleChoice(randomizedArray[2])} str={randomizedArray[2]}></ChoiceElement>
      <ChoiceElement onClick= {() => handleChoice(randomizedArray[3])} str={randomizedArray[3]}></ChoiceElement>
    </div>
    )}
    </>
  )
}

export default function Home() {

  const [lessonIndex, setLessonIndex] = useState(0)
  const [showRomanized, setShowRomanized] = useState(false)
  const [lessonState, setLessonState] = useState([]) as any
  const [totalLessons, setTotalLessons] = useState(0)

  const [step, setStep] = useState(5)

  

  useEffect(() => {
    const savedData = localStorage.getItem('lessonIndex') as string;
    if (savedData) {
      //setLessonIndex(parseInt(savedData));
    }
  }, []);

  const onNextLesson = () => {
    // if(lessonIndex < lessons.length - 1) {
    //   setLessonIndex(lessonIndex + 1)
    // }

    //lessonState[lessonIndex] = lessonState[lessonIndex] + 1

    // let newArr = [...lessonState];
    // newArr[lessonIndex] = lessonState[lessonIndex] + 1
    // setLessonState(newArr);

    const newState = [...lessonState]
    newState[lessonIndex] = (newState[lessonIndex] ? newState[lessonIndex] : 1) + 1
    setLessonState(newState)

    

    //console.log(getSumInArray(lessonState))

    console.log(totalLessons, getSumInArray(lessonState))

    if(totalLessons >= step - 1) {
      let result = lessonIndex

      while (result == lessonIndex) {
        result = randomBetween(0, step - 1)
      }

      setLessonIndex(result)

      if(getSumInArray(lessonState) >= 10) {
        setTotalLessons(totalLessons + 1)
        setStep(step+1)
        setLessonState([])
      }
    }
    else {
      setLessonIndex(lessonIndex + 1)
      setTotalLessons(totalLessons + 1)
    }

    // if(lessonState[lessonIndex] >= 3) {
    //   setLessonIndex(lessonIndex + 1)
    // }

    //localStorage.setItem('lessonIndex', (lessonIndex + 1).toString());
  }

  const handleRomanizedChange = () => {
    setShowRomanized(!showRomanized)
  }

  const handleChoice = (str: string) => {
    if(str.length == 0) {
      return
    }

    let stringToCheckWith = lessons[lessonIndex].answer

    if(Array.isArray(lessons[lessonIndex].answer)) {
      stringToCheckWith = lessons[lessonIndex].answer[0]
    }

    if(str.trim().toLowerCase() == stringToCheckWith.toString().toLowerCase()) {
      console.log("correct!!!!!!!!")
      onNextLesson()
    }
    else {
      console.log("wrong")
    }
  }

  const handleRenderLesson = () => {

    if(Math.random() < 0.9999999) {
      return (
        <PickChoice lessons={lessons} currentIndex={lessonIndex} handleChoice={handleChoice}></PickChoice>
      )
    }
    return (
      <Card lesson={lessons[lessonIndex]} onNextLesson={onNextLesson}></Card>
    )
  }

  return (
    <main className="">

      {lessonIndex < lessons.length &&
      <>
      {/* <div>
        <label className="">
         <input className="m-2" type="checkbox"
                checked={showRomanized}
                onChange={handleRomanizedChange}
         ></input>
          Show romanized
        </label>
      </div> */}
        <div className="flex flex-col items-center w-full mt-40 ">
          <div className="mb-2 font-semibold text-xl">{course} - {lessonIndex + 1} / 100</div>
          <div className="mb-4 font-semibold text-4xl text-yellow-400">
            {lessons[lessonIndex].question} {showRomanized ? `- ${lessons[lessonIndex].romanized}` : ''}
          </div>
          {handleRenderLesson()}
        </div>
      </>
      } 
    </main>
  );
}
