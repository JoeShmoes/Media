
"use client";

import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

import { auth } from "@/lib/firebase";
import { signInWithEmail, signUpWithEmail, sendPasswordReset } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  phone: z.string().min(1, { message: "Phone number is required." }),
  age: z.coerce.number().min(18, { message: "You must be at least 18." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;


export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoginView, setIsLoginView] = React.useState(true);
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });
  
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
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

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    const { success, error } = await signInWithEmail(data.email, data.password);
    if (success) {
        router.push('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error || "Invalid email or password. Please try again.",
      });
    }
    setIsSubmitting(false);
  }

  const onSignUpSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    const { confirmPassword, ...signUpData } = data;
    const { success, error } = await signUpWithEmail(signUpData);
    if (success) {
        router.push('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error || "Could not create an account. The email may already be in use.",
      });
    }
    setIsSubmitting(false);
  }
  
  const onPasswordResetSubmit = async (data: ResetPasswordFormValues) => {
      setIsSubmitting(true);
      const { success, error } = await sendPasswordReset(data.email);
      if (success) {
          toast({
              title: "Password Reset Email Sent",
              description: "Check your inbox for a link to reset your password.",
          });
          setIsResetDialogOpen(false);
      } else {
          toast({
              variant: "destructive",
              title: "Error Sending Reset Email",
              description: error || "Could not send password reset email. Please check the email address.",
          });
      }
      setIsSubmitting(false);
  }


  const formStyles = {
    input: "bg-gray-800/50 border-gray-700 h-12 focus:border-primary",
    button: "h-12 text-base font-semibold bg-white text-black hover:bg-gray-200",
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">
        <div className="w-full max-w-md space-y-8">

            <h2 className="text-center text-2xl font-semibold tracking-tight">
              {isLoginView ? "Welcome back" : "Create an account"}
            </h2>
            
            {isLoginView ? (
                 <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Input id="login-email" type="email" placeholder="Email" {...loginForm.register("email")} className={formStyles.input} />
                        {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Input id="login-password" type="password" placeholder="Password" {...loginForm.register("password")} className={formStyles.input}/>
                        {loginForm.formState.errors.password && <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>}
                    </div>
                    <Button type="submit" className={`w-full ${formStyles.button}`} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    </Button>
                     <div className="text-center">
                        <button type="button" onClick={() => setIsResetDialogOpen(true)} className="text-sm font-semibold text-white/70 hover:text-white transition">
                            Forgot password?
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Input id="firstName" placeholder="First name" {...signUpForm.register("firstName")} className={formStyles.input}/>
                            {signUpForm.formState.errors.firstName && <p className="text-sm text-destructive">{signUpForm.formState.errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Input id="lastName" placeholder="Last name" {...signUpForm.register("lastName")} className={formStyles.input}/>
                            {signUpForm.formState.errors.lastName && <p className="text-sm text-destructive">{signUpForm.formState.errors.lastName.message}</p>}
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Input id="phone" type="tel" placeholder="Phone number" {...signUpForm.register("phone")} className={formStyles.input}/>
                            {signUpForm.formState.errors.phone && <p className="text-sm text-destructive">{signUpForm.formState.errors.phone.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Input id="age" type="number" placeholder="Age" {...signUpForm.register("age")} className={formStyles.input}/>
                            {signUpForm.formState.errors.age && <p className="text-sm text-destructive">{signUpForm.formState.errors.age.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Input id="signup-email" type="email" placeholder="Email" {...signUpForm.register("email")} className={formStyles.input}/>
                        {signUpForm.formState.errors.email && <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Input id="signup-password" type="password" placeholder="Password" {...signUpForm.register("password")} className={formStyles.input}/>
                         {signUpForm.formState.errors.password && <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Input id="confirmPassword" type="password" placeholder="Confirm Password" {...signUpForm.register("confirmPassword")} className={formStyles.input}/>
                         {signUpForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>}
                    </div>
                    <Button type="submit" className={`w-full ${formStyles.button}`} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                    </Button>
                </form>
            )}

            <p className="text-center text-sm text-muted-foreground">
                {isLoginView ? "Don't have an account? " : "Already using Nexaris Media? "}
                <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-white hover:underline focus:outline-none">
                    {isLoginView ? "Sign up" : "Sign in"}
                </button>
            </p>
        </div>
        
        <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <AlertDialogContent>
            <form onSubmit={resetPasswordForm.handleSubmit(onPasswordResetSubmit)}>
                 <AlertDialogHeader>
                  <AlertDialogTitle>Reset your password</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter your email address and we will send you a link to reset your password.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Input id="reset-email" type="email" placeholder="Email" {...resetPasswordForm.register("email")} className="bg-background"/>
                    {resetPasswordForm.formState.errors.email && <p className="text-sm text-destructive mt-2">{resetPasswordForm.formState.errors.email.message}</p>}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Email"}
                  </Button>
                </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>

    </div>
  );
}
