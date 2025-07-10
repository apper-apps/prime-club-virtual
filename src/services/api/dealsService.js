import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealsService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === id);
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const newDeal = {
      ...dealData,
      Id: Math.max(...deals.map(d => d.Id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, updates) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals[index] = { 
      ...deals[index], 
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals.splice(index, 1);
    return true;
  },

  async getByStage(stage) {
    await delay(200);
    const filtered = deals.filter(deal => deal.stage.toLowerCase() === stage.toLowerCase());
    return [...filtered];
  },

  async getByYear(year) {
    await delay(200);
    const filtered = deals.filter(deal => deal.year === year);
    return [...filtered];
  },

  async updateStage(id, newStage) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals[index] = { 
      ...deals[index], 
      stage: newStage,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return { ...deals[index] };
  }
};