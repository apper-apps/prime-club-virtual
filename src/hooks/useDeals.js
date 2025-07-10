import { useState, useEffect } from "react";
import { dealsService } from "@/services/api/dealsService";
import { toast } from "react-toastify";

export const useDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await dealsService.getAll();
      setDeals(data);
    } catch (err) {
      setError(err.message || "Failed to load deals");
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const createDeal = async (dealData) => {
    try {
      const newDeal = await dealsService.create(dealData);
      setDeals(prev => [...prev, newDeal]);
      toast.success("Deal created successfully");
      return newDeal;
    } catch (err) {
      toast.error("Failed to create deal");
      throw err;
    }
  };

  const updateDeal = async (id, updates) => {
    try {
      const updatedDeal = await dealsService.update(id, updates);
      setDeals(prev => prev.map(d => d.Id === id ? updatedDeal : d));
      toast.success("Deal updated successfully");
      return updatedDeal;
    } catch (err) {
      toast.error("Failed to update deal");
      throw err;
    }
  };

  const deleteDeal = async (id) => {
    try {
      await dealsService.delete(id);
      setDeals(prev => prev.filter(d => d.Id !== id));
      toast.success("Deal deleted successfully");
    } catch (err) {
      toast.error("Failed to delete deal");
      throw err;
    }
  };

  const updateDealStage = async (id, newStage) => {
    try {
      const updatedDeal = await dealsService.updateStage(id, newStage);
      setDeals(prev => prev.map(d => d.Id === id ? updatedDeal : d));
      toast.success(`Deal moved to ${newStage}`);
      return updatedDeal;
    } catch (err) {
      toast.error("Failed to update deal stage");
      throw err;
    }
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage.toLowerCase() === stage.toLowerCase());
  };

  const getDealsByYear = (year) => {
    return deals.filter(deal => deal.year === year);
  };

  useEffect(() => {
    loadDeals();
  }, []);

  return {
    deals,
    loading,
    error,
    loadDeals,
    createDeal,
    updateDeal,
    deleteDeal,
    updateDealStage,
    getDealsByStage,
    getDealsByYear
  };
};