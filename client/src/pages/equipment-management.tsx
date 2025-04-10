import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { insertUserSchema } from "@shared/schema";
import { Loader2, Trash2, Search, User as UserIcon, Mail, Lock, Phone } from "lucide-react";

// Client schema
const clientSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
});

// User registration schema (extended from the shared schema)
const userFormSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não são iguais",
  path: ["confirmPassword"],
});

type ClientFormValues = z.infer<typeof clientSchema>;
type UserFormValues = z.infer<typeof userFormSchema>;

export default function EquipmentManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Client form setup
  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  
  // User form setup
  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "EMPLOYEE",
    },
  });
  
  // Fetch clients and users
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });
  
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/users"],
  });
  
  // Filter clients and users based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Client creation mutation
  const createClientMutation = useMutation({
    mutationFn: async (client: ClientFormValues) => {
      const res = await apiRequest("POST", "/api/clients", client);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Cliente cadastrado com sucesso",
        description: "O novo cliente foi adicionado ao sistema.",
      });
      
      // Reset form
      clientForm.reset();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cadastrar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // User creation mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: UserFormValues) => {
      const { confirmPassword, ...user } = userData;
      const res = await apiRequest("POST", "/api/register", { ...user, username: user.email });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Usuário cadastrado com sucesso",
        description: "O novo usuário foi adicionado ao sistema.",
      });
      
      // Reset form
      userForm.reset();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cadastrar usuário",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Form submission handlers
  const onClientSubmit = (data: ClientFormValues) => {
    createClientMutation.mutate(data);
  };
  
  const onUserSubmit = (data: UserFormValues) => {
    createUserMutation.mutate(data);
  };
  
  // Delete handlers (would require actual mutation implementations)
  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/clients/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Cliente excluído com sucesso",
        description: "O cliente foi removido do sistema.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteClient = (id: number) => {
    deleteClientMutation.mutate(id);
  };
  
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/users/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Usuário excluído com sucesso",
        description: "O usuário foi removido do sistema.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUser = (id: number) => {
    deleteUserMutation.mutate(id);
  };
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-foreground">Cadastros</h2>
          <p className="text-muted-foreground mt-1">Gerenciamento de clientes e usuários do sistema</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar..."
              className="w-full md:w-64 pl-10 bg-background border-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="clients">
        <TabsList className="mb-6">
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Registration Form */}
            <Card className="bg-background border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Cadastrar Novo Cliente</h3>
                
                <Form {...clientForm}>
                  <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-6">
                    <FormField
                      control={clientForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Nome do Cliente *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                <UserIcon className="h-5 w-5" />
                              </span>
                              <Input
                                placeholder="Hospital Santa Clara"
                                className="pl-10 bg-background border-primary/20"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={clientForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Email *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                <Mail className="h-5 w-5" />
                              </span>
                              <Input
                                placeholder="contato@hospital.com"
                                className="pl-10 bg-background border-primary/20"
                                type="email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={clientForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Telefone *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                <Phone className="h-5 w-5" />
                              </span>
                              <Input
                                placeholder="(11) 99999-9999"
                                className="pl-10 bg-background border-primary/20"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#00C86B] to-[#00FF9F] text-foreground hover:opacity-90 w-full"
                      disabled={createClientMutation.isPending}
                    >
                      {createClientMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        "Cadastrar Cliente"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Clients List */}
            <Card className="bg-background border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Clientes Cadastrados</h3>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-background/5">
                      <TableRow className="border-primary/20">
                        <TableHead className="text-muted-foreground">Nome</TableHead>
                        <TableHead className="text-muted-foreground">Email</TableHead>
                        <TableHead className="text-muted-foreground">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingClients ? (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            <Loader2 className="h-5 w-5 text-muted-foreground mx-auto animate-spin" />
                          </TableCell>
                        </TableRow>
                      ) : filteredClients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                            {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredClients.map((client) => (
                          <TableRow key={client.id} className="border-primary/20 hover:bg-primary/5">
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                onClick={() => deleteClient(client.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Registration Form */}
            <Card className="bg-background border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Cadastrar Novo Usuário</h3>
                
                <Form {...userForm}>
                  <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-6">
                    <FormField
                      control={userForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Nome Completo *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                <UserIcon className="h-5 w-5" />
                              </span>
                              <Input
                                placeholder="João da Silva"
                                className="pl-10 bg-background border-primary/20"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Email *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                <Mail className="h-5 w-5" />
                              </span>
                              <Input
                                placeholder="joao@exemplo.com"
                                className="pl-10 bg-background border-primary/20"
                                type="email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Senha *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                <Lock className="h-5 w-5" />
                              </span>
                              <Input
                                placeholder="••••••••"
                                className="pl-10 bg-background border-primary/20"
                                type="password"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Confirmar Senha *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                <Lock className="h-5 w-5" />
                              </span>
                              <Input
                                placeholder="••••••••"
                                className="pl-10 bg-background border-primary/20"
                                type="password"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Tipo de Perfil *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background border-primary/20">
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
                    
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#00C86B] to-[#00FF9F] text-foreground hover:opacity-90 w-full"
                      disabled={createUserMutation.isPending}
                    >
                      {createUserMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        "Cadastrar Usuário"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Users List */}
            <Card className="bg-background border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Usuários Cadastrados</h3>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-background/5">
                      <TableRow className="border-primary/20">
                        <TableHead className="text-muted-foreground">Nome</TableHead>
                        <TableHead className="text-muted-foreground">Email</TableHead>
                        <TableHead className="text-muted-foreground">Perfil</TableHead>
                        <TableHead className="text-muted-foreground">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingUsers ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            <Loader2 className="h-5 w-5 text-muted-foreground mx-auto animate-spin" />
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id} className="border-primary/20 hover:bg-primary/5">
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${user.role === 'MANAGER' ? 'bg-primary/20 text-primary' : 
                                  user.role === 'EMPLOYEE' ? 'bg-blue-500/20 text-blue-500' : 
                                  'bg-yellow-500/20 text-yellow-500'}`}>
                                {user.role === 'MANAGER' ? 'Gerente' : 
                                 user.role === 'EMPLOYEE' ? 'Funcionário' : 'Cliente'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                onClick={() => deleteUser(user.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
