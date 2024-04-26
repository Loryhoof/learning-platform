import { Lesson } from "./Lesson";

export interface Languages {
  [key: string]: {
    hasRoman: boolean
    list: Lesson[]
  }
}