import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 12px;
  justify-content: space-evenly;
  background: #ffffff;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: #000000;
  font-size: 20px;
  width: 100%;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: #ffffff;
    background: #93b954;
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export function NodeTabs({ active }: { active: 'staking-lp' | 'staking-single' }) {
  const { t } = useTranslation()
  return (
    <Tabs style={{ width: '100%' }}>
      <StyledNavLink id={`staking-lp-nav-link`} to={'/staking-lp'} isActive={() => active === 'staking-lp'}>
        {t('Node Staking')}
      </StyledNavLink>
      <StyledNavLink id={`staking-single-nav-link`} to={'/staking-single'} isActive={() => active === 'staking-single'}>
        {t('SAD Staking')}
      </StyledNavLink>
    </Tabs>
  )
}
