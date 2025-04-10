import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertEquipmentSchema } from "@shared/schema";
import { Loader2, Printer } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Extended schema with validation
const equipmentFormSchema = insertEquipmentSchema.extend({
  clientId: z.coerce.number().min(1, "Selecione um cliente"),
  receivedBy: z.coerce.number().min(1, "Selecione um funcionário"),
  description: z.string().min(3, "Descreva o equipamento com pelo menos 3 caracteres"),
  type: z.string().min(1, "Selecione o tipo de equipamento"),
  quantity: z.coerce.number().min(1, "A quantidade deve ser pelo menos 1"),
});

type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;

// Label interface
interface EquipmentLabel {
  code: string;
  clientName: string;
  employeeName: string;
  receivedAt: string;
  labelId: string;
  type: string;
  quantity: number;
}

export default function EquipmentReceiving() {
  const { toast } = useToast();
  const [label, setLabel] = useState<EquipmentLabel | null>(null);
  const [, navigate] = useLocation();

  // Fetch clients and employees for the dropdowns
  const { data: clients = [] } = useQuery<any[]>({
    queryKey: ["/api/clients"],
  });

  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["/api/employees"],
  });

  // Form setup
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      clientId: 0,
      receivedBy: 0,
      description: "",
      type: "",
      quantity: 1,
    },
  });

  // Equipment creation mutation
  const createEquipmentMutation = useMutation({
    mutationFn: async (equipment: EquipmentFormValues) => {
      const res = await apiRequest("POST", "/api/equipments", equipment);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Equipamento registrado com sucesso",
        description: `Código do equipamento: ${data.code}`,
      });

      // Set label data for preview
      setLabel({
        code: data.code,
        clientName: clients.find(c => c.id === data.clientId)?.name || "",
        employeeName: employees.find(e => e.id === data.receivedBy)?.name || "",
        receivedAt: new Date(data.receivedAt).toLocaleString('pt-BR'),
        labelId: `${new Date(data.receivedAt).toISOString().slice(0, 10).replace(/-/g, "")}${data.code}`,
        type: data.type,
        quantity: data.quantity
      });

      // Reset form
      form.reset();

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/equipments"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao registrar equipamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: EquipmentFormValues) => {
    createEquipmentMutation.mutate(data);
  };

  // Print label function
  const printLabel = () => {
    if (!label) return;

    // In a real application, this would trigger a print API or dialog
    // For now, we'll just simulate the print with a toast
    toast({
      title: "Imprimindo etiqueta",
      description: `Etiqueta do equipamento ${label.code} enviada para impressão.`,
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-foreground">Recebimento de Material</h2>
          <p className="text-muted-foreground mt-1">Cadastre a entrada de novos equipamentos</p>
        </div>
      </div>

      {/* Recebimento Form */}
      <Card className="bg-background border-primary/20 mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Novo Recebimento</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Cliente *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background border-primary/20">
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Selecione um cliente</SelectItem>
                          {clients && clients.length > 0 ? (
                            clients.map((client) => (
                              <SelectItem key={client.id} value={client.id.toString()}>
                                {client.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no_clients">Nenhum cliente disponível</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receivedBy"
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
                          {employees && employees.length > 0 ? (
                            employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id.toString()}>
                                {employee.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no_employees">Nenhum funcionário disponível</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Descrição do Equipamento *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o equipamento recebido..."
                        className="resize-none bg-background border-primary/20"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Tipo de Equipamento *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background border-primary/20">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="_placeholder">Selecione o tipo</SelectItem>
                          <SelectItem value="Instrumental Cirúrgico">Instrumental Cirúrgico</SelectItem>
                          <SelectItem value="Equipamento Eletrônico">Equipamento Eletrônico</SelectItem>
                          <SelectItem value="Dispositivo Médico">Dispositivo Médico</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Quantidade *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          className="bg-background border-primary/20"
                          placeholder="Ex: 5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="text-muted-foreground">Data e Hora *</Label>
                  <Input
                    type="datetime-local"
                    className="bg-background border-primary/20 text-muted-foreground cursor-not-allowed"
                    disabled
                    value={new Date().toISOString().slice(0, 16)}
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground mt-1">Data e hora registradas automaticamente</p>
                </div>
              </div>

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
                  disabled={createEquipmentMutation.isPending}
                >
                  {createEquipmentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar Recebimento"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Label Preview */}
      {label && (
        <Card className="bg-background border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-2 md:mb-0">Etiqueta de Identificação</h3>
              <Button
                onClick={printLabel}
                className="bg-gradient-to-r from-[#00C86B] to-[#00FF9F] text-foreground hover:opacity-90"
              >
                <Printer className="h-5 w-5 mr-1" />
                Imprimir Etiqueta
              </Button>
            </div>

            <div className="border-2 border-primary/20 rounded-lg p-4 bg-background max-w-md mx-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-primary">HospitalSys</h4>
                  <p className="text-xs text-muted-foreground">Sistema de Gerenciamento de Equipamentos</p>
                </div>
                <div className="bg-white p-2 rounded">
                  {/* QR Code placeholder */}
                  <div className="w-16 h-16 grid grid-cols-4 grid-rows-4 gap-0.5">
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-white col-span-1 row-span-1"></div>
                    <div className="bg-white col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-white col-span-1 row-span-1"></div>
                    <div className="bg-white col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                    <div className="bg-black col-span-1 row-span-1"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Código:</p>
                  <p className="text-base font-bold text-foreground">#{label.code}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cliente:</p>
                  <p className="text-base text-foreground">{label.clientName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Recebido por:</p>
                  <p className="text-base text-foreground">{label.employeeName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data e Hora:</p>
                  <p className="text-base text-foreground">{label.receivedAt}</p>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">ID: {label.labelId}</p>
                  <p className="text-xs text-muted-foreground">www.hospitalsys.com.br</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}