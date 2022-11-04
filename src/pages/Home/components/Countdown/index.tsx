import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CycleContext } from '../../../../contexts/CyclesContext'
import { CountdownContainer, Separator } from './styles'

// interface CountdownProps {}

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CycleContext)

  const totalSeconds = activeCycle ? activeCycle?.minutesAmount * 60 : 0
  const currentSeconds = totalSeconds ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60 // resto da divisão

  /**
   * padStart - define um tamanho para a string e preenche com algum caractere
   * caso ela nao tenha o tamanho
   */
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    /**
     * Quando mudamos de aba, o tempo nao fica 1 segundo exato, porque o interval nao é muito preciso
     * Mas como o valor está sendo calculado com base na data de inicio, o valor mostrado no titulo fica correto,
     * ele só nao atualiza o titulo de 1 em 1 segundo exatamente
     */
    if (activeCycle) document.title = `${minutes}:${seconds} | Ignite timer`
  }, [minutes, seconds, activeCycle])

  /**
   * O useEffect sempre executa na primeira render
   */
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      /**
       * setTimeout e setInterval
       * O tempo colocado nesses metodos não é totalmente preciso, podendo variar quando ele está em backgroud
       * ou esteja rodando em um PC com processamento mais lento.
       * Portando, ao invés de somente adicionar 1 ao amountSecondsPassed, devemos obter a diferença em segundos
       * entre a data atual e a data de inicio do timer
       */
      interval = setInterval(() => {
        const calculatedDifferenceInSeconds = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        )

        if (calculatedDifferenceInSeconds >= totalSeconds) {
          markCurrentCycleAsFinished()

          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(calculatedDifferenceInSeconds)
        }
      }, 1000)
    }

    /**
     * Quando o useEffect for chamado outra vez por uma mudança das dependencias
     * essa função é executada para limpar o que foi feito no useEffect anterior
     */
    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ]) // activeCycleId nao parece ser necessária

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
