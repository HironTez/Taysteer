import styled from "styled-components";

export const Container = styled.aside`
  flex-grow: 0;
  display: flex;
  justify-content: center;
  padding: 8px;
  width: 88px;

  > *:not(:last-child) {
    margin-bottom: 5px;
  }
`;
