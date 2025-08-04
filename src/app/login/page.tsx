
"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

import { auth } from "@/lib/firebase";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  React.useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  if (loading || user) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    const user = await signInWithGoogle();
    if (user) {
        router.push('/dashboard');
    } else {
        setIsSubmitting(false);
    }
  }

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    const user = await signInWithEmail(data.email, data.password);
    if (user) {
        router.push('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
      setIsSubmitting(false);
    }
  }

  const onSignUpSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    const user = await signUpWithEmail(data.email, data.password);
    if (user) {
        router.push('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "Could not create an account. The email may already be in use.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">
        <div className="flex flex-col items-center text-center mb-8">
            <Link href="/" className="mb-4">
                <Icons.logo className="w-16 h-16 text-white" />
            </Link>
            <h1 className="text-3xl font-bold">Welcome to Nexaris Media</h1>
            <p className="text-muted-foreground mt-2">Your central AI command hub. Sign in to continue.</p>
        </div>
        <Tabs defaultValue="login" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Log In</CardTitle>
                        <CardDescription>Enter your credentials to access your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input id="login-email" type="email" placeholder="you@example.com" {...loginForm.register("email")} />
                                {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input id="login-password" type="password" {...loginForm.register("password")} />
                                {loginForm.formState.errors.password && <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>}
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Log In
                            </Button>
                        </form>
                         <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                          </div>
                        </div>
                        <Button className="w-full" variant="outline" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                           {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2"/>}
                           Google
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="signup">
                 <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>Create a new account to get started.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input id="signup-email" type="email" placeholder="you@example.com" {...signUpForm.register("email")} />
                                {signUpForm.formState.errors.email && <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" type="password" {...signUpForm.register("password")} />
                                 {signUpForm.formState.errors.password && <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>}
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        </form>
                         <div className="relative my-4">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                          </div>
                        </div>
                        <Button className="w-full" variant="outline" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                           {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2"/>}
                           Google
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        <p className="text-xs text-muted-foreground mt-8 text-center max-w-sm">
            By signing in, you agree to our <Link href="/terms-of-service" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>.
        </p>
    </div>
  );
}

    