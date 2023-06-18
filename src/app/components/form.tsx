"use client";

import Link from "next/link";
import LoadingDots from "./loading-dots";
import { StatusCodes } from "http-status-codes";
import { logIn } from "../api/auth/[...nextauth]/query";
import { register } from "../api/auth/register/query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Form({ type }: { type: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        const login: string = e.currentTarget.login.value;
        const password: string = e.currentTarget.password.value;

        e.preventDefault();
        setLoading(true);

        if (type === "login") {
          // Log in
          logIn(login, password).then((result) => {
            setLoading(false);

            if (result?.ok) router.push("/");
            // Handle errors
            else if (result?.error) toast.error(result.error);
          });
        } else {
          // Register
          register(login, password).then((result) => {
            console.log("🚀 ~ file: form.tsx:37 ~ register ~ result:", result)
            if (result.ok) {
              // Log in
              logIn(login, password).then((result) => {
                setLoading(false);

                if (result?.ok) router.push("/");
                else router.push("/login");
              });
            }
            // Handle errors
            else if (result.error) {
              setLoading(false);

              switch (result.error.status) {
                case StatusCodes.CONFLICT:
                  toast.error("This email already registered");
                  break;
              }
            }
          });
        }
      }}
    >
      <div>
        <label htmlFor="text">Login</label>
        <input
          id="login"
          name="login"
          type="login"
          placeholder="Email or username"
          autoComplete="login"
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>
      <button disabled={loading}>
        {loading ? (
          <LoadingDots color="#808080" />
        ) : (
          <p>{type === "login" ? "Sign In" : "Sign Up"}</p>
        )}
      </button>
      {type === "login" ? (
        <p>
          Don&apos;t have an account? <Link href="/register">Sign up</Link> for
          free.
        </p>
      ) : (
        <p>
          Already have an account? <Link href="/login">Sign in</Link> instead.
        </p>
      )}
    </form>
  );
}
