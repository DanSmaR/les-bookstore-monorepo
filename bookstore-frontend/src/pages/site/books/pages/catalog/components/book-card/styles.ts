import styled from 'styled-components'

export const Card = styled.div`
  background: #fff;
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  overflow: hidden;
  transition: all ${(props) => props.theme.TRANSITIONS.NORMAL};
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;

  &:hover {
    box-shadow: ${(props) => props.theme.SHADOWS.LG};
    border-color: ${(props) => props.theme.COLORS.NEUTRAL_300};
    transform: translateY(-2px);
  }
`

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  background: ${(props) => props.theme.COLORS.NEUTRAL_50};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

export const BookImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const PlaceholderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.COLORS.NEUTRAL_100};
  color: ${(props) => props.theme.COLORS.NEUTRAL_400};
`

export const StockBadgeContainer = styled.div`
  position: absolute;
  top: ${(props) => props.theme.SPACING.SM};
  right: ${(props) => props.theme.SPACING.SM};
`

export const Content = styled.div`
  padding: ${(props) => props.theme.SPACING.MD};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.XS};
  flex: 1;
`

export const Title = styled.h3`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  min-height: 2.8em;
`

export const Author = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  margin: 0;
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
`

export const Publisher = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.XSMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  margin: 0;
`

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => props.theme.SPACING.XS};
  padding-top: ${(props) => props.theme.SPACING.XS};
  border-top: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_100};
`

export const ISBN = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.XXSMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  font-family: monospace;
`

type StockProps = {
  isLow: boolean
  isOut: boolean
}

export const Stock = styled.span<StockProps>`
  font-size: ${(props) => props.theme.FONT_SIZE.XXSMALL};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  color: ${(props) => {
    if (props.isOut) return props.theme.COLORS.ERROR_MAIN
    if (props.isLow) return props.theme.COLORS.WARNING_MAIN
    return props.theme.COLORS.SUCCESS_MAIN
  }};
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: ${(props) => props.theme.SPACING.SM};
`

export const Price = styled.span`
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
`
