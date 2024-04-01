import { Completion } from "./types"
/** Find the completion of a word
 * @param word string - The word to find the completion
 * @returns string[] - The completion of the word
 */
export const getCompletion = async (word: string): Promise<string[]> => {
    const url = `http://localhost:3333/completion?query=${word}`
    const res = await fetch(url)
    const json: Completion[] = await res.json()
    const completions = json.map((completion: Completion) => {
        return completion.word
    })
    return completions
    

    
    return [`${word}1`, `${word}2`, `${word}3`, `${word}4`, `${word}5`, `${word}6`, `${word}7`, `${word}8`, `${word}9`];
}