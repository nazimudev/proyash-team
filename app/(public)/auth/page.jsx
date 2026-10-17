import Link from "next/link";
import Container from "@/components/ui/Container";
import LoginForm from "@/components/auth/LoginForm";
import { isConfigured } from "@/lib/membershipService";

export const metadata = {
  title: "Member Login | Proyash Songgothon",
  description:
    "Sign in to check your Proyash Songgothon membership application status.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <section className="bg-mist pb-20 pt-32 sm:pt-36">
      <Container className="max-w-md">
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink">
          Member Login
        </h1>
        <p className="mt-3 text-muted">
          Sign in to check your application status or access your membership.
        </p>
        <div className="mt-8">
          <LoginForm signInOpen={isConfigured("login")} />
        </div>
      </Container>
    </section>
  );
}
