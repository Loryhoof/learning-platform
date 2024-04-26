"use client"

import React from "react"
import { Switch } from "../ui/switch"

const SettingsView = ({showRomanized, handleRomanizedChange}: {showRomanized: boolean, handleRomanizedChange: () => void}) => {
    return (
        <div className="flex flex-col items-center text-center w-full mt-40">
            <h1 className="text-3xl mb-6">Preferences</h1>
            <div className="flex flex-row gap-2 text-xl">
                <div>Show Romanized</div>
                <Switch
                checked={showRomanized}
                onCheckedChange={handleRomanizedChange}
                aria-readonly
                />
            </div>
        </div>
    )
}

export {SettingsView}