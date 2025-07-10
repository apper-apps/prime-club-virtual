import { useState, useEffect } from "react";
import { salesRepsService } from "@/services/api/salesRepsService";
import { toast } from "react-toastify";

export const useSalesReps = () => {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSalesReps = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await salesRepsService.getAll();
      setSalesReps(data);
    } catch (err) {
      setError(err.message || "Failed to load sales reps");
      toast.error("Failed to load sales reps");
    } finally {
      setLoading(false);
    }
  };

  const createSalesRep = async (repData) => {
    try {
      const newRep = await salesRepsService.create(repData);
      setSalesReps(prev => [...prev, newRep]);
      toast.success("Sales rep created successfully");
      return newRep;
    } catch (err) {
      toast.error("Failed to create sales rep");
      throw err;
    }
  };

  const updateSalesRep = async (id, updates) => {
    try {
      const updatedRep = await salesRepsService.update(id, updates);
      setSalesReps(prev => prev.map(r => r.Id === id ? updatedRep : r));
      toast.success("Sales rep updated successfully");
      return updatedRep;
    } catch (err) {
      toast.error("Failed to update sales rep");
      throw err;
    }
  };

  const deleteSalesRep = async (id) => {
    try {
      await salesRepsService.delete(id);
      setSalesReps(prev => prev.filter(r => r.Id !== id));
      toast.success("Sales rep deleted successfully");
    } catch (err) {
      toast.error("Failed to delete sales rep");
      throw err;
    }
  };

  const getLeaderboard = async () => {
    try {
      const data = await salesRepsService.getLeaderboard();
      return data;
    } catch (err) {
      toast.error("Failed to get leaderboard");
      throw err;
    }
  };

  const getTopPerformer = async () => {
    try {
      const data = await salesRepsService.getTopPerformer();
      return data;
    } catch (err) {
      toast.error("Failed to get top performer");
      throw err;
    }
  };

  useEffect(() => {
    loadSalesReps();
  }, []);

  return {
    salesReps,
    loading,
    error,
    loadSalesReps,
    createSalesRep,
    updateSalesRep,
    deleteSalesRep,
    getLeaderboard,
    getTopPerformer
  };
};