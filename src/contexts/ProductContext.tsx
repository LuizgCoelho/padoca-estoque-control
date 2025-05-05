
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface Product {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
  createdAt: Date;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, updates: Partial<Omit<Product, "id" | "createdAt">>) => void;
  deleteProduct: (id: string) => void;
  lowStockProducts: Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  // Load products from localStorage on initial render
  useEffect(() => {
    const storedProducts = localStorage.getItem("padoca_products");
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts).map((product: any) => ({
          ...product,
          createdAt: new Date(product.createdAt)
        }));
        setProducts(parsedProducts);
      } catch (error) {
        console.error("Error parsing stored products:", error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Houve um problema ao carregar os produtos salvos.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("padoca_products", JSON.stringify(products));
    
    // Update low stock products
    const lowStock = products.filter(product => product.quantity <= product.threshold);
    setLowStockProducts(lowStock);
  }, [products]);

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao estoque.`
    });
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, "id" | "createdAt">>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
    
    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas com sucesso."
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    
    if (productToDelete) {
      toast({
        title: "Produto removido",
        description: `${productToDelete.name} foi removido do estoque.`
      });
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, lowStockProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
