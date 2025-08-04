import React, { useState, useCallback, useMemo } from 'react'
import styles from './App.module.css'

const Calculator = React.memo(() => {
  const [firstValue, setFirstValue] = useState('')
  const [secondValue, setSecondValue] = useState('')
  const [operator, setOperator] = useState(null)
  const [isResultShown, setIsResultShown] = useState(false)

  const handleButtonClick = useCallback((value) => {
    if (operator) {
      setSecondValue(prev => prev + value)
    } else {
      setFirstValue(prev => prev + value)
    }
  }, [operator])

  const handleOperatorClick = useCallback((op) => {
    if (isResultShown) {
      setIsResultShown(false)
      setSecondValue('')
    }
    if (firstValue && !secondValue) {
      setOperator(op)
    }
  }, [isResultShown, firstValue, secondValue])

  const handleReset = useCallback(() => {
    setFirstValue('')
    setSecondValue('')
    setOperator(null)
    setIsResultShown(false)
  }, [])

  const handleEqual = useCallback(() => {
    if (!firstValue || !operator || !secondValue) return

    let result
    if (operator === '+') {
      result = parseInt(firstValue) + parseInt(secondValue)
    } else if (operator === '-') {
      result = parseInt(firstValue) - parseInt(secondValue)
    }

    setFirstValue(String(result))
    setSecondValue('')
    setIsResultShown(true)
    setOperator(null)
  }, [firstValue, operator, secondValue])

  const displayValue = useMemo(() => {
    if (isResultShown) return firstValue
    return `${firstValue}${operator || ''}${secondValue}`
  }, [firstValue, operator, secondValue, isResultShown])

  const displayStyle = useMemo(() => ({
    color: isResultShown ? 'blue' : 'black'
  }), [isResultShown])

  const numbers = useMemo(() => [...Array(10).keys()], [])

  return (
    <div className={styles.container}>
      <div
        className={styles.display}
        style={displayStyle}
      >
        {displayValue || '0'}
      </div>
      <div className={styles.buttons}>
        {numbers.map((num) => (
          <NumberButton
            key={num}
            number={num}
            onClick={handleButtonClick}
          />
        ))}
        <OperatorButton
          operator="+"
          onClick={handleOperatorClick}
        />
        <OperatorButton
          operator="-"
          onClick={handleOperatorClick}
        />
        <button
          className={`${styles.button} ${styles.equals}`}
          onClick={handleEqual}
        >
          =
        </button>
        <button
          className={`${styles.button} ${styles.reset}`}
          onClick={handleReset}
        >
          C
        </button>
      </div>
    </div>
  )
})

// Memoized sub-components to prevent unnecessary re-renders
const NumberButton = React.memo(({ number, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(String(number))
  }, [number, onClick])

  return (
    <button
      className={styles.button}
      onClick={handleClick}
    >
      {number}
    </button>
  )
})

const OperatorButton = React.memo(({ operator, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(operator)
  }, [operator, onClick])

  return (
    <button
      className={`${styles.button} ${styles.operator}`}
      onClick={handleClick}
    >
      {operator}
    </button>
  )
})

Calculator.displayName = 'Calculator'
NumberButton.displayName = 'NumberButton'
OperatorButton.displayName = 'OperatorButton'

export default Calculator
