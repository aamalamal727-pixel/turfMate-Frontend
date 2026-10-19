import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, Sparkles, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { cn } from 'cn'

function Auth() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isLogin = searchParams.get('mode') !== 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, login } = useAuth()
  const navigate = useNavigate()

  const [userInput, setUserInput] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleInput = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value })
  }

  const switchMode = (loginMode) => {
    const next = loginMode ? {} : { mode: 'register' }
    setSearchParams(next, { replace: true })
  }

  const validateRegister = () => {
    const { username, phone, email, password, confirmPassword } = userInput
    if (!username || !phone || !email || !password || !confirmPassword) {
      Toast.error('Please fill all fields')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Toast.error('Please enter a valid email address')
      return false
    }
    if (password.length < 6) {
      Toast.error('Password must be at least 6 characters')
      return false
    }
    if (password !== confirmPassword) {
      Toast.error('Passwords do not match')
      return false
    }
    return true
  }

  const validateLogin = () => {
    const { email, password } = userInput
    if (!email || !password) {
      Toast.error('Please enter email and password')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (isLogin) {
        if (!validateLogin()) return
        const response = await login({ email: userInput.email, password: userInput.password })
        if (response.status === 200) {
          Toast.success('Login successful! Welcome back.')
          navigate('/')
        } else {
          if (!response.response) {
            Toast.error('Unable to connect to TurfMate server')
          } else {
            const errMsg =
              response.response?.data?.error || response.response?.data || 'Login failed'
            Toast.error(errMsg)
          }
        }
      } else {
        if (!validateRegister()) return
        const response = await register({
          username: userInput.username,
          email: userInput.email,
          password: userInput.password,
          phone: userInput.phone,
        })
        if (response.status === 200) {
          Toast.success('Registration successful! Please login.')
          setUserInput({
            username: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
          })
          switchMode(true)
        } else {
          if (!response.response) {
            Toast.error('Unable to connect to TurfMate server')
          } else {
            const errMsg =
              response.response?.data?.error || response.response?.data || 'Registration failed'
            Toast.error(errMsg)
          }
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 font-heading text-xl font-bold text-white shadow-lg shadow-emerald-500/30">
            T
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {isLogin
              ? 'Sign in to access your turf bookings and player dashboard.'
              : 'Join TurfMate to discover and book sports pitches near you.'}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          {/* Toggle */}
          <div className="mb-7 flex rounded-xl border border-border bg-background p-1">
            {['Sign In', 'Register'].map((label, i) => {
              const active = isLogin === (i === 0)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => switchMode(i === 0)}
                  className={cn(
                    'flex-1 rounded-lg py-2.5 text-xs font-bold transition-all',
                    active
                      ? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="username">Full Name</Label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    name="username"
                    value={userInput.username}
                    onChange={handleInput}
                    placeholder="John Doe"
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={userInput.phone}
                    onChange={handleInput}
                    placeholder="+91 98765 43210"
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={userInput.email}
                  onChange={handleInput}
                  placeholder="player@turfmate.com"
                  className="h-11 rounded-xl pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={userInput.password}
                  onChange={handleInput}
                  placeholder="••••••••"
                  className="h-11 rounded-xl pr-10 pl-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <ShieldCheck className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={userInput.confirmPassword}
                    onChange={handleInput}
                    placeholder="••••••••"
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-1 h-12 w-full rounded-xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            >
              {isLoading ? 'Please wait...' : isLogin ? 'Sign In to TurfMate' : 'Register Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(!isLogin)}
              className="font-bold text-emerald-400 hover:underline"
            >
              {isLogin ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
          <Sparkles className="size-3.5 text-emerald-400" />
          Protected with secure authentication and role-based access.
        </p>
      </div>
    </div>
  )
}

export default Auth