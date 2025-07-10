import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const KanbanBoard = ({ deals, contacts, onUpdateDeal }) => {
  const stages = [
    { id: "connected", name: "Connected", color: "bg-blue-500" },
    { id: "locked", name: "Locked", color: "bg-yellow-500" },
    { id: "meeting booked", name: "Meeting Booked", color: "bg-orange-500" },
    { id: "meeting done", name: "Meeting Done", color: "bg-cyan-500" },
    { id: "negotiation", name: "Negotiation", color: "bg-purple-500" },
    { id: "closed", name: "Closed", color: "bg-green-500" },
    { id: "lost", name: "Lost", color: "bg-red-500" },
  ];

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage.toLowerCase() === stage.toLowerCase());
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const dealId = parseInt(draggableId);
    const newStage = destination.droppableId;

    onUpdateDeal(dealId, { stage: newStage });
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 overflow-x-auto pb-4 kanban-scroll">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          
          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <Card className="h-full">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <h3 className="font-semibold text-white">{stage.name}</h3>
                    </div>
                    <Badge variant="outline">{stageDeals.length}</Badge>
                  </div>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 min-h-[500px] space-y-3 ${
                        snapshot.isDraggingOver ? "bg-gray-800/50" : ""
                      }`}
                    >
                      {stageDeals.map((deal, index) => (
                        <Draggable
                          key={deal.Id}
                          draggableId={deal.Id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              whileHover={{ scale: 1.02 }}
                              className={`p-4 bg-gray-700 border border-gray-600 rounded-lg cursor-move ${
                                snapshot.isDragging ? "shadow-2xl rotate-2" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-white text-sm">{deal.name}</h4>
                                <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
                              </div>
                              
                              <p className="text-sm text-gray-300 mb-3">
                                {getContactName(deal.contactId)}
                              </p>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">Value</span>
                                  <span className="text-sm font-semibold text-green-400">
                                    {formatCurrency(deal.value)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">Rep</span>
                                  <span className="text-sm text-gray-300">{deal.assignedRep}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">Probability</span>
                                  <span className="text-sm text-gray-300">{deal.probability}%</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;