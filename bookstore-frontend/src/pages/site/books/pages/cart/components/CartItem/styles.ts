import styled from 'styled-components'

export const CartItemContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.SPACING.LG};
  padding: ${(props) => props.theme.SPACING.LG};
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_50};
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_200};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.LG};
  box-shadow: ${(props) => props.theme.SHADOWS.SM};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${(props) => props.theme.SHADOWS.MD};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${(props) => props.theme.SPACING.MD};
  }
`

export const BookImage = styled.div`
  width: 120px;
  height: 160px;
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_200};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_300};

  @media (max-width: 768px) {
    width: 100px;
    height: 130px;
  }
`

export const BookImagePlaceholder = styled.div`
  width: 120px;
  height: 160px;
  border-radius: ${(props) => props.theme.BORDER_RADIUS.MD};
  background-color: ${(props) => props.theme.COLORS.NEUTRAL_200};
  border: 1px solid ${(props) => props.theme.COLORS.NEUTRAL_300};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};

  @media (max-width: 768px) {
    width: 100px;
    height: 130px;
  }
`

export const BookDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.SPACING.SM};
`

export const BookTitle = styled.h3`
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  margin: 0;
  line-height: 1.3;
`

export const BookAuthor = styled.p`
  color: ${(props) => props.theme.COLORS.NEUTRAL_600};
  font-size: ${(props) => props.theme.FONT_SIZE.MEDIUM};
  margin: 0;
`

export const BookPrice = styled.p`
  color: ${(props) => props.theme.COLORS.PRIMARY_MAIN};
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  margin: 0;
`

export const BookMeta = styled.div`
  display: flex;
  gap: ${(props) => props.theme.SPACING.MD};
  color: ${(props) => props.theme.COLORS.NEUTRAL_500};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${(props) => props.theme.SPACING.XS};
  }
`

export const BookISBN = styled.span`
  &::before {
    content: 'ISBN: ';
    font-weight: ${(props) => props.theme.FONT_WEIGHT.MEDIUM};
  }
`

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${(props) => props.theme.SPACING.MD};
  min-width: 180px;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: auto;
    width: 100%;
  }
`

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.COLORS.ERROR_MAIN};
  cursor: pointer;
  padding: ${(props) => props.theme.SPACING.SM};
  border-radius: ${(props) => props.theme.BORDER_RADIUS.SM};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.SPACING.XS};
  font-size: ${(props) => props.theme.FONT_SIZE.SMALL};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.COLORS.ERROR_LIGHTER};
    color: ${(props) => props.theme.COLORS.ERROR_DARK};
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.COLORS.ERROR_MAIN};
    outline-offset: 2px;
  }
`

export const TotalPrice = styled.div`
  color: ${(props) => props.theme.COLORS.NEUTRAL_800};
  font-size: ${(props) => props.theme.FONT_SIZE.LARGE};
  font-weight: ${(props) => props.theme.FONT_WEIGHT.BOLD};
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
  }
`
