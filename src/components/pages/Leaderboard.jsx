import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSalesReps } from "@/hooks/useSalesReps";
import { useDeals } from "@/hooks/useDeals";
import { useContacts } from "@/hooks/useContacts";
import LeaderboardTable from "@/components/organisms/LeaderboardTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const Leaderboard = () => {
  const { salesReps, loading: repsLoading, error: repsError } = useSalesReps();
  const { deals, loading: dealsLoading, error: dealsError } = useDeals();
  const { contacts, loading: contactsLoading, error: contactsError } = useContacts();

  const [teamStats, setTeamStats] = useState({
    totalReps: 0,
    topPerformer: null,
    totalRevenue: 0,
    avgDealsPerRep: 0
  });

  const loading = repsLoading || dealsLoading || contactsLoading;
  const error = repsError || dealsError || contactsError;

  useEffect(() => {
    if (!loading && !error) {
      calculateTeamStats();
    }
  }, [salesReps, deals, contacts, loading, error]);

  const calculateTeamStats = () => {
    const totalReps = salesReps.length;
    const totalRevenue = salesReps.reduce((sum, rep) => sum + rep.revenue, 0);
    const totalDeals = salesReps.reduce((sum, rep) => sum + rep.dealsClosed, 0);
    const avgDealsPerRep = totalReps > 0 ? (totalDeals / totalReps).toFixed(1) : 0;

    // Find top performer
    const topPerformer = salesReps.reduce((top, rep) => {
      const topScore = top.dealsClosed * 3 + top.meetingsBooked * 2 + top.leadsContacted;
      const repScore = rep.dealsClosed * 3 + rep.meetingsBooked * 2 + rep.leadsContacted;
      return repScore > topScore ? rep : top;
    }, salesReps[0] || null);

    setTeamStats({
      totalReps,
      topPerformer,
      totalRevenue,
      avgDealsPerRep
    });
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
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to Load Leaderboard"
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  if (salesReps.length === 0) {
    return (
      <Empty
        title="No sales representatives found"
        message="Add sales team members to track their performance and rankings."
        icon="Trophy"
        actionLabel="Add Sales Rep"
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
          <h1 className="text-3xl font-bold text-white">Sales Leaderboard</h1>
          <p className="text-gray-400 mt-1">Track team performance and celebrate top achievers</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <ApperIcon name="Trophy" size={16} />
          <span>Updated in real-time</span>
        </div>
      </motion.div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Sales Reps</p>
              <p className="text-2xl font-bold text-white">{teamStats.totalReps}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
              <ApperIcon name="Users" size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Team Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(teamStats.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
              <ApperIcon name="DollarSign" size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Deals per Rep</p>
              <p className="text-2xl font-bold text-white">{teamStats.avgDealsPerRep}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full">
              <ApperIcon name="Target" size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Top Performer</p>
              <p className="text-2xl font-bold text-white">
                {teamStats.topPerformer ? teamStats.topPerformer.name.split(" ")[0] : "N/A"}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full">
              <ApperIcon name="Crown" size={20} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <LeaderboardTable salesReps={salesReps} />
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <ApperIcon name="TrendingUp" size={20} className="text-white" />
              </div>
              <p className="text-sm text-gray-400">Most Improved</p>
              <p className="font-semibold text-white">
                {salesReps.length > 1 ? salesReps[1].name : "N/A"}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <ApperIcon name="Phone" size={20} className="text-white" />
              </div>
              <p className="text-sm text-gray-400">Most Calls</p>
              <p className="font-semibold text-white">
                {salesReps.reduce((max, rep) => rep.leadsContacted > max.leadsContacted ? rep : max, salesReps[0] || {}).name || "N/A"}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <ApperIcon name="Calendar" size={20} className="text-white" />
              </div>
              <p className="text-sm text-gray-400">Most Meetings</p>
              <p className="font-semibold text-white">
                {salesReps.reduce((max, rep) => rep.meetingsBooked > max.meetingsBooked ? rep : max, salesReps[0] || {}).name || "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Leaderboard;