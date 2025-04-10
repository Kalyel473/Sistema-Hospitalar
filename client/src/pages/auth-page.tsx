import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Eye, EyeOff, Mail, User, Lock, KeyRound } from "lucide-react";
import HospitalLogo from "@/components/ui/hospital-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido")
});

// Register schema
const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["CLIENT", "EMPLOYEE", "MANAGER"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não são iguais",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CLIENT",
    },
  });
  
  // Forgot password form
  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      username: data.email,
      password: data.password,
    });
  };

  // Handle register submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate({
      ...userData,
      username: userData.email,
    });
  };
  
  // Handle reset password submission
  const onResetPasswordSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setResetPasswordLoading(true);
      
      // Aqui faríamos uma chamada para a API para enviar o email
      // Simularemos um sucesso após 1,5 segundos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email enviado com sucesso",
        description: "Instruções para redefinir sua senha foram enviadas para seu email.",
        variant: "default",
      });
      
      setResetPasswordOpen(false);
      forgotPasswordForm.reset();
    } catch (error) {
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar instruções para redefinir sua senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  // If user is already logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 md:px-0 bg-background">
      <Card className="w-full max-w-md bg-background border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <HospitalLogo className="h-16 w-auto" />
            </div>
            <h1 className="font-sans text-3xl font-bold text-foreground mb-2">HospitalSys</h1>
            <p className="text-muted-foreground text-sm">Sistema de Gerenciamento de Equipamentos Cirúrgicos</p>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                              <Mail className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="seu.email@exemplo.com"
                              type="email"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              className="pl-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-muted-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {loginMutation.error && (
                    <Alert variant="destructive">
                      <AlertDescription>{loginMutation.error.message}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Entrando..." : "Entrar"}
                  </Button>

                  <div className="flex items-center justify-between">
                    <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="text-muted-foreground px-0">
                          Esqueci minha senha
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-background border-primary/20">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Recuperação de Senha</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Digite seu email para receber instruções de como redefinir sua senha.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...forgotPasswordForm}>
                          <form onSubmit={forgotPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
                            <FormField
                              control={forgotPasswordForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-muted-foreground">Email</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                        <Mail className="h-5 w-5" />
                                      </span>
                                      <Input 
                                        placeholder="seu.email@exemplo.com" 
                                        type="email"
                                        className="pl-10 bg-background"
                                        {...field} 
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter className="mt-6">
                              <Button
                                type="button"
                                variant="outline"
                                className="border-primary/20 text-foreground"
                                onClick={() => setResetPasswordOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                type="submit"
                                className="bg-primary text-primary-foreground"
                                disabled={resetPasswordLoading}
                              >
                                {resetPasswordLoading ? (
                                  <>
                                    <span className="mr-2">
                                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    </span>
                                    Enviando...
                                  </>
                                ) : (
                                  "Enviar"
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Nome completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                              <User className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="João da Silva"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                              <Mail className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="seu.email@exemplo.com"
                              type="email"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              className="pl-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-muted-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Confirmar senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </span>
                            <Input
                              placeholder="••••••••"
                              type={showConfirmPassword ? "text" : "password"}
                              className="pl-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-muted-foreground"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Perfil</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o perfil" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CLIENT">Cliente</SelectItem>
                            <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
                            <SelectItem value="MANAGER">Gerente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {registerMutation.error && (
                    <Alert variant="destructive">
                      <AlertDescription>{registerMutation.error.message}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Cadastrando..." : "Criar conta"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
