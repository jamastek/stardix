import React, { createContext, useState, useEffect, useContext } from "react"

enum Theme {
  DARK = "dark",
  LIGHT = "light"
}

type ThemeContextType = [
  Theme | null,
  React.Dispatch<React.SetStateAction<Theme | null>>,
]

type ThemeProviderProps = {
  children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

ThemeContext.displayName = "ThemeContext"

const prefersLight = "(prefers-color-scheme: light)"

const themes: Array<Theme> = Object.values(Theme)

const getPreferredTheme = () => window.matchMedia(prefersLight).matches ? Theme.LIGHT : Theme.DARK

const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return null
    return getPreferredTheme()
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersLight)
    const onChange = () => setTheme(mediaQuery.matches ? Theme.LIGHT : Theme.DARK)
    mediaQuery.addEventListener("change", onChange)
    return () => mediaQuery.removeEventListener("change", onChange)
  }, [])

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}

const useTheme = () => {
  const context = useContext(ThemeContext)
  return context
}

const isTheme = (value: string) => {
  return themes.includes(value as Theme)
}

export {
  ThemeProvider,
  useTheme,
  Theme,
  isTheme
}