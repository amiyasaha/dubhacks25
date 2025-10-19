import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sprout-green to-sprout-dark">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-white">Sprout</h1>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <div className="text-4xl">💰</div>
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">Sprout</h2>
          <p className="text-xl text-white/90 max-w-md">
            Sprout your child's financial literacy skills with gamified learning
          </p>
        </div>

        {/* Role Selection Card */}
        <Card className="max-w-md mx-auto p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-2xl font-bold text-sprout-green">Get started</h3>
            <span className="text-2xl">🌱</span>
          </div>
          <p className="text-muted-foreground mb-6">Which role best describes you?</p>

          <div className="flex gap-4">
            <Link href="/guardian/signup" className="flex-1">
              <Button className="w-full bg-sprout-green hover:bg-sprout-dark text-white font-semibold py-6 text-lg">
                Guardian
              </Button>
            </Link>
            <Link href="/child/signup" className="flex-1">
              <Button className="w-full bg-sprout-green hover:bg-sprout-dark text-white font-semibold py-6 text-lg">
                Child
              </Button>
            </Link>
          </div>
        </Card>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-8">Teach financial literacy</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-sprout-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h4 className="font-bold mb-2">Missions</h4>
              <p className="text-sm text-muted-foreground">Complete chores and earn rewards</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-sprout-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h4 className="font-bold mb-2">Shop</h4>
              <p className="text-sm text-muted-foreground">Spend your earnings wisely</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-sprout-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="font-bold mb-2">Group Savings</h4>
              <p className="text-sm text-muted-foreground">Save together for shared goals</p>
            </Card>
          </div>
        </div>

        {/* Gamified Learning Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">Gamified learning</h3>
          <Card className="max-w-2xl mx-auto p-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-2">Your Missions</h4>
                <div className="bg-secondary rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Do laundry</p>
                        <p className="text-sm text-muted-foreground">Reward: $5</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">10/18/2025</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Decorative Piggy Bank */}
    </div>
  )
}
