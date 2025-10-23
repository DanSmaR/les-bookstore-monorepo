import styled from 'styled-components'

export const BookCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`

export const BookMainInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.XS};
  flex: 1;
`

export const BookTitle = styled.h3`
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  margin: 0;
  line-height: 1.3;
`

export const BookAuthor = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_700};
  margin: 0;
`

export const BookISBN = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  font-family: 'Roboto Mono', monospace;
`

export const BookContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.MD};
`

export const BookDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.SM};
`

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const DetailLabel = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
`

export const DetailValue = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
`

export const Price = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
`

export const ActionButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.SPACING.SM};
  margin-top: ${(props) => props.theme.SPACING.SM};
`

export const StatusBadge = styled.div<{ status: string }>`
  padding: ${(props) => props.theme.SPACING.XS}
    ${(props) => props.theme.SPACING.SM};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};

  ${(props) => {
    if (props.status === 'Em estoque') {
      return `
        background: ${props.theme.COLORS.SUCCESS_LIGHTER};
        color: ${props.theme.COLORS.SUCCESS_DARK};
      `
    }
    return `
      background: ${props.theme.COLORS.ERROR_LIGHTER};
      color: ${props.theme.COLORS.ERROR_DARK};
    `
  }}
`
