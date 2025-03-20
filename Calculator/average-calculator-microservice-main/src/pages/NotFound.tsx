
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="text-center max-w-md p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border p-8"
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
            <span className="text-4xl font-bold">404</span>
          </div>
          <h1 className="text-2xl font-medium mb-2">Page not found</h1>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;
