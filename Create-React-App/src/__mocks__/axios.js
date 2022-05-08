export default {
  get: jest.fn(() => Promise.resolve({ data: [
    { name: "Apples",  country: "Italy", cost: 3, instock: 10 },
    { name: "Oranges", country: "Spain", cost: 4, instock: 3 },
    { name: "Beans",   country: "USA",   cost: 2, instock: 8 },
    { name: "Cabbage", country: "USA",   cost: 1, instock: 8 },
    { name: "Nuts", country: "Brazil",   cost: 8, instock: 3 },
  ] })),
};