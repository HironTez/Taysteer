"use client";

import React, { PropsWithChildren } from "react";

import Toolbar from "./components/Toolbar";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: row;

  background-color: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const Main = styled.main`
  flex-grow: 1;
`;

const StyledLayout = (props: PropsWithChildren) => (
  <Container>
    <Toolbar />
    <Main>{props.children}</Main>
  </Container>
);

export default StyledLayout;
