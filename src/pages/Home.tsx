import { UserButton, useUser } from "@clerk/clerk-react";

export default function HomePage() {
  const { user } = useUser();
  return (
    <>
      <h1>Hello {user?.firstName}</h1>
      <p>Contact to: <a href="mailto:alex.anguloh@gmail.com">[here]</a></p>
      <UserButton />
    </>
  )
}