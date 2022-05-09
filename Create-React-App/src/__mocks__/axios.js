export default {
  get: jest.fn(() => Promise.resolve({
    data: {
      data: [
        { attributes: { name: "Apples",  country: "Italy", cost: 3, instock: 10 } },
        { attributes: { name: "Oranges", country: "Spain", cost: 4, instock: 3 } },
        { attributes: { name: "Beans",   country: "USA",   cost: 2, instock: 8 } },
        { attributes: { name: "Cabbage", country: "USA",   cost: 1, instock: 8 } },
        { attributes: { name: "Nuts", country: "Brazil",   cost: 8, instock: 3 } },
      ]
    }
  })),
};