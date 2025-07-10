import { useState, useRef } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";

const DealTimeline = ({ deals, contacts, onUpdateDeal }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [resizingDeal, setResizingDeal] = useState(null);
  const timelineRef = useRef(null);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const years = [2024, 2025, 2026, 2027, 2028];

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : "Unknown";
  };

  const filteredDeals = deals.filter(deal => deal.year === selectedYear);

  const getMonthWidth = () => {
    if (timelineRef.current) {
      const containerWidth = timelineRef.current.offsetWidth;
      return (containerWidth - 200) / 12; // 200px for deal names column
    }
    return 100;
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, monthIndex) => {
    e.preventDefault();
    if (draggedDeal) {
      const duration = draggedDeal.endMonth - draggedDeal.startMonth;
      const newStartMonth = monthIndex + 1;
      const newEndMonth = Math.min(newStartMonth + duration, 12);
      
      onUpdateDeal(draggedDeal.Id, {
        startMonth: newStartMonth,
        endMonth: newEndMonth
      });
      setDraggedDeal(null);
    }
  };

  const handleResizeStart = (e, deal) => {
    e.stopPropagation();
    setResizingDeal(deal);
  };

  const handleResizeEnd = () => {
    setResizingDeal(null);
  };

  const getDealColor = (dealId) => {
    const colors = [
      "bg-gradient-to-r from-blue-500 to-blue-600",
      "bg-gradient-to-r from-purple-500 to-purple-600",
      "bg-gradient-to-r from-pink-500 to-pink-600",
      "bg-gradient-to-r from-green-500 to-green-600",
      "bg-gradient-to-r from-yellow-500 to-yellow-600",
      "bg-gradient-to-r from-red-500 to-red-600",
      "bg-gradient-to-r from-indigo-500 to-indigo-600",
      "bg-gradient-to-r from-cyan-500 to-cyan-600",
    ];
    return colors[dealId % colors.length];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Deal Timeline</h2>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="w-32"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
      </div>

      <div ref={timelineRef} className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Month Headers */}
          <div className="flex items-center border-b border-gray-700 pb-4 mb-4">
            <div className="w-48 text-sm font-medium text-gray-400">Deal Name</div>
            {months.map((month, index) => (
              <div
                key={month}
                className="flex-1 text-center text-sm font-medium text-gray-400 min-w-[80px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Deal Rows */}
          <div className="space-y-4">
            {filteredDeals.map((deal) => (
              <motion.div
                key={deal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center relative"
              >
                <div className="w-48 pr-4">
                  <div className="text-sm font-medium text-white truncate">
                    {deal.name}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {getContactName(deal.contactId)}
                  </div>
                  <div className="text-xs text-green-400">
                    {formatCurrency(deal.value)}
                  </div>
                </div>

                <div className="flex-1 relative h-12 flex items-center">
                  {/* Timeline Grid */}
                  <div className="absolute inset-0 flex">
                    {months.map((_, index) => (
                      <div
                        key={index}
                        className="flex-1 border-r border-gray-700/50 h-full"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      />
                    ))}
                  </div>

                  {/* Deal Bar */}
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragStart={(e) => handleDragStart(e, deal)}
                    className={`absolute h-8 rounded-lg cursor-move timeline-deal ${getDealColor(deal.Id)} 
                      shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between px-3`}
                    style={{
                      left: `${((deal.startMonth - 1) / 12) * 100}%`,
                      width: `${((deal.endMonth - deal.startMonth + 1) / 12) * 100}%`,
                      minWidth: "60px"
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.1, rotate: 2 }}
                  >
                    <span className="text-xs font-medium text-white truncate">
                      {deal.name}
                    </span>
                    
                    {/* Resize Handle */}
                    <div
                      className="resize-handle"
                      onMouseDown={(e) => handleResizeStart(e, deal)}
                      onMouseUp={handleResizeEnd}
                    >
                      <ApperIcon name="GripVertical" size={12} className="text-white/70" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Calendar" size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No deals found for {selectedYear}</p>
        </div>
      )}
    </Card>
  );
};

export default DealTimeline;