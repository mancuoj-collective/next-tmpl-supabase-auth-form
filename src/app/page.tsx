/* eslint-disable no-console */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLinkIcon, EyeIcon, EyeOffIcon, GithubIcon, Loader2Icon, LockIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-svh">
      <Tabs defaultValue="sign-in">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          <div className="flex items-center">
            <ThemeToggle />
            <Button asChild variant="ghost">
              <a
                href="https://github.com/mancuoj-collective/next-tmpl-supabase-auth-form"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon />
              </a>
            </Button>
          </div>
        </div>
        <TabsContent value="sign-in">
          <SignCard title="Welcome back" description="Sign in to your account" mode="sign-in" />
        </TabsContent>
        <TabsContent value="sign-up">
          <SignCard title="Get started" description="Create an account" mode="sign-up" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SignCard({
  title,
  description,
  mode,
}: {
  title: string
  description: string
  mode: 'sign-in' | 'sign-up'
}) {
  const isSignIn = mode === 'sign-in'

  return (
    <div className="flex w-[330px] sm:w-[384px] flex-col">
      <div className="mt-8 mb-10 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold lg:text-3xl">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-5">
        <SocialIcons />
        <div className="flex w-full items-center justify-center overflow-hidden">
          <Separator />
          <span className="px-2 text-sm text-muted-foreground">or</span>
          <Separator />
        </div>
        {isSignIn ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  )
}

function SocialIcons() {
  const [isGitHubLoading, setIsGitHubLoading] = useState(false)
  const [isSSOLoading, setIsSSOLoading] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        disabled={isGitHubLoading}
        onClick={() => {
          setIsGitHubLoading(true)
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 1000)
          }).then(() => {
            setIsGitHubLoading(false)
          })
        }}
      >
        {
          isGitHubLoading
            ? (
                <Loader2Icon className="animate-spin" />
              )
            : (
                <GithubIcon />
              )
        }
        Continue with GitHub
      </Button>
      <Button
        variant="outline"
        disabled={isSSOLoading}
        onClick={() => {
          setIsSSOLoading(true)
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 1000)
          }).then(() => {
            setIsSSOLoading(false)
          })
        }}
      >
        {
          isSSOLoading
            ? (
                <Loader2Icon className="animate-spin" />
              )
            : (
                <LockIcon />
              )
        }
        Continue with SSO
      </Button>
    </>
  )
}

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Must be a valid email'),
  password: z.string().min(1, 'Password is required'),
})

function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  })

  function onSubmit(values: z.infer<typeof signInSchema>) {
    console.log(values)

    setIsSubmitting(true)
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 1000)
    }).then(() => {
      setIsSubmitting(false)
    })

    toast.promise(promise, {
      loading: 'Signing in...',
      success: 'Signed in successfully',
      error: 'Invalid login credentials',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 text-sm">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
          Sign In
        </Button>
      </form>
    </Form>
  )
}

function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-muted-foreground">Email</Label>
        <Input id="email" placeholder="you@example.com" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-muted-foreground">Password</Label>
        <div className="relative">
          <Input
            id="password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
          />
          <Button
            onClick={() => setShowPassword(v => !v)}
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon /> }
          </Button>
        </div>
      </div>
      <Button>Sign Up</Button>
    </div>
  )
}
