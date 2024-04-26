"use client"

import { useEffect, useRef, useState } from "react";
import { thaiVocabulary } from "./categories/thai-100";
import { getSumInArray, randomBetween, shuffleArray } from "./utils";
import { vietnameseWords } from "./categories/viet-100";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { LanguageSelector } from "@/components/native/LanguageSelector";
import { SettingsView } from "@/components/native/SettingsView";
import { TopNav } from "@/components/native/TopNav";
import { Languages } from "./interfaces/Languages";
import { Lesson } from "./interfaces/Lesson";
import { russianVocab } from "./categories/russian-100";
import { arabicVocab } from "./categories/arabic-100";

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

const lessons: Languages = {
  "thai": {
    hasRoman: true,
    list: thaiVocabulary
  },
  "vietnamese": {
    hasRoman: false,
    list: vietnameseWords
  },
  "russian": {
    hasRoman: true,
    list: russianVocab
  },
  "arabic": {
    hasRoman: true,
    list: arabicVocab
  }
}

const ChoiceElement = ({str, onClick}: any) => {
  return (
    <button onClick={onClick} className="p-4 border rounded-lg items-center text-center hover:bg-yellow-400 hover:text-black font-bold mt-4 md:h-40 md:w-40 md:text-2xl">{str}</button>
  )
}

const AudioChoiceElement = ({str, onClick, showRomanized}: any) => {

  return (
    <button onClick={onClick} className="text-wrap p-8 border rounded-lg hover:border-yellow-400 text-2xl font-bold mt-4 h-40 w-40 md:text-2xl">
      <div className="text-wrap">
        <div className={`text-yellow-400 ${!showRomanized ? 'text-4xl' : ''}`}>{str.question}</div>
        {showRomanized && 
          <div className="text-sm mt-4">{str.romanized}</div>
        }
      </div>
    </button>
  )
}

