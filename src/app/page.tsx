"use client"

import Users from "./users/page";
import styled from "styled-components";

const MainStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 6rem;
  min-height: 100vh;
`;

export default async function Home() {
  return (
    <MainStyled>
      <Users />
    </MainStyled>
  );
}
