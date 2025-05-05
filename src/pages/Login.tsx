
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

const Login = () => {
  const [password, setPassword] = useState("");
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bakery-cream p-4 bg-gradient-to-b from-bakery-cream to-bakery-bread/10">
      <Card className="w-full max-w-md shadow-lg border-bakery-crust/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-bakery-bread flex items-center justify-center">
              <Lock className="h-8 w-8 text-bakery-chocolate" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-bakery-chocolate">Padoca</CardTitle>
          <CardDescription className="text-bakery-crust">
            Sistema de Controle de Estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-bakery-crust/30 focus:border-bakery-accent"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-bakery-accent hover:bg-bakery-accent/90 text-white"
              >
                Entrar
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Sistema exclusivo para funcionários da Padoca.
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
