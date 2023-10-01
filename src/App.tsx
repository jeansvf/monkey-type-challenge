import {useState, useEffect, KeyboardEventHandler} from "react"
import wordList from "./wordList"

function App() {
    const [words, setWords] = useState<string[]>([])
    const [typedWords, setTypedWords] = useState<string[]>([])
    const [currentWord, setCurrentWord] = useState("")
    const [currentKey, setCurrentKey] = useState(0)
    const [gameEnded, setGameEnded] = useState(false)
    const [lastKey, setLastKey] = useState(0)

    var wordsPerMinute = 0

    // TODO: randomize the words
    useEffect(() => {
        let newWords = []

        for (let i = 0; i < 25; i++) {
            newWords.push(wordList[i] + " ")
        }

        setLastKey(newWords.length - 2)

        newWords[newWords.length - 1] = newWords[newWords.length - 1].slice(
            0,
            -1
        )

        setWords(newWords)
    }, [])

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
        if (event.key == "Backspace") {
            let newCurrentWord = structuredClone(currentWord)

            setCurrentWord(newCurrentWord.slice(0, -1))

            return
        }

        if (
            (event.key.toUpperCase() !== event.key.toLowerCase() &&
                event.key.length === 1) ||
            event.key === " "
        ) {
            let newCurrentWord = structuredClone(currentWord)
            newCurrentWord += event.key
            setCurrentWord(newCurrentWord)
        }
    }

    const endGame = () => {
        setGameEnded(true)

        //TODO: wpm
    }

    useEffect(() => {
        console.log(currentWord)

        currentKey === lastKey ? endGame() : null
    }, [currentKey])

    useEffect(() => {
        if (currentWord === words[currentKey]) {
            console.log(currentWord)
            console.log(words[currentKey])

            setCurrentKey(currentKey + 1)
            setCurrentWord("")
        }
    }, [currentWord])

    return (
        <div
            className="flex w-full h-screen justify-center items-center"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="relative w-[30rem] flex flex-wrap justify-center text-start text-[#565656] text-2xl">
                <>
                    {/* CONTINUE: figure a way to turn the wrong colors red (you probably will have to create other variable idk or compare the values with last letter of current word) */}
                    {words.map((word, index) => (
                        <pre className="relative flex" key={index}>
                            {index == currentKey ? (
                                <>
                                    <span className="absolute left-0 top-0 text-white">
                                        {currentWord}
                                    </span>
                                    {currentWord.length > word.length
                                        ? currentWord
                                        : word}
                                </>
                            ) : (
                                <span>{word}</span>
                            )}
                        </pre>
                    ))}
                </>

                {/* {gameEnded ? (
                    <div>
                        <p className="text-3xl font-bold">Done!</p>
                        <p className="text-xl font-bold">
                            WPM was: {wordsPerMinute}
                        </p>
                    </div>
                ) : null} */}
            </div>
        </div>
    )
}

export default App
