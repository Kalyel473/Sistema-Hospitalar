import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Search,
  Users,
  CheckCircle,
  Clock
} from "lucide-react";
import { User, Equipment, CleaningStep } from "@shared/schema";

interface EquipmentWithDetails extends Equipment {
  client: { id: number; name: string };
  employee: User;
  cleaningSteps: CleaningStep[];
  progress: number;
}

export default function CleaningStatus() {
  const { toast } = useToast();
  const [equipmentCode, setEquipmentCode] = useState("");
  const [clientName, setClientName] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchedEquipment, setSearchedEquipment] = useState<EquipmentWithDetails | null>(null);
  
  // Mock cleaning steps for the equipment
  const cleaningSteps = [
    { id: 1, step: "Recebimento", completed: true, completedAt: new Date().toISOString() },
    { id: 2, step: "Triagem Inicial", completed: true, completedAt: new Date().toISOString() },
    { id: 3, step: "Limpeza Básica", completed: true, completedAt: new Date().toISOString() },
    { id: 4, step: "Limpeza Profunda", completed: false, completedAt: null },
    { id: 5, step: "Esterilização", completed: false, completedAt: null },
    { id: 6, step: "Inspeção Final", completed: false, completedAt: null }
  ];
  
  // Search for equipment status
  const searchStatus = async () => {
    if (!equipmentCode && !clientName) {
      toast({
        title: "Erro na busca",
        description: "Informe o código do equipamento ou o nome do cliente",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // In a real app, this would be an API call
      // const response = await apiRequest("GET", `/api/equipment-status?code=${equipmentCode}&client=${clientName}`);
      // const data = await response.json();
      
      // For this demo, we'll use mock data
      setSearchPerformed(true);
      
      // Mock data for demonstration
      const mockEquipment: EquipmentWithDetails = {
        id: 1,
        code: "EQ-4872",
        description: "Kit de instrumental cirúrgico ortopédico",
        type: "Instrumental Cirúrgico",
        quantity: 1,
        clientId: 1,
        client: { id: 1, name: "Hospital Santa Clara" },
        receivedBy: 2,
        employee: {
          id: 2,
          name: "Maria Oliveira",
          email: "maria@example.com",
          password: "",
          role: "EMPLOYEE"
        },
        receivedAt: new Date().toISOString(),
        status: "CLEANING",
        cleaningStartedAt: new Date().toISOString(),
        cleaningFinishedAt: null,
        returnedAt: null,
        returnedBy: null,
        cleaningSteps: cleaningSteps,
        progress: 65 // Mock progress percentage
      };
      
      setSearchedEquipment(mockEquipment);
      
      toast({
        title: "Busca realizada",
        description: `Encontrado equipamento #${mockEquipment.code}`,
      });
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível obter os dados do equipamento",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-foreground">Status de Limpeza</h2>
          <p className="text-muted-foreground mt-1">Acompanhe o status de limpeza dos equipamentos</p>
        </div>
      </div>

      {/* Status Search */}
      <Card className="bg-background border-primary/20 mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Consultar Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="equipment-code" className="text-muted-foreground mb-2">Código do Equipamento</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Search className="h-5 w-5" />
                </span>
                <Input
                  id="equipment-code"
                  type="text"
                  placeholder="Ex: EQ-4872"
                  className="pl-10 bg-background border-primary/20"
                  value={equipmentCode}
                  onChange={(e) => setEquipmentCode(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="client-name" className="text-muted-foreground mb-2">Nome do Cliente</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Users className="h-5 w-5" />
                </span>
                <Input
                  id="client-name"
                  type="text"
                  placeholder="Ex: Hospital Santa Clara"
                  className="pl-10 bg-background border-primary/20"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              className="bg-gradient-to-r from-[#00C86B] to-[#00FF9F] text-foreground hover:opacity-90"
              onClick={searchStatus}
            >
              Consultar Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Status Card */}
      {searchPerformed && searchedEquipment && (
        <Card className="bg-background border-primary/20 mb-8 overflow-hidden">
          <div className="border-b border-primary/20 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <span className="mr-2">Equipamento #{searchedEquipment.code}</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary">
                    {searchedEquipment.status === 'CLEANING' ? 'Em Limpeza' : 
                     searchedEquipment.status === 'FINISHED' ? 'Finalizado' : 
                     searchedEquipment.status === 'RETURNED' ? 'Devolvido' : 'Aguardando'}
                  </span>
                </h3>
                <p className="text-muted-foreground mt-1">Cliente: {searchedEquipment.client.name}</p>
              </div>
              <div className="flex flex-col md:items-end">
                <span className="text-foreground text-sm">
                  Recebido em: {new Date(searchedEquipment.receivedAt).toLocaleString('pt-BR')}
                </span>
                <span className="text-green-500 text-sm">
                  Previsão de término: {new Date(new Date().getTime() + 4 * 60 * 60 * 1000).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Progresso da Limpeza</h4>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-foreground">
                    {searchedEquipment.progress}% Concluído
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-muted-foreground">
                    Estimativa: 4h total
                  </span>
                </div>
              </div>
              <Progress value={searchedEquipment.progress} className="h-2 bg-primary/10" />
            </div>
            
            <div className="mt-4 space-y-4">
              {searchedEquipment.cleaningSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : index === cleaningSteps.findIndex(s => !s.completed) ? (
                      <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex items-center justify-center opacity-50">
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-foreground">{step.step}</h5>
                    <p className="text-xs text-muted-foreground">
                      {step.completed 
                        ? `Concluído às ${new Date(step.completedAt!).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` 
                        : index === cleaningSteps.findIndex(s => !s.completed)
                          ? "Em andamento" 
                          : "Pendente"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
      
      {searchPerformed && !searchedEquipment && (
        <Card className="bg-background border-primary/20 mb-8 overflow-hidden">
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum equipamento encontrado</h3>
            <p className="text-muted-foreground">
              Verifique o código do equipamento ou o nome do cliente e tente novamente.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
