import { motion } from "framer-motion";

const Loading = ({ type = "skeleton", className = "" }) => {
  const pulseAnimation = {
    animate: {
      opacity: [0.6, 1, 0.6],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  if (type === "cards") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            {...pulseAnimation}
          >
            <div className="h-4 bg-gray-700 rounded mb-4"></div>
            <div className="h-8 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <motion.div className="h-6 bg-gray-700 rounded w-32" {...pulseAnimation} />
          </div>
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="flex items-center space-x-4"
                {...pulseAnimation}
                transition={{ ...pulseAnimation.transition, delay: i * 0.1 }}
              >
                <div className="h-4 bg-gray-700 rounded flex-1"></div>
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-4 bg-gray-700 rounded w-16"></div>
                <div className="h-4 bg-gray-700 rounded w-20"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "kanban") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 ${className}`}>
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gray-800 rounded-xl p-4 border border-gray-700"
            {...pulseAnimation}
            transition={{ ...pulseAnimation.transition, delay: i * 0.1 }}
          >
            <div className="h-5 bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="bg-gray-700 rounded-lg p-3">
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <motion.div className="h-8 bg-gray-700 rounded w-64" {...pulseAnimation} />
      <motion.div className="h-6 bg-gray-700 rounded w-48" {...pulseAnimation} />
      <motion.div className="h-4 bg-gray-700 rounded w-32" {...pulseAnimation} />
    </div>
  );
};

export default Loading;