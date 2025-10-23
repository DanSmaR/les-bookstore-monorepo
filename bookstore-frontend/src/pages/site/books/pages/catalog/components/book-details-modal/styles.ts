import { BookOpen } from 'phosphor-react'
import styled from 'styled-components'

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

export const ModalContent = styled.div`
  width: 95vw;
  max-width: 1200px;
  max-height: 95vh;
  background: #fff;
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.SPACING.LG};
  border-bottom: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
`

export const ModalTitle = styled.h2`
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  margin: 0;
`

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: ${(props) => props.theme.SPACING.SM};
  cursor: pointer;
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  transition: all ${(props) => props.theme.TRANSITIONS.FAST};

  &:hover {
    background: ${(props) => props.theme.COLORS.NEUTRAL_100};
    color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  }
`

export const ModalBody = styled.div`
  padding: ${(props) => props.theme.SPACING.XL};
  overflow-y: auto;
  flex: 1;
`

export const BookDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: ${(props) => props.theme.SPACING.XXL};

  @media (max-width: 1024px) {
    grid-template-columns: 300px 1fr;
    gap: ${(props) => props.theme.SPACING.XL};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${(props) => props.theme.SPACING.LG};
  }
`

export const BookImageSection = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  overflow: hidden;
  background: ${(props) => props.theme.COLORS.NEUTRAL_50};

  @media (max-width: 1024px) {
    height: 400px;
  }

  @media (max-width: 768px) {
    height: 350px;
    max-width: 280px;
    margin: 0 auto;
  }
`

export const ModalBookImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const ModalPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.COLORS.NEUTRAL_100};
  color: ${(props) => props.theme.COLORS.NEUTRAL_400};
`

export const PlaceholderIcon = styled(BookOpen).attrs({
  size: 120,
  weight: 'light',
})``

export const ModalBadgeContainer = styled.div`
  position: absolute;
  top: ${(props) => props.theme.SPACING.MD};
  right: ${(props) => props.theme.SPACING.MD};
`

export const BookInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.LG};
`

export const BookTitle = styled.h1`
  font-size: ${(props) => props.theme.FONT_SIZE.XXLARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  margin: 0;
  line-height: 1.3;
`

export const BookAuthor = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.XLARGE};
  color: ${(props) => props.theme.COLORS.NEUTRAL_700};
  margin: 0;
  font-style: italic;
`

export const BookPublisher = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  margin: 0;
`

export const BookPublishedDate = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  margin: 0;
`

export const BookISBN = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  margin: 0;
  font-family: monospace;
`

export const StockInfo = styled.p<{ isLow?: boolean; isOut?: boolean }>`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  margin: 0;

  color: ${(props) => {
    if (props.isOut) return props.theme.COLORS.ERROR_MAIN
    if (props.isLow) return props.theme.COLORS.WARNING_MAIN
    return props.theme.COLORS.SUCCESS_MAIN
  }};
`

export const DescriptionSection = styled.div`
  margin-top: ${(props) => props.theme.SPACING.MD};
`

export const DescriptionTitle = styled.h3`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_900};
  margin: 0 0 ${(props) => props.theme.SPACING.SM} 0;
`

export const BookDescription = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  color: ${(props) => props.theme.COLORS.NEUTRAL_700};
  line-height: 1.6;
  margin: 0;
`

export const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.LG};
  margin-top: ${(props) => props.theme.SPACING.XL};
  padding-top: ${(props) => props.theme.SPACING.XL};
  border-top: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
`

export const BookPrice = styled.p`
  font-size: ${(props) => props.theme.FONT_SIZE.XXLARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  margin: 0;
`
