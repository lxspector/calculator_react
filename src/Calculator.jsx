import React, { useState, useCallback, useMemo, useEffect } from 'react'
import styles from './App.module.css'

const Calculator = React.memo(() => {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [operator, setOperator] = useState(null)
  const [prevValue, setPrevValue] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState([])

  const inputDigit = useCallback((digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(prev => prev === '0' ? String(digit) : prev + digit)
    }
  }, [waitingForOperand])

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(prev => prev + '.')
    }
  }, [waitingForOperand, display])

  const toggleSign = useCallback(() => {
    setDisplay(prev => {
      const val = parseFloat(prev)
      if (val === 0) return prev
      return String(-val)
    })
  }, [])

  const inputPercent = useCallback(() => {
    const val = parseFloat(display)
    setDisplay(String(val / 100))
  }, [display])

  const calculate = useCallback((left, right, op) => {
    switch (op) {
      case '+': return left + right
      case '-': return left - right
      case '×': return left * right
      case '÷': return right !== 0 ? left / right : 'Error'
      default: return right
    }
  }, [])

  const handleOperator = useCallback((nextOp) => {
    const inputValue = parseFloat(display)

    if (prevValue !== null && operator && !waitingForOperand) {
      const result = calculate(prevValue, inputValue, operator)
      if (result === 'Error') {
        setDisplay('Error')
        setExpression('')
        setPrevValue(null)
        setOperator(null)
        setWaitingForOperand(true)
        return
      }
      const rounded = Math.round(result * 1e12) / 1e12
      setDisplay(String(rounded))
      setPrevValue(rounded)
      setExpression(`${rounded} ${nextOp}`)
    } else {
      setPrevValue(inputValue)
      setExpression(`${inputValue} ${nextOp}`)
    }

    setWaitingForOperand(true)
    setOperator(nextOp)
  }, [display, prevValue, operator, waitingForOperand, calculate])

  const handleEqual = useCallback(() => {
    if (operator === null || prevValue === null) return

    const inputValue = parseFloat(display)
    const result = calculate(prevValue, inputValue, operator)

    if (result === 'Error') {
      setHistory(prev => [`${prevValue} ${operator} ${inputValue} = Error`, ...prev].slice(0, 10))
      setDisplay('Error')
      setExpression('')
      setPrevValue(null)
      setOperator(null)
      setWaitingForOperand(true)
      return
    }

    const rounded = Math.round(result * 1e12) / 1e12
    const expr = `${prevValue} ${operator} ${inputValue} = ${rounded}`
    setHistory(prev => [expr, ...prev].slice(0, 10))
    setExpression(expr)
    setDisplay(String(rounded))
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }, [display, prevValue, operator, calculate])

  const handleClear = useCallback(() => {
    setDisplay('0')
    setExpression('')
    setOperator(null)
    setPrevValue(null)
    setWaitingForOperand(false)
  }, [])

  const handleBackspace = useCallback(() => {
    if (waitingForOperand || display === 'Error') return
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')
  }, [waitingForOperand, display])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(parseInt(e.key))
      else if (e.key === '.') inputDot()
      else if (e.key === '+') handleOperator('+')
      else if (e.key === '-') handleOperator('-')
      else if (e.key === '*') handleOperator('×')
      else if (e.key === '/') { e.preventDefault(); handleOperator('÷') }
      else if (e.key === 'Enter' || e.key === '=') handleEqual()
      else if (e.key === 'Escape') handleClear()
      else if (e.key === 'Backspace') handleBackspace()
      else if (e.key === '%') inputPercent()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputDigit, inputDot, handleOperator, handleEqual, handleClear, handleBackspace, inputPercent])

  const formatDisplay = useMemo(() => {
    if (display === 'Error') return 'Error'
    const num = parseFloat(display)
    if (isNaN(num)) return display
    if (display.endsWith('.')) return display
    if (display.includes('.') && display.endsWith('0')) return display
    if (Math.abs(num) >= 1e12) return num.toExponential(4)
    return display
  }, [display])

  return (
    <div className={styles.calculator}>
      {/* History panel */}
      <div className={styles.historyPanel}>
        <div className={styles.historyHeader}>
          <span className={styles.historyTitle}>History</span>
          {history.length > 0 && (
            <button className={styles.clearHistory} onClick={clearHistory}>Clear</button>
          )}
        </div>
        <div className={styles.historyList}>
          {history.length === 0 ? (
            <div className={styles.historyEmpty}>No calculations yet</div>
          ) : (
            history.map((item, i) => (
              <div key={i} className={styles.historyItem}>{item}</div>
            ))
          )}
        </div>
      </div>

      {/* Display */}
      <div className={styles.displayArea}>
        <div className={styles.expression}>{expression || '\u00A0'}</div>
        <div className={styles.display}>{formatDisplay}</div>
      </div>

      {/* Buttons */}
      <div className={styles.buttons}>
        <button className={`${styles.button} ${styles.fnBtn}`} onClick={handleClear}>AC</button>
        <button className={`${styles.button} ${styles.fnBtn}`} onClick={toggleSign}>+/−</button>
        <button className={`${styles.button} ${styles.fnBtn}`} onClick={inputPercent}>%</button>
        <button className={`${styles.button} ${styles.opBtn}`} onClick={() => handleOperator('÷')}>÷</button>

        <CalcButton value={7} onClick={inputDigit} />
        <CalcButton value={8} onClick={inputDigit} />
        <CalcButton value={9} onClick={inputDigit} />
        <button className={`${styles.button} ${styles.opBtn}`} onClick={() => handleOperator('×')}>×</button>

        <CalcButton value={4} onClick={inputDigit} />
        <CalcButton value={5} onClick={inputDigit} />
        <CalcButton value={6} onClick={inputDigit} />
        <button className={`${styles.button} ${styles.opBtn}`} onClick={() => handleOperator('-')}>−</button>

        <CalcButton value={1} onClick={inputDigit} />
        <CalcButton value={2} onClick={inputDigit} />
        <CalcButton value={3} onClick={inputDigit} />
        <button className={`${styles.button} ${styles.opBtn}`} onClick={() => handleOperator('+')}>+</button>

        <button className={`${styles.button} ${styles.numBtn} ${styles.zeroBtn}`} onClick={() => inputDigit(0)}>0</button>
        <button className={`${styles.button} ${styles.numBtn}`} onClick={inputDot}>.</button>
        <button className={`${styles.button} ${styles.backBtn}`} onClick={handleBackspace}>⌫</button>
        <button className={`${styles.button} ${styles.eqBtn}`} onClick={handleEqual}>=</button>
      </div>
    </div>
  )
})

const CalcButton = React.memo(({ value, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(value)
  }, [value, onClick])

  return (
    <button className={`${styles.button} ${styles.numBtn}`} onClick={handleClick}>
      {value}
    </button>
  )
})

Calculator.displayName = 'Calculator'
CalcButton.displayName = 'CalcButton'

export default Calculator
