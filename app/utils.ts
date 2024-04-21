
export function shuffleArray(array: []) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

export function randomBetween(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getSumInArray(array: []) {
    return array.reduce((acc: number, cur: number) => {
        if(!cur || isNaN(cur)) {
            cur = 0
        }
        return acc + cur
    }, 0)
}