function PickChoice({lessons, currentIndex, handleChoice}: {lessons: Lesson[], currentIndex: number, handleChoice: any}) {

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
    let randomElement = lessons[Math.floor(Math.random() * lessons.length)].answer[0]

    if(randomElement != lessons[currentIndex].answer[0]) {
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

function PickFromAudio({lessons, currentIndex, handleChoice, showRomanized}: {lessons: Lesson[], currentIndex: number, handleChoice: any, showRomanized: boolean}) {

  const [hasMounted, setHasMounted] = useState(false); // <-- add this

  useEffect(() => {
    setHasMounted(true); // <-- toggle on client-side, because useEffect doesn't run on server-side/during SSG build
  }, []);

  let randomizedArray = [] as any

  if(Array.isArray(lessons[currentIndex].answer)) {
    randomizedArray[0] = lessons[currentIndex]
  }
  else {
    randomizedArray[0] = lessons[currentIndex]
  }

  while(randomizedArray.length < 4) {
    let randomElement = lessons[Math.floor(Math.random() * lessons.length)]

    if(randomElement != lessons[currentIndex]) {
      randomizedArray.push(randomElement)
    }
  }

  shuffleArray(randomizedArray)

  return (
    <>
    {hasMounted && (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <AudioChoiceElement showRomanized={showRomanized} onClick={() => handleChoice(randomizedArray[0].answer[0])} str={randomizedArray[0]} className=""></AudioChoiceElement>
      <AudioChoiceElement showRomanized={showRomanized} onClick={() => handleChoice(randomizedArray[1].answer[0])} str={randomizedArray[1]} className=""></AudioChoiceElement>
      <AudioChoiceElement showRomanized={showRomanized} onClick={() => handleChoice(randomizedArray[2].answer[0])} str={randomizedArray[2]} className=""></AudioChoiceElement>
      <AudioChoiceElement showRomanized={showRomanized} onClick={() => handleChoice(randomizedArray[3].answer[0])} str={randomizedArray[3]} className=""></AudioChoiceElement>
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
  //const [totalLessons, setTotalLessons] = useState(0)

  const [statusText, setStatusText] = useState("")
  
  //const [step, setStep] = useState(5)

  const [loading, setLoading] = useState(false)

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const [settingsOpen, setSettingsOpen] = useState(false)


  //language selection stuff
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [languageSelectionIsOpen, setLanguageSelectionIsOpen] = useState(false)


  // state

  interface ProgressInterface {
    [key: string]: {
      step: number,
      totalLessons: number
    }
  }
  
  const [progress, setProgress] = useState<ProgressInterface>({});

  useEffect(() => {
    //const dataTotalLessons = localStorage.getItem('totalLessons') as string;
    //const dataStep = localStorage.getItem('step') as string;




    const storedProgress = localStorage.getItem('progress') as string;
    
    const romanized = localStorage.getItem('romanized') as string;
    const storedLanguage = localStorage.getItem('selectedLanguage') as string;

    if(storedProgress) {
      setProgress(JSON.parse(storedProgress))
    }
    else {
      // TEMP RECOVERY FOR OLD USERS:
      
      const recoveryStep = localStorage.getItem('step') as string;
      const recoveryTotalLessons = localStorage.getItem('totalLessons') as string;

      // If old values are there, recover, e.g. make a new progress obj using old values
      if(recoveryStep && recoveryTotalLessons) {
        setProgress(prevProgress => {
          const updatedProgress = {
            ...prevProgress,
            'thai': {
              step: Number(recoveryStep),
              totalLessons: Number(recoveryTotalLessons)
            }
          };
          localStorage.setItem('progress', JSON.stringify(updatedProgress))
          return updatedProgress;
        });
      }
      // END OF RECOVERY
    }

    if(romanized) {
      if(romanized == "true") {
        setShowRomanized(true)
      }
      else {
        setShowRomanized(false)
      }
    }

    if (!storedLanguage) {
      setLanguageSelectionIsOpen(true)
    }
    else {
      setSelectedLanguage(storedLanguage)
      setLanguageSelectionIsOpen(false)
    }

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

    //console.log(progress, 'progress')
    //return

    //(progress[selectedLanguage].totalLessons, progress[selectedLanguage].step)

    if(progress[selectedLanguage].totalLessons >= progress[selectedLanguage].step - 1) {
      //console.log('islagrger')
      let result = lessonIndex

      while (result == lessonIndex) {
        result = randomBetween(0, progress[selectedLanguage].step - 1)
      }

      setLessonIndex(result)

      if(getSumInArray(lessonState) >= 10 && progress[selectedLanguage].totalLessons < lessons[selectedLanguage].list.length) {
        //setTotalLessons(totalLessons + 1)
        //setStep(step+1)
        setLessonState([])

        setProgress(prevProgress => ({
          ...prevProgress,
          [selectedLanguage]: {
            step: progress[selectedLanguage].step + 1,
            totalLessons: progress[selectedLanguage].totalLessons + 1
          }
        }));
        
      }
    }
    else {
      setLessonIndex(lessonIndex + 1)
      //setTotalLessons(totalLessons + 1)

      setProgress(prevProgress => ({
          ...prevProgress,
          [selectedLanguage]: {
            step: progress[selectedLanguage].step,
            totalLessons: progress[selectedLanguage].totalLessons + 1
          }
        }));
    }

    // if(lessonState[lessonIndex] >= 3) {
    //   setLessonIndex(lessonIndex + 1)
    // }

    //localStorage.setItem('totalLessons', (totalLessons).toString());
    //localStorage.setItem('step', (step).toString());
    localStorage.setItem('progress', JSON.stringify(progress))
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

    let stringToCheckWith = lessons[selectedLanguage].list[lessonIndex].answer[0]

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

    let rand = Math.random()
    if(rand < 1/3) {
      return (
        <>
          <div className="flex flex-row mb-4 font-semibold text-4xl text-yellow-400">
            {lessons[selectedLanguage].list[lessonIndex].question} {showRomanized && lessons[selectedLanguage].hasRoman ? `- ${lessons[selectedLanguage].list[lessonIndex].romanized}` : ''}
            <div onClick={playLanguageSound} className="bg-green-400 rounded-lg p-2 ml-4 hover:bg-green-600"><HiMiniSpeakerWave  className="text-black text-2xl"></HiMiniSpeakerWave></div>
          </div>
          <PickChoice lessons={lessons[selectedLanguage].list} currentIndex={lessonIndex} handleChoice={handleChoice}></PickChoice>
        </>
        
      )
    }
    else if (Math.random() < 2/3) {
      return (
      <>
         <div className="flex flex-row mb-4 font-semibold text-4xl text-yellow-400">
            {/* {lessons[selectedLanguage].list[lessonIndex].question} {showRomanized && lessons[selectedLanguage].hasRoman ? `- ${lessons[selectedLanguage].list[lessonIndex].romanized}` : ''} */}
            <div onClick={playLanguageSound} className="bg-green-400 rounded-lg p-4 rounded-xl border-green-500 border-4 ml-4 hover:bg-green-500"><HiMiniSpeakerWave size={48}className="text-black text-2xl"></HiMiniSpeakerWave></div>
          </div>
          <PickFromAudio showRomanized={showRomanized} lessons={lessons[selectedLanguage].list} currentIndex={lessonIndex} handleChoice={handleChoice}></PickFromAudio>

          {/*Some random functon*/}
      </>
      )
    };

    return (
      <>
      <div className="flex flex-row mb-4 font-semibold text-4xl text-yellow-400">
            {lessons[selectedLanguage].list[lessonIndex].question} {showRomanized && lessons[selectedLanguage].hasRoman ? `- ${lessons[selectedLanguage].list[lessonIndex].romanized}` : ''}
            <div onClick={playLanguageSound} className="bg-green-400 rounded-lg p-2 ml-4 hover:bg-green-600"><HiMiniSpeakerWave  className="text-black text-2xl"></HiMiniSpeakerWave></div>
          </div>
          <Card lesson={lessons[selectedLanguage].list[lessonIndex]} onSubmitLesson={onSubmitLesson} onNextLesson={onNextLesson}></Card>
      </>
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

  const handlePickLanguage = (language: string) => {
    //console.log(language)
    setSelectedLanguage(language)
    setLanguageSelectionIsOpen(false)
    handleCloseLanguagePicker()

    localStorage.setItem('selectedLanguage', language)
    
    let dataProgress = JSON.parse(localStorage.getItem('progress') as string)

    if(dataProgress && dataProgress[language]) {
      setProgress(JSON.parse(dataProgress))
    }
    else {
      setProgress(prevProgress => {
        const updatedProgress = {
          ...prevProgress,
          [language]: {
            step: 5,
            totalLessons: 0
          }
        };
        localStorage.setItem('progress', JSON.stringify(updatedProgress))
        return updatedProgress;
      });
    }
  }

  const handleOpenLanguagePicker = () => {
    setLanguageSelectionIsOpen(true)
  }

  const handleCloseLanguagePicker = () => {
    setLanguageSelectionIsOpen(false)
  }

  const playLanguageSound = () => {


    // if(audio) {
    //   audio.pause()
    // }

    const newAudio = new Audio(`/audio/${selectedLanguage}/${lessonIndex}.mp3`)
    //setAudio(newAudio)
    newAudio.play()

  }

  return (
    <main className="">

    {!languageSelectionIsOpen && selectedLanguage ?
    <>

      <TopNav language={selectedLanguage} settingsOpen={settingsOpen} totalLessons={progress[selectedLanguage].totalLessons} handleToggleSettings={handleToggleSettings} handleOpenLanguagePicker={handleOpenLanguagePicker}></TopNav> 

      {!settingsOpen && lessonIndex < lessons[selectedLanguage].list.length &&
      <>
        <div className="flex flex-col items-center text-center w-full mt-40 ">
          {/* <div className="flex flex-row mb-4 font-semibold text-4xl text-yellow-400">
            {lessons[selectedLanguage].list[lessonIndex].question} {showRomanized && lessons[selectedLanguage].hasRoman ? `- ${lessons[selectedLanguage].list[lessonIndex].romanized}` : ''}
            <div onClick={playLanguageSound} className="bg-green-400 rounded-lg p-2 ml-4 hover:bg-green-600"><HiMiniSpeakerWave  className="text-black text-2xl"></HiMiniSpeakerWave></div>
          </div> */}

          {!loading ? (
            handleRenderLesson()
          ) : (
            <div className="text-2xl">
              <div className={`${statusText === correctString ? "text-green-500" : "text-red-500"} mt-4 font-semibold`}>{statusText}</div>
              <div className="">The answer was: <span className="text-yellow-400 font-semibold text-xl">{lessons[selectedLanguage].list[lessonIndex].answer[0]}</span></div>
              <button onClick={onNextLesson} className="bg-white rounded-lg text-black font-semibold p-3 mt-5 hover:bg-gray-100">Next Lesson</button>
            </div>
          )}
        </div>
      </>
      }

      {settingsOpen && 
      <>
        <SettingsView showRomanized={showRomanized} handleRomanizedChange={handleRomanizedChange}></SettingsView>
      </>
      } 
      </>
      :
      <>
        <LanguageSelector handlePickLanguage={handlePickLanguage}></LanguageSelector>
      </>
    }
    </main>
  );
}
