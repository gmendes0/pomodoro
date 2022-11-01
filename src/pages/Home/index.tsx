import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { string, z } from 'zod'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

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
 */
export function Home() {
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
    console.log(data)

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
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} /> Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
