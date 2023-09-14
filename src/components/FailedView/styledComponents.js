import styled from 'styled-components/macro'

export const FailureHeading = styled.h1`
    font-size: 25px;
    color:${props => props.headingColor};
`

export const FailureContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content:center;
`