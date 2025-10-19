"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function AddChildPage() {
  const router = useRouter()
  const [children, setChildren] = useState([{ name: "", username: "", password: "" }])

  const addChild = () => {
    setChildren([...children, { name: "", username: "", password: "" }])
  }

  const updateChild = (index: number, field: string, value: string) => {
    const updated = [...children]
    updated[index] = { ...updated[index], [field]: value }
    setChildren(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement Supabase child account creation
    console.log("[v0] Creating children:", children)
    router.push("/guardian/dashboard")
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative shapes */}
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
            <p className="text-sprout-green">Add Child</p>
          </div>

          <Card className="p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {children.map((child, index) => (
                <div key={index} className="space-y-4 pb-6 border-b last:border-b-0">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Child Name*</Label>
                    <Input
                      id={`name-${index}`}
                      type="text"
                      placeholder="Type your child's name"
                      value={child.name}
                      onChange={(e) => updateChild(index, "name", e.target.value)}
                      required
                      className="bg-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`username-${index}`}>Username*</Label>
                    <Input
                      id={`username-${index}`}
                      type="text"
                      placeholder="Type your child's username"
                      value={child.username}
                      onChange={(e) => updateChild(index, "username", e.target.value)}
                      required
                      className="bg-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`password-${index}`}>Password*</Label>
                    <Input
                      id={`password-${index}`}
                      type="password"
                      placeholder="Type your child's password"
                      value={child.password}
                      onChange={(e) => updateChild(index, "password", e.target.value)}
                      required
                      className="bg-secondary"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={addChild}
                variant="outline"
                className="w-full border-sprout-green text-sprout-green hover:bg-sprout-light bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Child
              </Button>

              <Button
                type="submit"
                className="w-full bg-sprout-green hover:bg-sprout-dark text-white font-semibold py-6"
              >
                Create Account
              </Button>
            </form>
          </Card>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-16 h-2 bg-sprout-green rounded-full"></div>
          </div>
        </div>
      </main>
    </div>
  )
}
