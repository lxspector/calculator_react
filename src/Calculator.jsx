import React, { useState } from 'react'
import styles from './App.module.css'

function Calculator() {
  const [firstValue, setFirstValue] = useState('')
  const [secondValue, setSecondValue] = useState('')
  const [operator, setOperator] = useState(null)
  const [isResultShown, setIsResultShown] = useState(false)

  const handleButtonClick = (value) => {
    if (operator) {
      setSecondValue(secondValue + value)
    } else {
      setFirstValue(firstValue + value)
    }
  }

  const handleOperatorClick = (op) => {
    if (isResultShown) {
      setIsResultShown(false)
      setSecondValue('')
    }
    if (firstValue && !secondValue) {
      setOperator(op)
    }
  }

  const handleReset = () => {
    setFirstValue('')
    setSecondValue('')
    setOperator(null)
    setIsResultShown(false)
  }

  const handleEqual = () => {
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
  }

  const displayValue = () => {
    if (isResultShown) return firstValue
    return `${firstValue}${operator || ''}${secondValue}`
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.display}
        style={{ color: isResultShown ? 'blue' : 'black' }}
      >
        {displayValue() || '0'}
      </div>
      <div className={styles.buttons}>
        {[...Array(10).keys()].map((num) => (
          <button
            key={num}
            className={styles.button}
            onClick={() => handleButtonClick(String(num))}
          >
            {num}
          </button>
        ))}
        <button
          className={`${styles.button} ${styles.operator}`}
          onClick={() => handleOperatorClick('+')}
        >
          +
        </button>
        <button
          className={`${styles.button} ${styles.operator}`}
          onClick={() => handleOperatorClick('-')}
        >
          -
        </button>
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
}

export default Calculator
