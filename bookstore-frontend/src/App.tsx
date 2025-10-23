import { RouterProvider } from 'react-router'
import { ThemeProvider } from 'styled-components'

import { AuthProvider, CartProvider, ToastProvider } from '@/providers'

import { Router } from './routes'
import { defaultTheme, GlobalStyle } from './styles'

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <RouterProvider router={Router} />
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
