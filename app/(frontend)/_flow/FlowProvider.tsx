"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  PropsWithChildren,
} from 'react'

// ------------ Types ------------
export type FlowCtx = Record<string, unknown>

interface FlowState {
  ctx: FlowCtx
}

interface FlowProviderProps extends PropsWithChildren {
  flowId: string // slug or id of the running flow
  /**
   * Persist strategy: "session" (default) keeps data only within the tab
   * "local" survives browser restarts.
   */
  persistence?: 'session' | 'local'
}

interface FlowContextValue {
  ctx: FlowCtx
  updateCtx: (patch: FlowCtx) => void
  resetCtx: () => void
}

// ------------ Internal helpers ------------
const defaultState: FlowState = { ctx: {} }

function reducer(state: FlowState, patch: FlowCtx | null): FlowState {
  if (patch === null) return defaultState
  return { ctx: { ...state.ctx, ...patch } }
}

const FlowContext = createContext<FlowContextValue | undefined>(undefined)

// ------------ Provider ------------
export function FlowProvider({
  flowId,
  children,
  persistence = 'session',
}: FlowProviderProps) {
  const storage: Storage | undefined =
    typeof window === 'undefined'
      ? undefined
      : persistence === 'local'
      ? window.localStorage
      : window.sessionStorage

  const storageKey = useMemo(() => `flow-${flowId}`, [flowId])

  const [state, dispatch] = useReducer(reducer, defaultState, (init) => {
    if (!storage) return init
    try {
      const raw = storage.getItem(storageKey)
      return raw ? { ctx: JSON.parse(raw) } : init
    } catch {
      return init
    }
  })

  // Persist on every change
  useEffect(() => {
    if (!storage) return
    try {
      storage.setItem(storageKey, JSON.stringify(state.ctx))
    } catch {
      /* ignore quota errors */
    }
  }, [state.ctx, storage, storageKey])

  const value: FlowContextValue = useMemo(
    () => ({
      ctx: state.ctx,
      updateCtx: (patch) => dispatch(patch),
      resetCtx: () => dispatch(null),
    }),
    [state.ctx]
  )

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}

// ------------ Hook ------------
export function useFlow(): FlowContextValue {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used within <FlowProvider>')
  return ctx
}
