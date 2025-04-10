import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Download,
  Printer,
  Calendar as CalendarIcon2,
  Search,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { Equipment } from "@shared/schema";

export default function Reports() {
  const [reportType, setReportType] = useState("equipments");
  const [dateRange, setDateRange] = useState("week");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch equipments data
  const { data: equipments = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipments"],
  });

  // Filter equipments based on search term and date range
  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = searchTerm === "" || 
      equipment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filtering would be implemented here in a real application
    return matchesSearch;
  });

  // Export report handlers
  const exportToPDF = () => {
    // In a real application, this would generate and download a PDF
    alert("Export to PDF functionality would be implemented here.");
  };

  const exportToExcel = () => {
    // In a real application, this would generate and download an Excel file
    alert("Export to Excel functionality would be implemented here.");
  };

  // Print report handler
  const printReport = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-foreground">Relatórios</h2>
          <p className="text-muted-foreground mt-1">Geração de relatórios e análises</p>
        </div>
      </div>

      {/* Report Configuration */}
      <Card className="bg-background border-primary/20 mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Configuração do Relatório</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <Label htmlFor="report-type" className="text-muted-foreground mb-2">Tipo de Relatório</Label>
              <Select
                value={reportType}
                onValueChange={setReportType}
              >
                <SelectTrigger id="report-type" className="bg-background border-primary/20">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipments">Equipamentos</SelectItem>
                  <SelectItem value="clients">Clientes</SelectItem>
                  <SelectItem value="users">Usuários</SelectItem>
                  <SelectItem value="cleaning">Limpezas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-range" className="text-muted-foreground mb-2">Período</Label>
              <Select
                value={dateRange}
                onValueChange={setDateRange}
              >
                <SelectTrigger id="date-range" className="bg-background border-primary/20">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="start-date" className="text-muted-foreground mb-2">Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    locale={ptBR}
                    disabled={(date) => {
                      if (endDate) {
                        return date > endDate;
                      }
                      return false;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="end-date" className="text-muted-foreground mb-2">Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    locale={ptBR}
                    disabled={(date) => {
                      if (startDate) {
                        return date < startDate;
                      }
                      return false;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Search className="h-5 w-5" />
              </span>
              <Input
                type="text"
                placeholder="Buscar por código, cliente, etc..."
                className="pl-10 bg-background border-primary/20 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="border-primary/20 text-foreground hover:bg-primary/10"
                onClick={printReport}
              >
                <Printer className="h-5 w-5 mr-2" />
                Imprimir
              </Button>
              <Button
                variant="outline"
                className="border-primary/20 text-foreground hover:bg-primary/10"
                onClick={exportToExcel}
              >
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Excel
              </Button>
              <Button
                variant="outline"
                className="border-primary/20 text-foreground hover:bg-primary/10"
                onClick={exportToPDF}
              >
                <File className="h-5 w-5 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      <Card className="bg-background border-primary/20 mb-8" id="report-section">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Resultados do Relatório</h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <BarChart3 className="h-5 w-5 mr-2" />
              <span>
                {reportType === "equipments" ? "Equipamentos" : 
                 reportType === "clients" ? "Clientes" : 
                 reportType === "users" ? "Usuários" : "Limpezas"}
                {dateRange === "today" ? " - Hoje" : 
                 dateRange === "week" ? " - Última semana" : 
                 dateRange === "month" ? " - Último mês" : " - Período personalizado"}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-background/5">
                <TableRow className="border-primary/20">
                  <TableHead className="text-muted-foreground">Código</TableHead>
                  <TableHead className="text-muted-foreground">Descrição</TableHead>
                  <TableHead className="text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-muted-foreground">Recebido em</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Carregando dados...
                    </TableCell>
                  </TableRow>
                ) : filteredEquipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum equipamento encontrado para o período selecionado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipments.map((equipment) => (
                    <TableRow key={equipment.id} className="border-primary/20 hover:bg-primary/5">
                      <TableCell className="font-medium">#{equipment.code}</TableCell>
                      <TableCell>{equipment.description}</TableCell>
                      <TableCell>{equipment.type}</TableCell>
                      <TableCell>
                        {new Date(equipment.receivedAt).toLocaleDateString('pt-BR')}
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Total de equipamentos: <span className="font-medium text-foreground">{filteredEquipments.length}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10">
                Anterior
              </Button>
              <Button variant="outline" size="sm" className="border-primary/20 bg-primary/20 text-primary">
                1
              </Button>
              <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10">
                Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-background border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Resumo por Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Em Limpeza</span>
                  <span className="text-sm font-medium text-primary">
                    {equipments.filter(eq => eq.status === 'CLEANING').length}
                  </span>
                </div>
                <div className="w-full bg-primary/10 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${(equipments.filter(eq => eq.status === 'CLEANING').length / equipments.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Finalizados</span>
                  <span className="text-sm font-medium text-green-500">
                    {equipments.filter(eq => eq.status === 'FINISHED').length}
                  </span>
                </div>
                <div className="w-full bg-green-500/10 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${(equipments.filter(eq => eq.status === 'FINISHED').length / equipments.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Aguardando</span>
                  <span className="text-sm font-medium text-yellow-500">
                    {equipments.filter(eq => eq.status === 'PENDING').length}
                  </span>
                </div>
                <div className="w-full bg-yellow-500/10 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: `${(equipments.filter(eq => eq.status === 'PENDING').length / equipments.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Devolvidos</span>
                  <span className="text-sm font-medium text-blue-500">
                    {equipments.filter(eq => eq.status === 'RETURNED').length}
                  </span>
                </div>
                <div className="w-full bg-blue-500/10 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${(equipments.filter(eq => eq.status === 'RETURNED').length / equipments.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Estatísticas de Processamento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Tempo Médio de Limpeza</h4>
                <p className="text-2xl font-bold text-primary">4.2h</p>
                <p className="text-xs text-muted-foreground mt-1">↓ 12% em relação ao mês anterior</p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Equipamentos Processados</h4>
                <p className="text-2xl font-bold text-primary">{equipments.length}</p>
                <p className="text-xs text-muted-foreground mt-1">↑ 8% em relação ao mês anterior</p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Taxa de Devolução</h4>
                <p className="text-2xl font-bold text-primary">
                  {equipments.length > 0 
                    ? Math.round((equipments.filter(eq => eq.status === 'RETURNED').length / equipments.length) * 100) 
                    : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">↑ 5% em relação ao mês anterior</p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Clientes Atendidos</h4>
                <p className="text-2xl font-bold text-primary">
                  {new Set(equipments.map(eq => eq.clientId)).size}
                </p>
                <p className="text-xs text-muted-foreground mt-1">= Mesmo que o mês anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
