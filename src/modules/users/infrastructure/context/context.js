import { createContext } from 'react'

// Separate context object so files can export only components or only hooks
// This file exports only the context (a non-component), which is fine for fast-refresh rules
export const UserContext = createContext(null)
