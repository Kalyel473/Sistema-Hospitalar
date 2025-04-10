import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Equipment } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, CheckCircle, Search } from "lucide-react";

// Return form schema
const returnFormSchema = z.object({
  equipmentId: z.coerce.number().min(1, "Selecione um equipamento"),
  returnedBy: z.coerce.number().min(1, "Selecione um funcionário responsável"),
  comments: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof returnFormSchema>;

export default function EquipmentReturn() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [, navigate] = useLocation();
  
  // Fetch available equipments for return (in FINISHED state)
  const { data: equipments = [], isLoading: isLoadingEquipments } = useQuery<Equipment[]>({
    queryKey: ["/api/equipments/finished"],
    refetchOnMount: true,
    retry: 2
  });
  
  // Filter equipments based on search query
  const filteredEquipments = equipments.filter(eq => 
    eq.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eq.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Fetch employees for the responsible dropdown
  const { data: employees = [] } = useQuery({
    queryKey: ["/api/employees"],
  });
  
  // Form setup
  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      equipmentId: 0,
      returnedBy: 0,
      comments: "",
    },
  });
  
  // Equipment return mutation
  const returnEquipmentMutation = useMutation({
    mutationFn: async (returnData: ReturnFormValues) => {
      const res = await apiRequest("POST", "/api/equipments/return", returnData);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Equipamento devolvido com sucesso",
        description: `Equipamento #${data.code} registrado como devolvido.`,
      });
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      form.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/equipments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/equipments/finished"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao registrar devolução",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  const onSubmit = (data: ReturnFormValues) => {
    returnEquipmentMutation.mutate(data);
  };
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-foreground">Devolução de Equipamento</h2>
          <p className="text-muted-foreground mt-1">Registre a devolução de equipamentos após a limpeza</p>
        </div>
      </div>

      {/* Success message */}
      {showSuccess && (
        <Card className="bg-green-500/10 border-green-500/30 mb-6">
          <CardContent className="p-4 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            <div>
              <h4 className="font-medium text-foreground">Devolução registrada com sucesso!</h4>
              <p className="text-sm text-muted-foreground">
                O equipamento foi marcado como devolvido no sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Return Form */}
      <Card className="bg-background border-primary/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Registrar Devolução</h3>
          
          <div className="mb-6">
            <Label htmlFor="equipment-search" className="text-muted-foreground">Buscar Equipamento</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Search className="h-5 w-5" />
              </span>
              <Input
                id="equipment-search"
                type="text"
                placeholder="Digite o código ou descrição do equipamento"
                className="pl-10 bg-background border-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="equipmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Equipamento *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background border-primary/20">
                          <SelectValue placeholder="Selecione um equipamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Selecione um equipamento</SelectItem>
                        {isLoadingEquipments ? (
                          <SelectItem value="loading" disabled>
                            Carregando equipamentos...
                          </SelectItem>
                        ) : filteredEquipments.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            Nenhum equipamento disponível
                          </SelectItem>
                        ) : (
                          filteredEquipments.map((equipment) => (
                            <SelectItem key={equipment.id} value={equipment.id.toString()}>
                              #{equipment.code} - {equipment.description.substring(0, 30)}
                              {equipment.description.length > 30 ? "..." : ""}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="returnedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Funcionário Responsável *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background border-primary/20">
                          <SelectValue placeholder="Selecione um funcionário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Selecione um funcionário</SelectItem>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <Label className="text-muted-foreground">Data e Hora</Label>
                <Input
                  type="datetime-local"
                  className="bg-background border-primary/20"
                  disabled
                  value={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-muted-foreground mt-1">Data e hora registradas automaticamente</p>
              </div>
              
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Observações (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background border-primary/20"
                        placeholder="Observações sobre a devolução..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary/20 text-foreground hover:bg-primary/10"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#00C86B] to-[#00FF9F] text-foreground hover:opacity-90"
                  disabled={returnEquipmentMutation.isPending}
                >
                  {returnEquipmentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar Devolução"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
