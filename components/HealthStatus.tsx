"use client";
import { useEffect, useState } from "react";

type HealthStatus = {
  status: string;
  timestamp: string;
  services: {
    embedding_model: string;
    gemini: string;
  };
};

export default function HealthStatusIndicator() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const checkHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/health");
      console.log("Health check response:", response);
      if (!response.ok) {
        throw new Error("Backend unavailable");
      }

      const data = await response.json();
      setHealth(data);
      
      setError("");
    } catch (err: any) {
      setError(err.message);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (loading) return "bg-gray-400";
    if (error || !health || health.status !== "healthy") return "bg-red-500";
    return "bg-green-500";
  };
  

  return (
    <div className="fixed bottom-4 right-4 p-3 bg-white shadow-md rounded-md text-sm min-w-[200px]">
      <div className="flex items-center">
        <div className={`w-3 h-3 mr-2 rounded-full ${getStatusColor()}`}></div>
        <span className="font-medium">
          {loading ? "Checking..." : error ? "Backend Error" : "Backend Healthy"}
        </span>
      </div>
      
      {health && (
        <div className="mt-2 text-xs space-y-1">
          <div className="flex justify-between">
            
            <span className={health.services.embedding_model === "active" ? "text-green-600" : "text-red-600"}/>
             
          </div>
          <div className="flex justify-between">
            <span className={health.services.gemini === "active" ? "text-green-600" : "text-red-600"}/>
              
            
            
          </div>
          <div className="text-gray-400 text-right">
            {new Date(health.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}