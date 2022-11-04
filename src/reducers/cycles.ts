export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

/**
 * Por padrao, os valores do enum ficam como numeros, 0, 1, 2...
 * por isso definimos um valor para cada chave
 */
export enum ActionTypes {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
  INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
  MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
}

export function cyclesReducer(state: CyclesState, action: any) {
  // Essa função é executada quando o dispatch é chamado
  // O valor passado no parametro do dispatch() vai estar disponível no 'action'

  // console.log(state)
  // console.log(action)

  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }

    case ActionTypes.INTERRUPT_CURRENT_CYCLE:
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId)
            return { ...cycle, interruptedDate: new Date() }

          return cycle
        }),
        activeCycleId: null,
      }

    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId)
            return { ...cycle, finishedDate: new Date() }

          return cycle
        }),
      }

    default:
      return state
  }
}
