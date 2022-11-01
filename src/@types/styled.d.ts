import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

/* Arquivo de definição de tipos */

type ThemeType = typeof defaultTheme

// cria uma tipagem para o módulo styled-components
// sempre que eu importar styled-components, ele vai pegar essa tipagem
// como o styled-components foi importado ali em cima,
// o declare module vai apenas sobrescrever o que for passado abaixo, e nao o criar uma nova tipagem do 0
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
