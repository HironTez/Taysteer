import { UserResponseT } from "./users.dto";
import { autoLoading } from "@/utils";
import { getUsers } from "./query";
import { useState } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState<UserResponseT[]>([]);
  const [page, setPage] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = autoLoading(
    () =>
      getUsers(page + 1, 1).then((response) => {
        if (response?.data?.users.length) {
          setUsers(users.concat(response.data.users));
          setPage(page + 1);
          setHasMore(response.data.pagination.hasMore);
        }
      }),
    setLoading
  );

  return {
    users,
    page,
    loading,
    hasMore,
    loadMore,
  };
};
