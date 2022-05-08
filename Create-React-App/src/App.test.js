import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';
import axios from 'axios'

jest.mock('axios')
test('Example', async () => {
  axios.get.mockImplementation(url => {
    if (url === 'http://localhost:1337/api/products') {
      return Promise.resolve({ data: [
        { name: "Apples",  country: "Italy", cost: 3, instock: 10 },
        { name: "Oranges", country: "Spain", cost: 4, instock: 3 },
        { name: "Beans",   country: "USA",   cost: 2, instock: 8 },
        { name: "Cabbage", country: "USA",   cost: 1, instock: 8 },
        { name: "Nuts", country: "Brazil",   cost: 8, instock: 3 },
      ] })
    }
  })
  render(<App />)
  const text = await screen.findByText(/Apples/i)
  expect(text).toBeInTheDocument()
})