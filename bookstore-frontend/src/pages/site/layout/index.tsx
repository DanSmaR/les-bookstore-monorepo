import React from 'react'
import { Outlet } from 'react-router'

import { Chatbot } from '@/components'
import { useAuth } from '@/providers'

import { Footer, Header } from './components'
import * as S from './styles'

interface LayoutProps {
  children?: React.ReactNode
}

export const SiteLayout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth()

  return (
    <S.LayoutContainer>
      <Header />
      <S.MainContent>{children || <Outlet />}</S.MainContent>
      <Footer />
      {isAuthenticated && <Chatbot />}
    </S.LayoutContainer>
  )
}
