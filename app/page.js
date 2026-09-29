"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return <button onClick={() => signIn("google")}>Sign in with Google</button>;
  }

  return (
    <div>
      <p>Logged in as {session.user.name}</p>
      <p>Your user id: {session.user.id}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}