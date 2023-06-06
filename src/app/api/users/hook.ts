import { UserDto } from "./users.dto";
import { autoLoading } from "@/utils";
import { getUsers } from "./query";
import { useState } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [page, setPage] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = autoLoading(
    () =>
      getUsers(page + 1, 1).then((data) => {
        if (data?.users?.length) {
          setUsers(users.concat(data.users));
          setPage(page + 1);
          setHasMore(data.pagination.hasMore);
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
