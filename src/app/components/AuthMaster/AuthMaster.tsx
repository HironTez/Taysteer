import * as S from "./AuthMaster.style";

import React from "react";
import { useUser } from "@/app/api/users/[userId]/hook";

interface IAuthMasterProps {}

const AuthMaster = (props: IAuthMasterProps) => {
  const user = useUser("me");

  return <S.Container>{JSON.stringify(user)}</S.Container>;
};

export default AuthMaster;
