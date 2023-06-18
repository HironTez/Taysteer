import { autoLoading } from "@/utils";
import { useState } from "react";
import { UserResponseT } from "./user.dto";
import { getUser } from "./query";

export const useUser = (userId: string | undefined | null) => {
  const [user, setUser] = useState<UserResponseT>();
  const [loading, setLoading] = useState(false);

  if (userId && !loading && !user)
    autoLoading(
      () =>
        getUser(userId).then((response) => {
          if (response?.data) {
            setUser(response.data);
          }
        }),
      setLoading
    )();

  return {
    user,
    loading,
  };
};
