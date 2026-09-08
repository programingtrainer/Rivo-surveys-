"use client";

import { useMemo, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

type RegisterFormProps = {
  siteKey: string;
};

export default function RegisterForm({ siteKey }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requirements = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9\s]/.test(password),
      noSpaces: !/\s/.test(password),
    }),
    [password]
  );

  const passwordValid = Object.values(requirements).every(Boolean);

  const passwordsMatch =
    password.length > 0 && password === confirmPassword;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!passwordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    if (!turnstileToken) {
      setError("Please complete the security verification.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Unable to create account. Please try again."
        );
        setLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <a
            href="/"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Rivo Surveys
          </a>

          <h1 className="mt-8 text-3xl font-bold text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-gray-600">
            Join Rivo Surveys and start earning rewards.
          </p>
        </div>

        <a href="/api/auth/google/start" className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"><span className="text-lg font-bold">G</span>Continue with Google</a>

        <div className="my-6 flex items-center gap-4"><div className="h-px flex-1 bg-gray-200" /><span className="text-sm text-gray-400">or</span><div className="h-px flex-1 bg-gray-200" /></div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="Create a strong password"
            />

            <div className="mt-3 rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">
                Password requirements
              </p>

              <ul className="mt-3 space-y-2 text-sm">
                <Requirement
                  valid={requirements.length}
                  text="At least 8 characters"
                />
                <Requirement
                  valid={requirements.uppercase}
                  text="At least one uppercase letter"
                />
                <Requirement
                  valid={requirements.lowercase}
                  text="At least one lowercase letter"
                />
                <Requirement
                  valid={requirements.number}
                  text="At least one number"
                />
                <Requirement
                  valid={requirements.special}
                  text="At least one special character"
                />
                <Requirement
                  valid={requirements.noSpaces}
                  text="No spaces"
                />
              </ul>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="Confirm your password"
            />

            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-2 text-sm text-red-600">
                Passwords do not match.
              </p>
            )}

            {passwordsMatch && (
              <p className="mt-2 text-sm text-green-600">
                Passwords match.
              </p>
            )}
          </div>

          <div>
            <Turnstile
              siteKey={siteKey}
              onSuccess={(token) => setTurnstileToken(token)}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              !passwordValid ||
              !passwordsMatch ||
              !turnstileToken
            }
            className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-black hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}

function Requirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <li className={valid ? "text-green-600" : "text-gray-500"}>
      <span className="mr-2">{valid ? "✓" : "○"}</span>
      {text}
    </li>
  );
}
