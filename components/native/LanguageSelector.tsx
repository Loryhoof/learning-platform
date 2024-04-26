
import React from "react";
import { LanguageCard } from "./LanguageCard";

const LanguageSelector = ({handlePickLanguage}: {handlePickLanguage: (language: string) => void}) => {
    return (
        <div className="flex flex-col items-center text-center w-full mt-40 ">
          <h1 className="text-3xl mb-6 text-yellow-400">Pick A Language</h1>
          <h1 className="text-xl mb-6">Learn the 100 most common words for each language</h1>
          <div className="flex flex-wrap justify-center gap-4">
            <LanguageCard language={"thai"} handlePickLanguage={handlePickLanguage}></LanguageCard>
            <LanguageCard language={"vietnamese"} handlePickLanguage={handlePickLanguage}></LanguageCard>
            <LanguageCard language={"russian"} handlePickLanguage={handlePickLanguage}></LanguageCard>
            <LanguageCard language={"arabic"} handlePickLanguage={handlePickLanguage}></LanguageCard>
          </div>
        </div>
    )
}

export {LanguageSelector}