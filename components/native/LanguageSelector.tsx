
import React from "react";
import { LanguageCard } from "./LanguageCard";

const LanguageSelector = ({handlePickLanguage}: {handlePickLanguage: (language: string) => void}) => {
    return (
        <div className="flex flex-col items-center text-center w-full mt-40 ">
          <h1 className="text-3xl mb-6">Pick A Language</h1>
          <div className="flex flex-col gap-4">
            <LanguageCard language={"thai"} handlePickLanguage={handlePickLanguage}></LanguageCard>
            <LanguageCard language={"vietnamese"} handlePickLanguage={handlePickLanguage}></LanguageCard>
          </div>
        </div>
    )
}

export {LanguageSelector}