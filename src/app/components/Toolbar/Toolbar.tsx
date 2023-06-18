import * as S from "./Toolbar.style";

import { ColorModeContext } from "@/app/providers";
import React from "react";

interface IToolbarProps {}

const Toolbar = (props: IToolbarProps) => {
  const colorMode = React.useContext(ColorModeContext);
  return (
    <S.Container>
      <button onClick={colorMode.toggleColorMode}>Toggle</button>
    </S.Container>
  );
};

export default Toolbar;
