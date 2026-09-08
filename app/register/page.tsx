import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  const siteKey = process.env.TURNSTILE_SITE_KEY;

  if (!siteKey) {
    throw new Error("TURNSTILE_SITE_KEY is not configured");
  }

  return <RegisterForm siteKey={siteKey} />;
}
