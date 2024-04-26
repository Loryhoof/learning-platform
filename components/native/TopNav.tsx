"use client"

import Image from "next/image"
import React from "react"
import { GoGear } from "react-icons/go"
import { IoMdClose } from "react-icons/io"
import { IoLanguage } from "react-icons/io5"

const TopNav = ({language, settingsOpen, totalLessons, handleToggleSettings, handleOpenLanguagePicker}: {language: string, settingsOpen: boolean, totalLessons: number, handleToggleSettings: () => void, handleOpenLanguagePicker: () => void}) => {
    return (
        <div className="flex flex-row justify-between p-4 border-b font-semibold">
        <div className="flex flex-row gap-4 items-center ">
            {settingsOpen ?
            <>
                <IoMdClose onClick={handleToggleSettings} className="hover:text-yellow-400" size={24}></IoMdClose>
            </>
            :
            <>
                <GoGear onClick={handleToggleSettings} className="hover:text-yellow-400" size={24}></GoGear>
            </>
            }
            <div className="hover:text-yellow-400">
            {/* <IoLanguage onClick={handleOpenLanguagePicker} size={24}></IoLanguage> */}
            <Image
                onClick={handleOpenLanguagePicker}
                className="rounded-xl border-2 border-black hover:border-yellow-400"
                src={`/flags/${language}-flag.jpg`}
                width={48}
                height={24}
                alt="language flag"
            />
            </div>
        </div>
            {totalLessons > 0 &&
                <div>Words Learned: {totalLessons}</div>}
            {/* <div>Login</div> */}
    </div>
    )
}

export {TopNav}