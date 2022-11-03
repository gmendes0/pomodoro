import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'
import { useEffect, useMemo, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

/**
 * schema based - define um formato e valida os dados com base nesse formato
 */
const newCycleFormValidationSchema = z.object({
  task: z.string().min(1, 'Por favor, informe a tarefa'),
  minutesAmount: z
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 60 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

/**
 * Infere uma tipagem a partir do schema do zod
 * Quando precisamos referenciar uma variavel JS dentro do TS usamos typeof
 */
type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
}

/**
 * Controlled - Manter a info que o usuário insere em tempo real no estado
 * Uncontrolled - Buscar o valor do input somente quando for preciso
 */
export function Home() {
  /**
   * Sempre iniciar o estado com um valor
   */
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  /**
   * array.find obtem o primeiro valor do array que atender a condição
   */
  const activeCycle = useMemo(
    () => cycles.find((cycle) => cycle.id === activeCycleId),
    [cycles, activeCycleId]
  )

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
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate)
        )
      }, 1000)
    }

    /**
     * Quando o useEffect for chamado outra vez por uma mudança das dependencias
     * essa função é executada para limpar o que foi feito no useEffect anterior
     */
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  /**
   * Hooks - acoplam funcionalidades a componentes
   * useForm - é como se estivesse criando um formulário na aplicação
   * register - é como se adicionasse um input ao form
   * watch - monitora o input para saber se houve mudanças, assim como no useState (controlled)
   * formState - possui infos do form, como os erros de validaçao
   * reset - volta os campos do form para o default value. Importante sempre setar todos os defaultValues para nao ter bugs
   */
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    /**
     * Resolver de validação
     */
    resolver: zodResolver(newCycleFormValidationSchema),

    /**
     * Valores iniciais
     */
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  })

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)

    /**
     * volta os campos do form para o default value
     */
    reset()
  }

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

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            type="text"
            placeholder="Dê um nome para a sua tarefa"
            list="task-suggestions"
            {...register('task')}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} /> Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
