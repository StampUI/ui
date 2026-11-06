"use client"

import * as React from "react"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/components/core/card"
import { Input } from "@/components/core/input"
import { Button } from "@/components/core/button"
import { Label } from "@/components/core/label"
import { Field } from "@/components/core/field"
import { Alert } from "@/components/core/alert"

export function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <Card className="w-full max-w-sm">
      <form autoComplete="off" onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <p className="text-sm text-muted-foreground mt-1.5">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </CardHeader>

        <CardBody className="space-y-4 pt-2">
          {isSubmitted ? (
            <Alert variant="success">
              <CheckCircle2 className="h-4 w-4" />
              Check your email. A reset link has been sent to you.
            </Alert>
          ) : (
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="off" placeholder="name@example.com" required />
            </Field>
          )}
        </CardBody>

        <CardFooter className="flex-col gap-3">
          {!isSubmitted && (
            <Button className="w-full" type="submit">
              Send reset link
            </Button>
          )}
          <Button variant="ghost" className="w-full text-muted-foreground" type="button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
