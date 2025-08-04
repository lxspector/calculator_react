import React, { Suspense } from 'react'
import styles from './App.module.css'

// Lazy load the Calculator component for code splitting
const Calculator = React.lazy(() => import('./Calculator'))

// Simple loading component
const LoadingSpinner = () => (
  <div className={styles.loading}>
    <div className={styles.spinner}></div>
    <p>Loading Calculator...</p>
  </div>
)

function App() {
  return (
    <div className={styles.App}>
      <Suspense fallback={<LoadingSpinner />}>
        <Calculator />
      </Suspense>
    </div>
  )
}

export default App
