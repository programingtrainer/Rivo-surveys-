import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    throw new Error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured");
  }

  return <RegisterForm siteKey={siteKey} />;
}
