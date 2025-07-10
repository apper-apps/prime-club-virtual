import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDeals } from "@/hooks/useDeals";
import { useContacts } from "@/hooks/useContacts";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const DealPipeline = () => {
  const { deals, loading: dealsLoading, error: dealsError, updateDeal } = useDeals();
  const { contacts, loading: contactsLoading, error: contactsError } = useContacts();

  const [pipelineStats, setPipelineStats] = useState({
    totalValue: 0,
    avgDealSize: 0,
    totalDeals: 0,
    winRate: 0
  });

  const loading = dealsLoading || contactsLoading;
  const error = dealsError || contactsError;

  useEffect(() => {
    if (!loading && !error) {
      calculatePipelineStats();
    }
  }, [deals, loading, error]);

  const calculatePipelineStats = () => {
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const totalDeals = deals.length;
    const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
    const closedDeals = deals.filter(deal => deal.stage === "closed").length;
    const lostDeals = deals.filter(deal => deal.stage === "lost").length;
    const completedDeals = closedDeals + lostDeals;
    const winRate = completedDeals > 0 ? (closedDeals / completedDeals) * 100 : 0;

    setPipelineStats({
      totalValue,
      avgDealSize,
      totalDeals,
      winRate: winRate.toFixed(1)
    });
  };

  const handleUpdateDeal = async (dealId, updates) => {
    try {
      await updateDeal(dealId, updates);
    } catch (error) {
      console.error("Failed to update deal:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return <Loading type="kanban" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to Load Pipeline"
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  if (deals.length === 0) {
    return (
      <Empty
        title="No deals in pipeline"
        message="Start by adding your first deal to track it through the sales process."
        icon="TrendingUp"
        actionLabel="Add Deal"
      />
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Deal Pipeline</h1>
          <p className="text-gray-400 mt-1">Track deals through your sales process</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <ApperIcon name="TrendingUp" size={16} />
          <span>Drag & drop to update stages</span>
        </div>
      </motion.div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(pipelineStats.totalValue)}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
              <ApperIcon name="DollarSign" size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Average Deal Size</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(pipelineStats.avgDealSize)}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
              <ApperIcon name="Calculator" size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Deals</p>
              <p className="text-2xl font-bold text-white">{pipelineStats.totalDeals}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full">
              <ApperIcon name="FileText" size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold text-white">{pipelineStats.winRate}%</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full">
              <ApperIcon name="Target" size={20} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <KanbanBoard
          deals={deals}
          contacts={contacts}
          onUpdateDeal={handleUpdateDeal}
        />
      </motion.div>
    </div>
  );
};

export default DealPipeline;