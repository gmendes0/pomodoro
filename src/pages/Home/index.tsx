import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useContext } from 'react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { CycleContext } from '../../contexts/CyclesContext'

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

/**
 * Controlled - Manter a info que o usuário insere em tempo real no estado
 * Uncontrolled - Buscar o valor do input somente quando for preciso
 *
 * @todo - resetar o activeCycleId quando o ciclo terminar
 * @todo - parar o interval quando o ciclo terminar
 */
export function Home() {
  const { createNewCycle, interruptCurrentCycle, activeCycle } =
    useContext(CycleContext)

  /**
   * Hooks - acoplam funcionalidades a componentes
   * useForm - é como se estivesse criando um formulário na aplicação
   * register - é como se adicionasse um input ao form
   * watch - monitora o input para saber se houve mudanças, assim como no useState (controlled)
   * formState - possui infos do form, como os erros de validaçao
   * reset - volta os campos do form para o default value. Importante sempre setar todos os defaultValues para nao ter bugs
   */
  const newCycleForm = useForm<NewCycleFormData>({
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

  const { handleSubmit, watch, reset } = newCycleForm

  /**
   * handle porque é chamada através de um evento (padronizaçao nao obrigatória)
   */
  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)

    /**
     * volta os campos do form para o default value
     */
    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
            <HandPalm size={24} /> Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} /> Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
