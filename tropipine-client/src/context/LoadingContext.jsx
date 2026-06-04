import { createContext, useContext } from 'react'

export const LoadingContext = createContext({ setDataLoading: () => {} })

export function usePageLoading() {
  return useContext(LoadingContext).setDataLoading
}
