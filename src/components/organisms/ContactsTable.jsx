import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import StatusBadge from "@/components/molecules/StatusBadge";
import Card from "@/components/atoms/Card";

const ContactsTable = ({ contacts, onUpdateContact, onDeleteContact }) => {
  const [editingContact, setEditingContact] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (contact) => {
    setEditingContact(contact.Id);
    setEditForm(contact);
  };

  const handleSave = () => {
    onUpdateContact(editingContact, editForm);
    setEditingContact(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingContact(null);
    setEditForm({});
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(",").map(tag => tag.trim()).filter(tag => tag);
    setEditForm(prev => ({
      ...prev,
      tags: tags
    }));
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Company</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Assigned Rep</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Tags</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <motion.tr
                key={contact.Id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-4">
                  {editingContact === contact.Id ? (
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="min-w-[150px]"
                    />
                  ) : (
                    <span className="font-medium text-white">{contact.name}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingContact === contact.Id ? (
                    <Input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="min-w-[200px]"
                    />
                  ) : (
                    <span className="text-gray-300">{contact.email}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingContact === contact.Id ? (
                    <Input
                      value={editForm.company || ""}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="min-w-[150px]"
                    />
                  ) : (
                    <span className="text-gray-300">{contact.company}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingContact === contact.Id ? (
                    <Select
                      value={editForm.status || ""}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="min-w-[120px]"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="closed">Closed</option>
                      <option value="lost">Lost</option>
                    </Select>
                  ) : (
                    <StatusBadge status={contact.status} />
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingContact === contact.Id ? (
                    <Select
                      value={editForm.assignedRep || ""}
                      onChange={(e) => handleInputChange("assignedRep", e.target.value)}
                      className="min-w-[150px]"
                    >
                      <option value="Sarah Johnson">Sarah Johnson</option>
                      <option value="Mike Chen">Mike Chen</option>
                      <option value="Emily Rodriguez">Emily Rodriguez</option>
                      <option value="David Kim">David Kim</option>
                      <option value="Lisa Wang">Lisa Wang</option>
                    </Select>
                  ) : (
                    <span className="text-gray-300">{contact.assignedRep}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingContact === contact.Id ? (
                    <Input
                      value={editForm.tags ? editForm.tags.join(", ") : ""}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="Tag1, Tag2, Tag3"
                      className="min-w-[150px]"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-500/10 text-primary-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {editingContact === contact.Id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          className="text-xs"
                        >
                          <ApperIcon name="Check" size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          className="text-xs"
                        >
                          <ApperIcon name="X" size={14} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(contact)}
                          className="text-xs"
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteContact(contact.Id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ContactsTable;