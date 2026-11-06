"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/components/core/card"
import { Input } from "@/components/core/input"
import { PasswordInput } from "@/components/core/password-input"
import { Button } from "@/components/core/button"
import { Label } from "@/components/core/label"
import { Checkbox } from "@/components/core/checkbox"
import { Field } from "@/components/core/field"

export function SignupSimple() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <p className="text-sm text-muted-foreground mt-1.5">
          Enter your details below to create your account and get started.
        </p>
      </CardHeader>

      <CardBody className="space-y-4 pt-2">
        <Field>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" autoComplete="off" placeholder="John Doe" />
        </Field>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="off" placeholder="name@example.com" />
        </Field>
        
        <Field>
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" placeholder="Create a password" />
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Must be at least 8 characters long.
          </p>
        </Field>

        <div className="flex items-start space-x-2 pt-1">
          <Checkbox id="terms" className="mt-0.5" />
          <label
            htmlFor="terms"
            className="text-xs leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
          >
            I agree to the{" "}
            <a href="#" className="text-foreground hover:underline underline-offset-2">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-foreground hover:underline underline-offset-2">Privacy Policy</a>.
          </label>
        </div>
      </CardBody>

      <CardFooter className="flex-col gap-3">
        <Button className="w-full">Create account</Button>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="#" className="text-foreground hover:underline underline-offset-4">
            Sign in
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
