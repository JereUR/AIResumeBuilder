import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex h-screen items-center justify-center p-3">
      <SignUp />
    </main>
  )
}
