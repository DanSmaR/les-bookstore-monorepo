import {
  BookOpen,
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
} from 'phosphor-react'

import * as S from './styles'

export const Footer = () => {
  return (
    <S.FooterContainer>
      <S.Container>
        <S.FooterContent>
          {/* Logo and description */}
          <S.LogoSection>
            <S.LogoWrapper>
              <S.LogoIcon>
                <BookOpen size={20} weight="bold" />
              </S.LogoIcon>
              <S.LogoText>BookStore</S.LogoText>
            </S.LogoWrapper>
            <S.Description>
              Sua livraria online favorita. Encontre os melhores livros com os
              melhores preços e entrega rápida para todo o Brasil.
            </S.Description>
            <S.SocialLinks>
              <S.SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <FacebookLogo size={24} />
              </S.SocialLink>
              <S.SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <TwitterLogo size={24} />
              </S.SocialLink>
              <S.SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <InstagramLogo size={24} />
              </S.SocialLink>
            </S.SocialLinks>
          </S.LogoSection>
        </S.FooterContent>

        <S.FooterDivider />

        <S.FooterBottom>
          <S.Copyright>
            © 2024 BookStore. Todos os direitos reservados.
          </S.Copyright>
        </S.FooterBottom>
      </S.Container>
    </S.FooterContainer>
  )
}
