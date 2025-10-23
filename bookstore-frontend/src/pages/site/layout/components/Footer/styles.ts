import styled from 'styled-components'

export const FooterContainer = styled.footer`
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_50};
  border-top: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  margin-top: auto;
`

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => `${props.theme.SPACING.XXL} ${props.theme.SPACING.LG}`};

  @media (max-width: 768px) {
    padding: ${(props) =>
      `${props.theme.SPACING.XL} ${props.theme.SPACING.MD}`};
  }
`

export const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${(props) => props.theme.SPACING.XL};

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
`

export const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.MD};

  @media (min-width: 768px) {
    grid-column: span 2;
  }
`

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.SM};
  margin-bottom: ${(props) => props.theme.SPACING.MD};
`

export const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
`

export const LogoText = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
`

export const Description = styled.p`
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  line-height: 1.6;
  margin-bottom: ${(props) => props.theme.SPACING.MD};
  max-width: 400px;
`

export const SocialLinks = styled.div`
  display: flex;
  gap: ${(props) => props.theme.SPACING.MD};
`

export const SocialLink = styled.a`
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  }
`

export const FooterDivider = styled.hr`
  margin: ${(props) => props.theme.SPACING.XL} 0;
  border: none;
  border-top: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
`

export const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.MD};

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`

export const Copyright = styled.p`
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
`

export const PaymentIcon = styled.div`
  height: 24px;
  padding: ${(props) => `${props.theme.SPACING.XS} ${props.theme.SPACING.SM}`};
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_100};
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  display: flex;
  align-items: center;
  justify-content: center;
`
