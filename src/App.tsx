import {useState, useEffect, KeyboardEventHandler, useRef} from "react"
import wordList from "./wordList"

function App() {
    const [words, setWords] = useState<string[]>([])
    const [wordsDelay, setWordsDelay] = useState<string[]>([])
    const [currentWord, setCurrentWord] = useState("")
    const [currentKey, setCurrentKey] = useState(0)
    const [startWordDate, setStartWordDate] = useState<string>("")
    const [started, setStarted] = useState(false)
    const [gameEnd, setGameEnd] = useState(false)

    const wordsPerMinute = useRef(0)

    useEffect(() => {
        generateWords()
    }, [])

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
        if (event.key == "Escape") {
            resetGame()
        }

        if (event.key == "Backspace") {
            let newCurrentWord = structuredClone(currentWord)

            setCurrentWord(newCurrentWord.slice(0, -1))

            return
        }

        if (currentWord.length > 22) return

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

    const generateWords = () => {
        let newWords: string[] = []
        let randomNumbers: number[] = []

        for (let i = 0; i < 25; i++) {
            let number: number = 0
            do {
                number = Math.floor(Math.random() * wordList.length)
            } while (randomNumbers.includes(number))

            randomNumbers.push(number)
            newWords.push(wordList[number] + " ")
        }

        newWords[newWords.length - 1] = newWords[newWords.length - 1].slice(
            0,
            -1
        )

        setWords(newWords)
    }

    const endGame = () => {
        let totalTime = 0
        wordsDelay.map((word) => (totalTime += Number(word)))
        wordsPerMinute.current = 25 / (totalTime / 60000)
    }

    const resetGame = () => {
        generateWords()
        setWordsDelay([])
        setCurrentWord("")
        setCurrentKey(0)
        setStartWordDate("")
        setStarted(false)
        setGameEnd(false)
    }

    useEffect(() => {
        currentKey === 25 ? (endGame(), setGameEnd(true)) : null
    }, [currentKey])

    useEffect(() => {
        if (currentWord === words[currentKey]) {
            setWordsDelay([
                ...wordsDelay,
                (Date.now() - Number(startWordDate)).toString(),
            ])

            setStartWordDate(Date.now().toString())

            setCurrentKey(currentKey + 1)
            setCurrentWord("")

            return
        }

        if (!started && currentWord.length > 0) {
            setStartWordDate(Date.now().toString())
            setStarted(true)
        }
    }, [currentWord])

    return (
        <div
            className="flex w-full h-screen justify-center items-center"
            onKeyDown={handleKeyDown}
            autoFocus={true}
            tabIndex={0}
        >
            <div className="relative w-[60rem] flex flex-wrap justify-center text-start text-[#565656] text-2xl">
                <input className="w-0 h-0" type="text" autoFocus />
                {!gameEnd
                    ? words.map((word, index) => (
                          <pre
                              className="relative inline text-5xl leading-[3.8rem]"
                              key={index}
                          >
                              {index == currentKey ? (
                                  <>
                                      <span className="">
                                          {currentWord.length >= word.length ? (
                                              <>
                                                  {word.slice(0, -1)}
                                                  <span className="text-red-500">
                                                      {currentWord.slice(
                                                          word.length - 1
                                                      )}
                                                  </span>
                                              </>
                                          ) : (
                                              word
                                          )}
                                      </span>

                                      <span className="absolute left-0 top-0 text-white">
                                          {[...currentWord].map(
                                              (letter, letterIndex) => (
                                                  <span
                                                      className={`${
                                                          words[currentKey][
                                                              letterIndex
                                                          ] !== letter
                                                              ? "text-red-400"
                                                              : "text-yellow-300"
                                                      }`}
                                                      key={letterIndex}
                                                  >
                                                      {letter ==
                                                      words[currentKey][
                                                          letterIndex
                                                      ]
                                                          ? letter
                                                          : words[currentKey][
                                                                letterIndex
                                                            ]}
                                                  </span>
                                              )
                                          )}
                                      </span>
                                  </>
                              ) : (
                                  <span
                                      className={`${
                                          index < currentKey
                                              ? "text-yellow-300"
                                              : ""
                                      }`}
                                  >
                                      {word}
                                  </span>
                              )}
                          </pre>
                      ))
                    : null}

                {gameEnd ? (
                    <div className="text-center">
                        <p className="text-5xl font-bold text-white">Done!</p>
                        <p className="text-3xl font-bold text-yellow-300">
                            WPM: {Math.floor(wordsPerMinute.current)}
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default App
