// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Calendar, User, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/events" className="text-foreground hover:text-primary transition-colors font-medium">
              Browse Events
            </Link>

            {/* show Admin only for admin users */}
            {isAdmin && (
              <Link to="/admin" className="text-foreground hover:text-primary transition-colors font-medium">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{user.name}</span>
                </div>

                <Button variant="ghost" onClick={logout} className="hidden md:block">
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block">
                  <Button variant="hero" size="lg">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="hidden md:block">
                  <Button variant="gradient" size="lg">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;