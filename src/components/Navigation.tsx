import { Link, useLocation } from "react-router-dom";
import { Leaf, ChevronDown, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2 mr-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">AI Sustainability</span>
        </Link>
        
        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(isActive("/") && "bg-accent")}
          >
            <Link to="/">Home</Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className={cn(location.pathname.includes("/models") && "bg-accent")}>
                Models <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/models/gpt4">GPT-4</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/models/grok">Grok-1.5</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/models/claude3">Claude 3</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/models/llama3">Llama-3 70B</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(isActive("/compare") && "bg-accent")}
          >
            <Link to="/compare">Compare</Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(isActive("/graphs") && "bg-accent")}
          >
            <Link to="/graphs">Graphs</Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(isActive("/recommendation") && "bg-accent")}
          >
            <Link to="/recommendation">Our Recommendation</Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(isActive("/live-tracker") && "bg-accent")}
          >
            <Link to="/live-tracker">Live Tracker</Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(isActive("/about") && "bg-accent")}
          >
            <Link to="/about">About</Link>
          </Button>
          
          <Button
            size="sm"
            asChild
            className="ml-2 gap-2"
          >
            <Link to="/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
