import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ title, value, change, changeType, icon, gradient }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {change && (
              <p className={`text-sm mt-1 flex items-center ${
                changeType === "positive" ? "text-green-400" : "text-red-400"
              }`}>
                <ApperIcon 
                  name={changeType === "positive" ? "ArrowUp" : "ArrowDown"} 
                  size={16} 
                  className="mr-1" 
                />
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${gradient}`}>
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;