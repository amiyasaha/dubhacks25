"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function GuardianSignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/guardian/dashboard`,
          data: {
            role: "guardian",
            name: name,
          },
        },
      })
      if (error) throw error
      router.push("/auth/signup-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-sprout-green rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/4 right-0 w-48 h-96 bg-sprout-green translate-x-1/3 transform rotate-12"></div>
      <div className="absolute bottom-0 left-0 w-96 h-64 bg-sprout-green -translate-x-1/3 translate-y-1/3 transform -rotate-12"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sprout-green rounded-full translate-x-1/2 translate-y-1/2"></div>

      <header className="relative z-10 p-6">
        <Link href="/">
          <h1 className="text-2xl font-bold text-sprout-green">Sprout</h1>
        </Link>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-12 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sprout-light rounded-full mb-4">
              <div className="w-8 h-10 bg-sprout-green rounded-t-full"></div>
            </div>
            <h2 className="text-3xl font-bold text-sprout-green mb-2">Guardian</h2>
            <p className="text-sprout-green">Create Account</p>
          </div>

          <Card className="p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Type your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Type your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-secondary"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-sprout-green hover:bg-sprout-dark text-white font-semibold py-6"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/guardian/login" className="text-sprout-green font-semibold hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </Card>

          <div className="flex justify-center gap-2 mt-8">
            <div className="w-16 h-2 bg-sprout-green rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </main>
    </div>
  )
}
