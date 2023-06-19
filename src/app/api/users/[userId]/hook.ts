import { autoLoading } from "@/utils";
import { useEffect, useState } from "react";
import { UserResponseT } from "./user.dto";
import { getUser } from "./query";

export const useUser = (userId: string | undefined | null) => {
  const [user, setUser] = useState<UserResponseT>();
  const [loading, setLoading] = useState(false);
  const [prevUserId, setPrevUserId] = useState("");

  useEffect(() => {
    if (userId && !loading && userId !== prevUserId)
      autoLoading(
        () =>
          getUser(userId).then((response) => {
            if (response?.data) {
              setUser(response.data);
              setPrevUserId(userId);
            }
          }),
        setLoading
      );
  }, [loading, prevUserId, user, userId]);

  return {
    user,
    loading,
  };
};
