import { useState, useEffect } from "react";
import { contactsService } from "@/services/api/contactsService";
import { toast } from "react-toastify";

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactsService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contactData) => {
    try {
      const newContact = await contactsService.create(contactData);
      setContacts(prev => [...prev, newContact]);
      toast.success("Contact created successfully");
      return newContact;
    } catch (err) {
      toast.error("Failed to create contact");
      throw err;
    }
  };

  const updateContact = async (id, updates) => {
    try {
      const updatedContact = await contactsService.update(id, updates);
      setContacts(prev => prev.map(c => c.Id === id ? updatedContact : c));
      toast.success("Contact updated successfully");
      return updatedContact;
    } catch (err) {
      toast.error("Failed to update contact");
      throw err;
    }
  };

  const deleteContact = async (id) => {
    try {
      await contactsService.delete(id);
      setContacts(prev => prev.filter(c => c.Id !== id));
      toast.success("Contact deleted successfully");
    } catch (err) {
      toast.error("Failed to delete contact");
      throw err;
    }
  };

  const searchContacts = async (searchTerm) => {
    try {
      setLoading(true);
      setError("");
      const data = await contactsService.searchByName(searchTerm);
      setContacts(data);
    } catch (err) {
      setError(err.message || "Failed to search contacts");
      toast.error("Failed to search contacts");
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = async (filters) => {
    try {
      setLoading(true);
      setError("");
      let data = await contactsService.getAll();
      
      if (filters.status && filters.status !== "all") {
        data = await contactsService.filterByStatus(filters.status);
      }
      
      if (filters.rep && filters.rep !== "all") {
        data = await contactsService.filterByRep(filters.rep);
      }
      
      setContacts(data);
    } catch (err) {
      setError(err.message || "Failed to filter contacts");
      toast.error("Failed to filter contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    loadContacts,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    filterContacts
  };
};