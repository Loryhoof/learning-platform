
"use client"

import React from "react";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/lib/utils";

const LanguageCard = ({language, handlePickLanguage}: {language: string, handlePickLanguage: (language: string) => void} ) => {
    return (
        <div onClick={() => handlePickLanguage(language)} className="p-2 border-4 bg-slate-800 border-slate-700 rounded-xl 
        text-white w-48 text-2xl flex flex-col items-center hover:bg-slate-700 hover:border-yellow-400">
            {capitalizeFirstLetter(language)}
            <Image
            className="rounded-xl border-4 border-white mb-2 mt-2"
            src={`/flags/${language}-flag.jpg`}
            width={48}
            height={24}
            alt="language flag"
            />
        </div>
    )
}

export {LanguageCard}