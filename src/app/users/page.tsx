"use client";

import { useUsers } from "@/app/api/users/hook";

const Users = () => {
  const { users, page, loading, hasMore, loadMore } = useUsers();

  return (
    <>
      {JSON.stringify(users)}
      <button onClick={loadMore} disabled={!hasMore}>
        {hasMore ? (loading ? "loading" : "Load more") : "No more"}
      </button>
    </>
  );
};

export default Users;
