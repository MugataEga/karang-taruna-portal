// src/context/RWContext.jsx
import { createContext, useContext, useState } from 'react'

const RWContext = createContext()

export function RWProvider({ children }) {
  const [activeRW, setActiveRW] = useState('all')
  return (
    <RWContext.Provider value={{ activeRW, setActiveRW }}>
      {children}
    </RWContext.Provider>
  )
}

export function useRW() {
  return useContext(RWContext)
}