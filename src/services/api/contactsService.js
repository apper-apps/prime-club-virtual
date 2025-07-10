import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactsService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === id);
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const newContact = {
      ...contactData,
      Id: Math.max(...contacts.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      lastContacted: null
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, updates) {
    await delay(350);
    const index = contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    contacts[index] = { ...contacts[index], ...updates };
    return { ...contacts[index] };
  },

  async delete(id) {
    await delay(250);
    const index = contacts.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    contacts.splice(index, 1);
    return true;
  },

  async searchByName(searchTerm) {
    await delay(200);
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return [...filtered];
  },

  async filterByStatus(status) {
    await delay(200);
    if (status === "all") return [...contacts];
    const filtered = contacts.filter(contact => contact.status === status);
    return [...filtered];
  },

  async filterByRep(rep) {
    await delay(200);
    if (rep === "all") return [...contacts];
    const filtered = contacts.filter(contact => contact.assignedRep === rep);
    return [...filtered];
  }
};