import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { Link } from "wouter";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Zap,
  CheckCircle,
  Clock,
  Download,
  Search,
  Eye,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch equipments from API
  const { data: equipments = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipments"],
  });

  // Create a new equipment receiving
  const createNewReceiving = async () => {
    try {
      await apiRequest("GET", "/api/equipments/new-receiving");
    } catch (error) {
      console.error("Error creating new receiving", error);
    }
  };

  // Filter equipments based on activeFilter and searchQuery
  const filteredEquipments = equipments.filter((equipment) => {
    const matchesSearch =
      searchQuery === "" ||
      equipment.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "cleaning" && equipment.status === "CLEANING") ||
      (activeFilter === "finished" && equipment.status === "FINISHED") ||
      (activeFilter === "pending" && equipment.status === "PENDING");

    return matchesSearch && matchesFilter;
  });

  // Count equipments by status
  const cleaningCount = equipments.filter(eq => eq.status === "CLEANING").length;
  const finishedCount = equipments.filter(eq => eq.status === "FINISHED").length;
  const pendingCount = equipments.filter(eq => eq.status === "PENDING").length;
  const returnedCount = equipments.filter(eq => eq.status === "RETURNED").length;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Visão geral do sistema de equipamentos</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar equipamento ou cliente..."
              className="w-full md:w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-background border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-primary/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="ml-3 font-semibold text-foreground">Em Limpeza</h3>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-sans font-bold text-foreground">{cleaningCount}</span>
              <span className="text-xs text-green-500 font-medium">↑ Hoje</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-primary/20">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="ml-3 font-semibold text-foreground">Finalizados</h3>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-sans font-bold text-foreground">{finishedCount}</span>
              <span className="text-xs text-green-500 font-medium">↑ Hoje</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-primary/20">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="ml-3 font-semibold text-foreground">Aguardando</h3>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-sans font-bold text-foreground">{pendingCount}</span>
              <span className="text-xs text-yellow-500 font-medium">↑ Hoje</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-md bg-primary/20">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="ml-3 font-semibold text-foreground">Devolvidos</h3>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-sans font-bold text-foreground">{returnedCount}</span>
              <span className="text-xs text-green-500 font-medium">↑ Hoje</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className={activeFilter === "all" ? "bg-primary/80 text-white" : "border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10"}
          >
            Todos ({equipments.length})
          </Button>
          <Button
            variant={activeFilter === "cleaning" ? "default" : "outline"}
            onClick={() => setActiveFilter("cleaning")}
            className={activeFilter === "cleaning" ? "bg-primary/80 text-white" : "border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10"}
          >
            Em Limpeza ({cleaningCount})
          </Button>
          <Button
            variant={activeFilter === "finished" ? "default" : "outline"}
            onClick={() => setActiveFilter("finished")}
            className={activeFilter === "finished" ? "bg-primary/80 text-white" : "border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10"}
          >
            Finalizados ({finishedCount})
          </Button>
          <Button
            variant={activeFilter === "pending" ? "default" : "outline"}
            onClick={() => setActiveFilter("pending")}
            className={activeFilter === "pending" ? "bg-primary/80 text-white" : "border-primary/20 text-muted-foreground hover:text-foreground hover:bg-primary/10"}
          >
            Aguardando ({pendingCount})
          </Button>
        </div>
      </div>

      {/* Equipment Table */}
      <Card className="bg-background border-primary/20 mb-8">
        <div className="p-4 border-b border-primary/20 flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-foreground mb-2 md:mb-0">Equipamentos Recentes</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <select className="px-3 py-2 rounded-md bg-background border border-primary/20 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Todos</option>
            </select>
            <Link href="/equipment-receiving">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-[#00C86B] to-[#00FF9F] text-white hover:opacity-90">
                <span className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  Novo Recebimento
                </span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-background/5">
              <TableRow className="border-primary/20">
                <TableHead className="text-muted-foreground">Código</TableHead>
                <TableHead className="text-muted-foreground">Cliente</TableHead>
                <TableHead className="text-muted-foreground">Funcionário</TableHead>
                <TableHead className="text-muted-foreground">Data de Recebimento</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Carregando equipamentos...
                  </TableCell>
                </TableRow>
              ) : filteredEquipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum equipamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredEquipments.slice(0, 5).map((equipment) => (
                  <TableRow key={equipment.id} className="border-primary/20 hover:bg-primary/5">
                    <TableCell className="font-medium">#{equipment.code}</TableCell>
                    <TableCell>{equipment.clientId}</TableCell>
                    <TableCell>{equipment.receivedBy}</TableCell>
                    <TableCell>
                      {new Date(equipment.receivedAt).toLocaleDateString('pt-BR')} 
                      {' '}
                      {new Date(equipment.receivedAt).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${equipment.status === 'CLEANING' ? 'bg-primary/20 text-primary' : 
                          equipment.status === 'FINISHED' ? 'bg-green-500/20 text-green-500' : 
                          equipment.status === 'RETURNED' ? 'bg-blue-500/20 text-blue-500' : 
                          'bg-yellow-500/20 text-yellow-500'}`}>
                        {equipment.status === 'CLEANING' ? 'Em Limpeza' : 
                         equipment.status === 'FINISHED' ? 'Finalizado' : 
                         equipment.status === 'RETURNED' ? 'Devolvido' : 'Aguardando'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Edit className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="px-4 py-3 border-t border-primary/20 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium text-foreground">1</span> a <span className="font-medium text-foreground">
                {Math.min(5, filteredEquipments.length)}
              </span> de <span className="font-medium text-foreground">{filteredEquipments.length}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button variant="outline" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-primary/20 bg-background text-sm font-medium hover:bg-primary/10">
                <span className="sr-only">Anterior</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
              <Button variant="default" className="relative inline-flex items-center px-4 py-2 border border-primary/20 bg-primary/80 text-sm font-medium text-foreground">
                1
              </Button>
              <Button variant="outline" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-primary/20 bg-background text-sm font-medium hover:bg-primary/10">
                <span className="sr-only">Próximo</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
            </nav>
          </div>
        </div>
      </Card>
    </div>
  );
}
