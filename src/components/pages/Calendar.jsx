import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDeals } from "@/hooks/useDeals";
import { useContacts } from "@/hooks/useContacts";
import DealTimeline from "@/components/organisms/DealTimeline";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const Calendar = () => {
  const { deals, loading: dealsLoading, error: dealsError, updateDeal } = useDeals();
  const { contacts, loading: contactsLoading, error: contactsError } = useContacts();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearlyStats, setYearlyStats] = useState({
    totalDeals: 0,
    totalValue: 0,
    avgDuration: 0,
    peakMonth: ""
  });

  const loading = dealsLoading || contactsLoading;
  const error = dealsError || contactsError;

  useEffect(() => {
    if (!loading && !error) {
      calculateYearlyStats();
    }
  }, [deals, selectedYear, loading, error]);

  const calculateYearlyStats = () => {
    const yearDeals = deals.filter(deal => deal.year === selectedYear);
    const totalDeals = yearDeals.length;
    const totalValue = yearDeals.reduce((sum, deal) => sum + deal.value, 0);
    
    // Calculate average duration
    const avgDuration = yearDeals.length > 0 
      ? yearDeals.reduce((sum, deal) => sum + (deal.endMonth - deal.startMonth + 1), 0) / yearDeals.length
      : 0;

    // Find peak month
    const monthCounts = {};
    yearDeals.forEach(deal => {
      for (let month = deal.startMonth; month <= deal.endMonth; month++) {
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });
    
    const peakMonth = Object.keys(monthCounts).reduce((a, b) => 
      monthCounts[a] > monthCounts[b] ? a : b, "1");
    
    const monthNames = [
      "", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    setYearlyStats({
      totalDeals,
      totalValue,
      avgDuration: avgDuration.toFixed(1),
      peakMonth: monthNames[parseInt(peakMonth)] || "N/A"
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
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to Load Calendar"
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  const yearDeals = deals.filter(deal => deal.year === selectedYear);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Deal Calendar</h1>
          <p className="text-gray-400 mt-1">Visualize deal timelines across the year</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <ApperIcon name="Calendar" size={16} />
          <span>Drag to move • Resize to extend</span>
        </div>
      </motion.div>

      {/* Yearly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Deals ({selectedYear})</p>
              <p className="text-2xl font-bold text-white">{yearlyStats.totalDeals}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
              <ApperIcon name="BarChart" size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(yearlyStats.totalValue)}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
              <ApperIcon name="DollarSign" size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Duration</p>
              <p className="text-2xl font-bold text-white">{yearlyStats.avgDuration} mo</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full">
              <ApperIcon name="Clock" size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Peak Month</p>
              <p className="text-2xl font-bold text-white">{yearlyStats.peakMonth}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full">
              <ApperIcon name="TrendingUp" size={20} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Deal Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {yearDeals.length === 0 ? (
          <Empty
            title={`No deals found for ${selectedYear}`}
            message="Select a different year or add deals to visualize their timeline."
            icon="Calendar"
            actionLabel="Add Deal"
          />
        ) : (
          <DealTimeline
            deals={deals}
            contacts={contacts}
            onUpdateDeal={handleUpdateDeal}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Calendar;