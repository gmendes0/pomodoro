import { createContext, ReactNode, useMemo, useReducer, useState } from 'react'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  cycles: Cycle[]
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CycleContext = createContext({} as CyclesContextType)

interface CycleProviderProps {
  children: ReactNode
}

/**
 * Evitar acoplar bibliotecas externas no context para caso a gente troque a lib, o context continue funcionando
 */
export function CycleProvider(props: CycleProviderProps) {
  /**
   * Assim como o useState, serve para armazenar e alterar uma informação
   * É interessante utilizar o useReducer para armazenar
   * informações mais complexas com alterações complexas e com alteraçoes provindas de diferentes lugares da aplicaçao
   * É bom para centralizar todas as alterações que podem acontecer dentro de um estado, ex: criar, alterar, etc...
   *
   * 1 param = uma funçao com 2 params
   *           o primeiro é o valor atual em tempo real do estado
   *           o segundo é uma action, ou seja, qual ação queremos realizar para alterar o estado
   *           A função precisa retornar um valor, que será armazenado no estado
   * 2 param = valor inicial do estado
   *
   * O useReducer retorna um array bem parecido com o useState, onde o primeiro valor é o estado e o segundo
   * uma função para disparar uma action
   *
   * No caso do createNewCycle por exemplo, era necessário chamar um setCycles para adicionar um novo ciclo ao estado
   * e logo em seguida chamar um setActiveCycleId passando o id do novo ciclo adicionado ao estado, ou seja,
   * precisavamos atualizar 2 estados de uma vez só. Com o useReducer, podemos criar um estado que contenha essas 2
   * infos e quando dispararmos a action 'ADD_NEW_CYCLE', atualizamos a lista de ciclos e o activeCycleId ao mesmo tempo
   * sem precisarmos chamar 2 funçoes diferentes
   */
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  /**
   * Também da para desestruturar acima direto do array
   */
  const { activeCycleId, cycles } = cyclesState

  /**
   * Sempre iniciar o estado com um valor
   */
  // const [cycles, setCycles] = useState<Cycle[]>([])
  // const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  /**
   * array.find obtem o primeiro valor do array que atender a condição
   */
  const activeCycle = useMemo(
    () => cycles.find((cycle) => cycle.id === activeCycleId),
    [cycles, activeCycleId],
  )

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())

    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId)
    //       return { ...cycle, finishedDate: new Date() }

    //     return cycle
    //   })
    // )
    // setActiveCycleId(null)
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    /**
     * É preciso enviar alguma informaçao que possibilite distinguir dentro da função do useReducer
     * qual ação deve ser feita.
     *
     * Normalmente, é utilizado o padrao {type: '', payload: {}}
     */
    dispatch(addNewCycleAction(newCycle))

    // setCycles((state) => [...state, newCycle])
    // setActiveCycleId(newCycle.id)

    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())

    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId)
    //       return { ...cycle, interruptedDate: new Date() }

    //     return cycle
    //   })
    // )
    // setActiveCycleId(null)
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {props.children}
    </CycleContext.Provider>
  )
}
