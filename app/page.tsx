"use client"

import { useRef, useState } from "react";
import { thaiVocabulary } from "./categories/thai-100";

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
      )}
    </div>
  )
}

const lessons = thaiVocabulary
const course = "Thai"

export default function Home() {

  const [lessonIndex, setLessonIndex] = useState(0)
  const [showRomanized, setShowRomanized] = useState(false)

  const onNextLesson = () => {
    // if(lessonIndex < lessons.length - 1) {
    //   setLessonIndex(lessonIndex + 1)
    // }

    setLessonIndex(lessonIndex + 1)
  }

  const handleRomanizedChange = () => {
    setShowRomanized(!showRomanized)
  }

  return (
    <main className="">

      {lessonIndex < lessons.length &&
      <>
      <div>
        <label className="">
         <input className="m-2" type="checkbox"
                checked={showRomanized}
                onChange={handleRomanizedChange}
         ></input>
          Show romanized
        </label>
      </div>
        <div className="flex flex-col items-center w-full mt-40 ">
          <div className="mb-2 font-semibold text-xl">{course} - Lesson {lessonIndex + 1}</div>
          <div className="mb-4 font-semibold text-4xl text-yellow-400">
            {lessons[lessonIndex].question} {showRomanized ? `- ${lessons[lessonIndex].romanized}` : ''}
          </div>
          <Card lesson={lessons[lessonIndex]} onNextLesson={onNextLesson}></Card>
        </div>
      </>
      } 
    </main>
  );
}
