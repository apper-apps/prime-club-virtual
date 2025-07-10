import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useContacts } from "@/hooks/useContacts";
import { useDeals } from "@/hooks/useDeals";
import { useSalesReps } from "@/hooks/useSalesReps";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const Dashboard = () => {
  const { contacts, loading: contactsLoading, error: contactsError } = useContacts();
  const { deals, loading: dealsLoading, error: dealsError } = useDeals();
  const { salesReps, loading: repsLoading, error: repsError } = useSalesReps();

  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    meetingsBooked: 0,
    meetingsThisWeek: 0,
    dealsClosed: 0,
    conversionRate: 0
  });

  const loading = contactsLoading || dealsLoading || repsLoading;
  const error = contactsError || dealsError || repsError;

  useEffect(() => {
    if (!loading && !error) {
      calculateMetrics();
    }
  }, [contacts, deals, salesReps, loading, error]);

  const calculateMetrics = () => {
    const totalLeads = contacts.length;
    const closedDeals = deals.filter(deal => deal.stage === "closed").length;
    const meetingsBooked = deals.filter(deal => 
      deal.stage === "meeting booked" || deal.stage === "meeting done"
    ).length;
    
    // Calculate meetings this week (mock data)
    const meetingsThisWeek = Math.floor(meetingsBooked * 0.3);
    
    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? ((closedDeals / totalLeads) * 100).toFixed(1) : 0;

    setMetrics({
      totalLeads,
      meetingsBooked,
      meetingsThisWeek,
      dealsClosed: closedDeals,
      conversionRate
    });
  };

  const getRecentActivity = () => {
    const recentDeals = deals
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
    
    const recentContacts = contacts
      .filter(c => c.lastContacted)
      .sort((a, b) => new Date(b.lastContacted) - new Date(a.lastContacted))
      .slice(0, 5);

    return { recentDeals, recentContacts };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <Error 
        title="Dashboard Error"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const { recentDeals, recentContacts } = getRecentActivity();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your sales overview.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <ApperIcon name="Calendar" size={16} />
          <span>{new Date().toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}</span>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Leads Contacted"
          value={metrics.totalLeads}
          change="+12%"
          changeType="positive"
          icon="Users"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Meetings Booked"
          value={metrics.meetingsBooked}
          change="+8%"
          changeType="positive"
          icon="Calendar"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <MetricCard
          title="Meetings This Week"
          value={metrics.meetingsThisWeek}
          change="+15%"
          changeType="positive"
          icon="Clock"
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <MetricCard
          title="Deals Closed"
          value={metrics.dealsClosed}
          change="+22%"
          changeType="positive"
          icon="TrendingUp"
          gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          change="+3%"
          changeType="positive"
          icon="Target"
          gradient="bg-gradient-to-br from-pink-500 to-pink-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Deals</h3>
              <ApperIcon name="TrendingUp" size={20} className="text-primary-500" />
            </div>
            <div className="space-y-3">
              {recentDeals.map((deal) => (
                <div key={deal.Id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{deal.name}</p>
                    <p className="text-sm text-gray-400">{deal.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">{formatCurrency(deal.value)}</p>
                    <p className="text-sm text-gray-400">{deal.probability}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Contacts</h3>
              <ApperIcon name="Users" size={20} className="text-primary-500" />
            </div>
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div key={contact.Id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{contact.name}</p>
                    <p className="text-sm text-gray-400">{contact.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">{contact.assignedRep}</p>
                    <p className="text-sm text-gray-400">{contact.lastContacted}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Pipeline Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pipeline Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { stage: "connected", name: "Connected", color: "bg-blue-500" },
              { stage: "locked", name: "Locked", color: "bg-yellow-500" },
              { stage: "meeting booked", name: "Meeting Booked", color: "bg-orange-500" },
              { stage: "meeting done", name: "Meeting Done", color: "bg-cyan-500" },
              { stage: "negotiation", name: "Negotiation", color: "bg-purple-500" },
              { stage: "closed", name: "Closed", color: "bg-green-500" },
              { stage: "lost", name: "Lost", color: "bg-red-500" },
            ].map((stage) => {
              const count = deals.filter(deal => deal.stage === stage.stage).length;
              const totalValue = deals
                .filter(deal => deal.stage === stage.stage)
                .reduce((sum, deal) => sum + deal.value, 0);
              
              return (
                <div key={stage.stage} className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${stage.color} flex items-center justify-center`}>
                    <span className="text-white font-bold">{count}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{stage.name}</p>
                  <p className="text-xs text-gray-400">{formatCurrency(totalValue)}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;