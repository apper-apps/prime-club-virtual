import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const LeaderboardTable = ({ salesReps }) => {
  const sortedReps = [...salesReps].sort((a, b) => {
    const aScore = a.dealsClosed * 3 + a.meetingsBooked * 2 + a.leadsContacted;
    const bScore = b.dealsClosed * 3 + b.meetingsBooked * 2 + b.leadsContacted;
    return bScore - aScore;
  });

  const hunterOfMonth = sortedReps[0];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <ApperIcon name="Crown" size={20} className="text-yellow-500" />;
      case 1:
        return <ApperIcon name="Medal" size={20} className="text-gray-400" />;
      case 2:
        return <ApperIcon name="Award" size={20} className="text-orange-600" />;
      default:
        return <span className="text-gray-400 font-semibold">{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hunter of the Month */}
      {hunterOfMonth && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Crown" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Hunter of the Month</h3>
                  <p className="text-lg text-yellow-400 font-semibold">{hunterOfMonth.name}</p>
                  <p className="text-sm text-gray-400">
                    {hunterOfMonth.dealsClosed} deals closed • {formatCurrency(hunterOfMonth.revenue)} revenue
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2">
                🏆 #1 Performer
              </Badge>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Leaderboard Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Sales Performance Leaderboard</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/50">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Rank</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Sales Rep</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Leads Contacted</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Meetings Booked</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Deals Closed</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Revenue</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedReps.map((rep, index) => {
                const score = rep.dealsClosed * 3 + rep.meetingsBooked * 2 + rep.leadsContacted;
                
                return (
                  <motion.tr
                    key={rep.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-gray-700 hover:bg-gray-800/50 transition-colors ${
                      index === 0 ? "bg-yellow-500/5" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {rep.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{rep.name}</div>
                          <div className="text-sm text-gray-400">Sales Representative</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Phone" size={16} className="text-blue-500" />
                        <span className="text-white font-medium">{rep.leadsContacted}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Calendar" size={16} className="text-purple-500" />
                        <span className="text-white font-medium">{rep.meetingsBooked}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="CheckCircle" size={16} className="text-green-500" />
                        <span className="text-white font-medium">{rep.dealsClosed}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-green-400 font-semibold">
                        {formatCurrency(rep.revenue)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        className={`${
                          index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                          index === 1 ? "bg-gray-500/20 text-gray-400" :
                          index === 2 ? "bg-orange-500/20 text-orange-400" :
                          "bg-primary-500/20 text-primary-400"
                        }`}
                      >
                        {score}
                      </Badge>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LeaderboardTable;