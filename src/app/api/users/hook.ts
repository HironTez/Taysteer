import { UserDto } from "./users.dto";
import { getUsers } from "./query";
import { useState } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [page, setPage] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setLoading(true);

    await getUsers(page + 1, 1).then((data) => {
      if (data?.users?.length) {
        setUsers(users.concat(data.users));
        setPage(page + 1);
        setHasMore(data.pagination.hasMore)
      }
    });
    
    setLoading(false);
  };

  return { users, page, loading, hasMore, loadMore };
};
