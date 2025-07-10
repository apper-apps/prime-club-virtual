import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data available", 
  message = "Get started by adding your first item.",
  icon = "Inbox",
  action,
  actionLabel = "Add Item",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center min-h-[400px] text-center ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} size={32} className="text-primary-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      
      {action && (
        <Button
          onClick={action}
          className="min-w-[120px]"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;