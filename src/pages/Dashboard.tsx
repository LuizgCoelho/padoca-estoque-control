
import React, { useState } from "react";
import { useProducts, Product } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, PackagePlus, PackageMinus, LogOut } from "lucide-react";
import ProductTable from "@/components/ProductTable";
import AddProductForm from "@/components/AddProductForm";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { products, lowStockProducts } = useProducts();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("estoque");

  // Show low stock alert if there are products with low stock
  React.useEffect(() => {
    if (lowStockProducts.length > 0 && activeTab === "estoque") {
      toast({
        title: "Alerta de Estoque Baixo",
        description: `${lowStockProducts.length} produto(s) com estoque baixo.`,
        variant: "destructive",
      });
    }
  }, [lowStockProducts.length, activeTab, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bakery-cream to-bakery-bread/10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-bakery-chocolate">Padoca</h1>
            <p className="text-bakery-crust">Sistema de Controle de Estoque</p>
          </div>
          <Button 
            variant="outline" 
            className="border-bakery-crust/30 text-bakery-chocolate"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bakery-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-8 w-8 mr-3 text-bakery-chocolate" />
                <span className="text-3xl font-bold text-bakery-chocolate">{products.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bakery-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <PackageMinus className="h-8 w-8 mr-3 text-bakery-alert" />
                <span className="text-3xl font-bold text-bakery-alert">{lowStockProducts.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bakery-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Adicionar Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-bakery-accent hover:bg-bakery-accent/90 text-white"
                onClick={() => setActiveTab("adicionar")}
              >
                <PackagePlus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="estoque" className="text-sm md:text-base">
              Estoque
              {lowStockProducts.length > 0 && (
                <Badge variant="destructive" className="ml-2 bg-bakery-alert">
                  {lowStockProducts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="adicionar" className="text-sm md:text-base">Adicionar Produto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="estoque" className="pb-16">
            <Card className="bakery-card">
              <CardHeader>
                <CardTitle>Lista de Produtos</CardTitle>
                <CardDescription>
                  Gerenciar o estoque de produtos da padaria.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="adicionar" className="pb-16">
            <Card className="bakery-card">
              <CardHeader>
                <CardTitle>Adicionar Novo Produto</CardTitle>
                <CardDescription>
                  Cadastre um novo produto no estoque.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddProductForm onSuccess={() => setActiveTab("estoque")} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
