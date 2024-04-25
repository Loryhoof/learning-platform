"use client"

import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { thaiVocabulary } from "./categories/thai-100";
import { getSumInArray, randomBetween, shuffleArray } from "./utils";
import { vietnameseWords } from "./categories/viet-100";
import { HiMiniSpeakerWave, HiOutlineSpeakerWave } from "react-icons/hi2";
import { GoGear } from "react-icons/go";
import { Switch } from "@/components/ui/switch";
import { IoMdClose } from "react-icons/io";

function RevealCard({lesson, onCloseReveal}: any) {

  const renderAnswer = (): any => {

    let str = lesson.answer[0];

    // if(Array.isArray(lesson.answer)) {
    //   str = lesson.answer.join(' / ')
    // }

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

function Card({lesson, onNextLesson, onSubmitLesson}: any) {

  const [textContent, setTextContent] = useState("")
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleCheck = () => {

    // setTimeout(() => {
    //   //setStatusText("")
    // }, 1000)

    if (textContent.length == 0) {
      //setStatusText("Field is empty")
      return
    }

    if (Array.isArray(lesson.answer)) {
      for (let i = 0; i < lesson.answer.length; i++) {
        if(lesson.answer[i].toLowerCase() == textContent.trim().toLowerCase()) {
          //console.log("correct!!")
          setTextContent('')
          onSubmitLesson(true)
          //onNextLesson()
          
          if(textAreaRef.current) {
            textAreaRef.current.value = ''
          }

          break
        }
        else {
          onSubmitLesson(false)
        }
      }
    }
    else if(textContent.trim().toLowerCase() == lesson.answer.toLowerCase()) {
      //console.log("correct!!")
      onSubmitLesson(true)
      setTextContent('')
      //onNextLesson()
      
      if(textAreaRef.current) {
        textAreaRef.current.value = ''
      }
    }
    else {
      //console.log("incorrect!!")
      //console.log("incorrect")
      onSubmitLesson(false)
    }
  }

  const handleKeyPress = (event: any) => {
    if(event.key == "Enter") {
      handleCheck()
    }
  }

  return (
    <div className="w-full md:w-1/3 rounded-lg p-4">
      {isReveal ? (
        <>
          <RevealCard lesson={lesson} onCloseReveal={handleCloseReveal}></RevealCard>
        </>
      ) :
      (
        <div className="flex flex-col items-center text-black text-lg font-semibold p-2">
          <textarea ref={textAreaRef} onChange={handleInput} onKeyPress={handleKeyPress} placeholder="Type the English word..." className="bg-black text-white p-2 resize-none w-full mt-2 border"></textarea>
          <div className="flex flex-row gap-4 w-full">
            <button onClick={handleReveal} className="bg-white rounded-lg p-2 w-full mt-5">Peek 👀</button>
            <button onClick={handleCheck} className="bg-white rounded-lg p-2 w-full mt-5">Submit</button>
          </div>
          {/* <div className={`${statusText === "Correct" ? `text-green-500`: `text-red-500`} mt-4`}>{statusText}</div> */}
      </div>
      )
      }
    </div>
  )
}

const lessons = thaiVocabulary //
const course = "Thai"

const ChoiceElement = ({str, onClick}: any) => {
  return (
    <button onClick={onClick} className="p-4 border rounded-lg items-center text-center hover:bg-yellow-400 hover:text-black font-bold mt-4 md:h-40 md:w-40 md:text-xl">{str}</button>
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

const correctString = "Correct 🎉"
const incorrectString = "Incorrect 😞"

export default function Home() {

  const [lessonIndex, setLessonIndex] = useState(0)
  const [showRomanized, setShowRomanized] = useState(true)
  const [lessonState, setLessonState] = useState([]) as any
  const [totalLessons, setTotalLessons] = useState(0)

  const [statusText, setStatusText] = useState("")
  
  const [step, setStep] = useState(5)

  const [loading, setLoading] = useState(false)

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const [settingsOpen, setSettingsOpen] = useState(false)

  

  useEffect(() => {
    const dataTotalLessons = localStorage.getItem('totalLessons') as string;
    const dataStep = localStorage.getItem('step') as string;
    const romanized = localStorage.getItem('romanized') as string;
    if (dataTotalLessons) {
      setTotalLessons(parseInt(dataTotalLessons));
    }

    if(dataStep) {
      setStep(parseInt(dataStep))
    }

    if(romanized) {
      console.log(romanized)
      if(romanized == "true") {
        setShowRomanized(true)
      }
      else {
        setShowRomanized(false)
      }
    }

    let str = []
    for (let i = 0; i < thaiVocabulary.length; i++) {
      str.push(thaiVocabulary[i].question)
    }

    //console.log(str)

  }, []);


  const onSubmitLesson = (isCorrect: boolean) => {

    setLoading(true)

    if(isCorrect) {
      setStatusText(correctString)
      playChimeRight()
    }
    else {
      setStatusText(incorrectString)
      playChimeWrong()
    }

    // setTimeout(() => {
    //   setStatusText("")
    //   onNextLesson()
    //   setLoading(false)
    // }, 1000)
  }

  const onNextLesson = () => {

    setStatusText("")
    setLoading(false)
    
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

    //console.log(totalLessons, getSumInArray(lessonState))

    if(totalLessons >= step - 1) {
      let result = lessonIndex

      while (result == lessonIndex) {
        result = randomBetween(0, step - 1)
      }

      setLessonIndex(result)

      if(getSumInArray(lessonState) >= 10 && totalLessons < thaiVocabulary.length) {
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

    localStorage.setItem('totalLessons', (totalLessons).toString());
    localStorage.setItem('step', (step).toString());
  }

  const handleRomanizedChange = () => {
    setShowRomanized(prevShowRomanized => {
        const updatedShowRomanized = !prevShowRomanized;
        localStorage.setItem('romanized', updatedShowRomanized.toString());
        return updatedShowRomanized;
    });
};

  const handleChoice = (str: string) => {
    if(str.length == 0) {
      return
    }

    let stringToCheckWith = lessons[lessonIndex].answer[0]

    // if(Array.isArray(lessons[lessonIndex].answer)) {
    //   stringToCheckWith = lessons[lessonIndex].answer[0]
    // }

    if(str.trim().toLowerCase() == stringToCheckWith.toString().toLowerCase()) {
      //console.log("correct!!!!!!!!")
      onSubmitLesson(true)
      //onNextLesson()
    }
    else {
      //console.log("wrong")
      onSubmitLesson(false)
    }
  }

  const handleRenderLesson = () => {

    if(Math.random() < 0.5) {
      return (
        <PickChoice lessons={lessons} currentIndex={lessonIndex} handleChoice={handleChoice}></PickChoice>
      )
    }
    return (
      <Card lesson={lessons[lessonIndex]} onSubmitLesson={onSubmitLesson} onNextLesson={onNextLesson}></Card>
    )
  }

  const playChimeRight = () => {
    const newAudio = new Audio(`/audio/int/right.mp3`)
    newAudio.play()
  }

  const playChimeWrong = () => {
    const newAudio = new Audio(`/audio/int/wrong.mp3`)
    newAudio.play()
  }

  const handleToggleSettings = () => {
    setSettingsOpen(!settingsOpen)
  }

  const playLanguageSound = () => {

    // if(audio) {
    //   audio.pause()
    // }

    const newAudio = new Audio(`/audio/thai/${lessonIndex}.mp3`)
    //setAudio(newAudio)
    newAudio.play()

  }

  return (
    <main className="">

    <div className="flex flex-row justify-between p-4 border-b font-semibold">
          {settingsOpen ?
            <>
              <IoMdClose onClick={handleToggleSettings} className="hover:text-yellow-400" size={24}></IoMdClose>
            </>
            :
            <>
              <GoGear onClick={handleToggleSettings} className="hover:text-yellow-400" size={24}></GoGear>
            </>
          }
          {totalLessons > 0 &&
            <div>Words Learned: {totalLessons}</div>}
          {/* <div>Login</div> */}
    </div> 

      {!settingsOpen && lessonIndex < lessons.length &&
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
        <div className="flex flex-col items-center text-center w-full mt-40 ">
          {/* <div className="mb-2 font-semibold text-xl">{course} - {lessonIndex + 1} / 100</div> */}
          <div className="flex flex-row mb-4 font-semibold text-4xl text-yellow-400">
            {lessons[lessonIndex].question} {showRomanized ? `- ${lessons[lessonIndex].romanized}` : ''}
            <div onClick={playLanguageSound} className="bg-green-400 rounded-lg p-2 ml-4 hover:bg-green-600"><HiMiniSpeakerWave  className="text-black text-2xl"></HiMiniSpeakerWave></div>
          </div>

          {!loading ? (
            handleRenderLesson()
          ) : (
            <div className="text-2xl">
              <div className={`${statusText === correctString ? "text-green-500" : "text-red-500"} mt-4 font-semibold`}>{statusText}</div>
              <div className="">The answer was: <span className="text-yellow-400 font-semibold text-xl">{lessons[lessonIndex].answer[0]}</span></div>
              <button onClick={onNextLesson} className="bg-white rounded-lg text-black font-semibold p-3 mt-5 hover:bg-gray-100">Next Lesson</button>
            </div>
          )}
        </div>
      </>
      }

      {settingsOpen && 
      <>
        <div className="flex flex-col items-center text-center w-full mt-40">
          <h1 className="text-3xl mb-6">Preferences</h1>
          {/* <label className="">
          <input className="m-2" type="checkbox"
                  checked={showRomanized}
                  onChange={handleRomanizedChange}
          ></input>
            Show Romanized
          </label> */}
          <div className="flex flex-row gap-2 text-xl">
            <div>Show Romanized</div>
            <Switch
              checked={showRomanized}
              onCheckedChange={handleRomanizedChange}
              aria-readonly
            />
          </div>
        </div>
      </>
      } 
    </main>
  );
}
