/* eslint-disable no-console */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon, CheckIcon, ExternalLinkIcon, EyeIcon, EyeOffIcon, GithubIcon, Loader2Icon, LockIcon } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <div className="flex flex-col items-center p-8 md:pt-18 h-svh">
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
                <ExternalLinkIcon className="size-4" />
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
        <SocialIcons isSignIn={isSignIn} />
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

function SocialIcons({ isSignIn }: { isSignIn: boolean }) {
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
                <Loader2Icon className="size-4 animate-spin" />
              )
            : (
                <GithubIcon className="size-4" />
              )
        }
        Continue with GitHub
      </Button>
      { isSignIn && (
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
                  <Loader2Icon className="size-4 animate-spin" />
                )
              : (
                  <LockIcon className="size-4" />
                )
          }
          Continue with SSO
        </Button>
      )}
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
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve(true) : reject(new Error('Invalid login credentials'))
      }, 1000)
    }).finally(() => {
      setIsSubmitting(false)
    })

    toast.promise(promise, {
      loading: 'Signing in...',
      success: 'Signed in successfully',
      error: error => error.message || 'Unknown error',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 text-sm">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Email</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                {fieldState.invalid && (
                  <AlertCircleIcon className="size-5 absolute right-2 top-1/2 -translate-y-1/2 text-destructive" />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                {fieldState.invalid && (
                  <AlertCircleIcon className="size-5 absolute right-2 top-1/2 -translate-y-1/2 text-destructive" />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2Icon className="animate-spin size-4" /> }
          Sign In
        </Button>
      </form>
    </Form>
  )
}

const signUpSchema = z.object({
  email: z.string().min(1, 'Email is a required field').email('Email must be a valid email'),
  password: z.string()
    .min(1, 'Password is a required field')
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password cannot exceed 72 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .regex(/\d/, 'Password must contain at least 1 number')
    .regex(/[^\w\s]/, 'Password must contain at least 1 symbol'),
})

function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  })

  const password = form.watch('password')
  const passwordRequirements = [
    { label: 'Uppercase letter', isMet: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', isMet: /[a-z]/.test(password) },
    { label: 'Number', isMet: /\d/.test(password) },
    { label: 'Special character (e.g. !?<>@#$%)', isMet: /[^\w\s]/.test(password) },
    { label: '8 characters or more', isMet: password.length >= 8 },
    { label: '72 characters or less', isMet: password.length <= 72 },
  ]

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values)

    setIsSubmitting(true)
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve(true) : reject(new Error('Failed to sign up'))
      }, 1000)
    }).finally(() => {
      setIsSubmitting(false)
    })

    toast.promise(promise, {
      loading: 'Signing up...',
      success: 'Signed up successfully',
      error: error => error.message || 'Unknown error',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 text-sm">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Email</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                {fieldState.invalid && (
                  <AlertCircleIcon className="size-5 absolute right-2 top-1/2 -translate-y-1/2 text-destructive" />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...field}
                    onFocus={() => setShowPasswordRequirements(true)}
                  />
                </FormControl>
                {fieldState.invalid && (
                  <AlertCircleIcon className="size-5 absolute right-12 top-1/2 -translate-y-1/2 text-destructive" />
                )}
                <button
                  type="button"
                  className="z-50 absolute right-2 top-1/2 -translate-y-1/2 border-input inline-flex items-center justify-center rounded py-1 border px-2 cursor-pointer"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {showPasswordRequirements && (
          <div className={cn(
            'animate-in slide-in-from-top-4 fade-in duration-500',
            'mb-4 flex flex-col gap-1 text-sm text-muted-foreground',
          )}
          >
            {passwordRequirements.map(({ label, isMet }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={cn('size-3.5 rounded-full border flex items-center justify-center', isMet && 'bg-border')}>
                  {isMet && <CheckIcon className="size-2.5" />}
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2Icon className="animate-spin size-4" /> }
          Sign Up
        </Button>
      </form>
    </Form>
  )
}
