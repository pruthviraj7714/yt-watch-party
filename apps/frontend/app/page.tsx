"use client";

import { signIn, signOut, useSession } from "next-auth/react";


export default function Landing() {
    const session = useSession();
  
  return <div className="flex flex-col">
      Landing Page
      <button onClick={async () =>  await signIn('github')}>
        Login with github
      </button>
      <button onClick={async () => await signOut()}>
        Logout
      </button>
      {session && JSON.stringify(session?.data?.user)}
  </div>;
}
