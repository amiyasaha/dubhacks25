import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sprout-green to-sprout-dark flex items-center justify-center p-6">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-sprout-green">Thank you for signing up!</CardTitle>
          <CardDescription>Check your email to confirm your account</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            We've sent you a confirmation email. Please check your inbox and click the confirmation link to activate
            your account before signing in.
          </p>
          <Link href="/login">
            <Button className="w-full bg-sprout-green hover:bg-sprout-dark text-white">Go to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
