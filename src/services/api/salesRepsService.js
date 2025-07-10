import salesRepsData from "@/services/mockData/salesReps.json";

let salesReps = [...salesRepsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const salesRepsService = {
  async getAll() {
    await delay(300);
    return [...salesReps];
  },

  async getById(id) {
    await delay(200);
    const rep = salesReps.find(r => r.Id === id);
    if (!rep) {
      throw new Error("Sales rep not found");
    }
    return { ...rep };
  },

  async create(repData) {
    await delay(400);
    const newRep = {
      ...repData,
      Id: Math.max(...salesReps.map(r => r.Id), 0) + 1,
      leadsContacted: 0,
      meetingsBooked: 0,
      dealsClosed: 0,
      revenue: 0
    };
    salesReps.push(newRep);
    return { ...newRep };
  },

  async update(id, updates) {
    await delay(350);
    const index = salesReps.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Sales rep not found");
    }
    salesReps[index] = { ...salesReps[index], ...updates };
    return { ...salesReps[index] };
  },

  async delete(id) {
    await delay(250);
    const index = salesReps.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Sales rep not found");
    }
    salesReps.splice(index, 1);
    return true;
  },

  async getLeaderboard() {
    await delay(200);
    const sorted = [...salesReps].sort((a, b) => {
      const aScore = a.dealsClosed * 3 + a.meetingsBooked * 2 + a.leadsContacted;
      const bScore = b.dealsClosed * 3 + b.meetingsBooked * 2 + b.leadsContacted;
      return bScore - aScore;
    });
    return sorted;
  },

  async getTopPerformer() {
    await delay(200);
    const sorted = [...salesReps].sort((a, b) => {
      const aScore = a.dealsClosed * 3 + a.meetingsBooked * 2 + a.leadsContacted;
      const bScore = b.dealsClosed * 3 + b.meetingsBooked * 2 + b.leadsContacted;
      return bScore - aScore;
    });
    return sorted[0] || null;
  }
};