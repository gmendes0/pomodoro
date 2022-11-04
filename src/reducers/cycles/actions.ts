import { Cycle } from './reducer'

/**
 * Por padrao, os valores do enum ficam como numeros, 0, 1, 2...
 * por isso definimos um valor para cada chave
 */
export enum ActionTypes {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE', // eslint-disable-line
  INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE', // eslint-disable-line
  MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED', // eslint-disable-line
}

export const addNewCycleAction = (newCycle: Cycle) => ({
  type: ActionTypes.ADD_NEW_CYCLE,
  payload: {
    newCycle,
  },
})

export const interruptCurrentCycleAction = () => ({
  type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
})

export const markCurrentCycleAsFinishedAction = () => ({
  type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
})
