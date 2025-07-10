import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useContacts } from "@/hooks/useContacts";
import ContactsTable from "@/components/organisms/ContactsTable";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Contacts = () => {
  const { 
    contacts, 
    loading, 
    error, 
    loadContacts, 
    updateContact, 
    deleteContact, 
    searchContacts, 
    filterContacts 
  } = useContacts();

  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [repFilter, setRepFilter] = useState("all");

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "closed", label: "Closed" },
    { value: "lost", label: "Lost" },
  ];

  const repOptions = [
    { value: "Sarah Johnson", label: "Sarah Johnson" },
    { value: "Mike Chen", label: "Mike Chen" },
    { value: "Emily Rodriguez", label: "Emily Rodriguez" },
    { value: "David Kim", label: "David Kim" },
    { value: "Lisa Wang", label: "Lisa Wang" },
  ];

  useEffect(() => {
    if (!loading && !error) {
      applyFilters();
    }
  }, [contacts, searchTerm, statusFilter, repFilter, loading, error]);

  const applyFilters = () => {
    let filtered = [...contacts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    // Apply rep filter
    if (repFilter !== "all") {
      filtered = filtered.filter(contact => contact.assignedRep === repFilter);
    }

    setFilteredContacts(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleRepFilter = (rep) => {
    setRepFilter(rep);
  };

  const handleUpdateContact = async (id, updates) => {
    try {
      await updateContact(id, updates);
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(id);
      } catch (error) {
        console.error("Failed to delete contact:", error);
      }
    }
  };

  const handleRetry = () => {
    loadContacts();
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to Load Contacts"
        message={error}
        onRetry={handleRetry}
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
          <h1 className="text-3xl font-bold text-white">Contacts</h1>
          <p className="text-gray-400 mt-1">Manage your leads and contacts</p>
        </div>
        <Button>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
      >
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search contacts..." 
        />
        <div className="flex gap-2">
          <FilterDropdown
            label="Status"
            options={statusOptions}
            onFilter={handleStatusFilter}
            selected={statusFilter}
          />
          <FilterDropdown
            label="Rep"
            options={repOptions}
            onFilter={handleRepFilter}
            selected={repFilter}
          />
        </div>
      </motion.div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          Showing {filteredContacts.length} of {contacts.length} contacts
        </span>
        <span>
          {statusFilter !== "all" && `Status: ${statusFilter}`}
          {statusFilter !== "all" && repFilter !== "all" && " • "}
          {repFilter !== "all" && `Rep: ${repFilter}`}
        </span>
      </div>

      {/* Contacts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredContacts.length === 0 ? (
          <Empty
            title="No contacts found"
            message="Try adjusting your search or filters to find contacts."
            icon="Users"
            action={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setRepFilter("all");
            }}
            actionLabel="Clear Filters"
          />
        ) : (
          <ContactsTable
            contacts={filteredContacts}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Contacts;