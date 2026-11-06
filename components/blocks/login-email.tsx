"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/components/core/card"
import { Input } from "@/components/core/input"
import { PasswordInput } from "@/components/core/password-input"
import { Button } from "@/components/core/button"
import { Label } from "@/components/core/label"
import { Checkbox } from "@/components/core/checkbox"
import { Field } from "@/components/core/field"

export function LoginEmail() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in to StampUI</CardTitle>
        <p className="text-sm text-muted-foreground mt-1.5">
          Enter your email and password to access your account.
        </p>
      </CardHeader>

      <CardBody className="space-y-4 pt-2">
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="off" placeholder="name@example.com" />
        </Field>
        
        <Field>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Forgot password?
            </a>
          </div>
          <PasswordInput id="password" placeholder="Enter your password" />
        </Field>

        <div className="flex items-center space-x-2 pt-1">
          <Checkbox id="remember" />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
          >
            Remember me for 30 days
          </label>
        </div>
      </CardBody>

      <CardFooter className="flex-col gap-3">
        <Button className="w-full">Sign in</Button>
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="#" className="text-foreground hover:underline underline-offset-4">
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
