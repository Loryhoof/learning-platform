"use client"

import { useRef, useState } from "react";

function Card({lesson, onNextLesson}: any) {

  const [textContent, setTextContent] = useState("")
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [statusText, setStatusText] = useState("")

  const handleInput = (e: Event | any) => {
    setTextContent(e.target.value)
  }

  const handleCheck = () => {
    if (textContent.length == 0) {
      return
    }

    if(textContent.trim() == lesson.answer) {
      console.log("correct!!")
      setStatusText("Correct!")
      setTextContent('')
      onNextLesson()
      
      if(textAreaRef.current) {
        textAreaRef.current.value = ''
      }
    }
    else {
      console.log("incorrect!!")
      setStatusText("Incorrect!")
    }
  }

  return (
    <div className="bg-black w-1/2 rounded-lg">
      <div className="flex flex-col items-center text-black text-lg font-semibold p-2">
        {/* <div className="text-green-400">{statusText}</div> */}
        <textarea ref={textAreaRef} onChange={handleInput} className="bg-black text-white p-2 resize-none w-full h-48 mt-2 rounded-xl border"></textarea>
        <button onClick={handleCheck} className="bg-white rounded-lg p-2 mt-2">Submit</button>
      </div>
    </div>
  )
}

interface Lesson {
  id: number,
  question: string,
  answer: string
}

const threeJsQuestions: Lesson[] = [
  {
    id: 0,
    question: "How do you create a Vector3 instance in Three.js?",
    answer: "const vector = new THREE.Vector3();"
  },
  {
    id: 1,
    question: "How do you create a BoxGeometry in Three.js?",
    answer: "const geometry = new THREE.BoxGeometry(width, height, depth);"
  },
  {
    id: 2,
    question: "How do you add a mesh to the scene in Three.js?",
    answer: "scene.add(mesh);"
  },
  {
    id: 3,
    question: "How do you create a PerspectiveCamera in Three.js?",
    answer: "const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);"
  },
  {
    id: 4,
    question: "How do you create a WebGLRenderer in Three.js?",
    answer: "const renderer = new THREE.WebGLRenderer();"
  },
  {
    id: 5,
    question: "How do you create a PointLight in Three.js?",
    answer: "const light = new THREE.PointLight(color, intensity);"
  },
  {
    id: 6,
    question: "How do you load a texture in Three.js?",
    answer: "const textureLoader = new THREE.TextureLoader(); const texture = textureLoader.load('texture.jpg');"
  },
  {
    id: 7,
    question: "How do you create an animation loop in Three.js?",
    answer: "function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); } animate();"
  },
  {
    id: 8,
    question: "How do you create a material with a basic color in Three.js?",
    answer: "const material = new THREE.MeshBasicMaterial({ color: 0xffffff });"
  },
  {
    id: 9,
    question: "How do you create a scene in Three.js?",
    answer: "const scene = new THREE.Scene();"
  }
];

const lessons: Lesson[] = [
  {
    id: 0,
    question: "What is 1+1?",
    answer: "2"
  },
  {
    id: 1,
    question: "What is 4+1?",
    answer: "5"
  }
]

export default function Home() {

  const [lessonIndex, setLessonIndex] = useState(0)

  const onNextLesson = () => {
    // if(lessonIndex < lessons.length - 1) {
    //   setLessonIndex(lessonIndex + 1)
    // }

    setLessonIndex(lessonIndex + 1)
  }

  return (
    <main className="flex flex-col mt-4 items-center">

      {lessonIndex < threeJsQuestions.length &&
      <>
        <div className="mb-2 font-semibold text-xl">Lesson {lessonIndex + 1}</div>
        <div className="mb-4 font-semibold text-2xl text-yellow-400">{threeJsQuestions[lessonIndex].question}</div>
        <Card lesson={threeJsQuestions[lessonIndex]} onNextLesson={onNextLesson}></Card>
      </>
      } 
    </main>
  );
}
