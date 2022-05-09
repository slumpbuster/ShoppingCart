import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Row,
  Col,
  Image
} from "react-bootstrap";

// simulate getting products from DataBase
/*
const products = [
  { name: "Apples",  country: "Italy", cost: 3, instock: 10 },
  { name: "Oranges", country: "Spain", cost: 4, instock: 3 },
  { name: "Beans",   country: "USA",   cost: 2, instock: 8 },
  { name: "Cabbage", country: "USA",   cost: 1, instock: 8 },
  { name: "Nuts", country: "Brazil",   cost: 8, instock: 3 },
];
const photos = Array(products.length).fill(1).map((x, y) => `https://picsum.photos/id/${(Math.ceil(Math.random()*100+(449+x+y)))}/50/50`);//["apple.png", "orange.png", "beans.png", "cabbage.png"];
*/
const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios.get(url);
        console.log("FETCH FROM URl");
        /*const result = await axios({
          url: `${url}/graphql`,
          method: 'post',
          data: {
            query: `
              query {
                products {
                  data {
                    attributes {
                      name
                      country
                      cost
                      instock
                    }
                  }
                }
              }
            `
          }
        }).then((result) => {
          console.log(result.data)
        });*/
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Products = (props) => {
  const [items, setItems] = useState([]);//useState([products]);
  const [cart, setCart] = useState([]);
  //  Fetch Data
  const [query, setQuery] = useState("products");
  const [{ data }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",{data: []}
  );
  useEffect(() => {
    console.log(`Rendering Products ${JSON.stringify(data)}`);
    let restockItems = data.data.map((item) => {
      const { name, country, cost, instock } = item.attributes;
      return { name, country, cost, instock };
    });
    setItems(restockItems);
  }, [data]);
  // Fetch Data
  const addToCart = (e) => {
    let name = e.target.name;
    let item = [];
    let newItems = [...items];  
    for (let i=0; i<newItems.length; i++) {
      if (newItems[i].name === name) {
        if (newItems[i].instock === 0) {
          alert(`${newItems[i].name} is currently out of stock`);
          break;
        } else {
          item.push(newItems[i]);
          newItems[i].instock -= 1;
          break;
        }
      }
    }
    //let item = items.filter((item) => item.name == name);
    console.log(`add to Cart ${JSON.stringify(item)}`);
    
    setItems([...newItems]);
    setCart([...cart, ...item]);
    //doFetch(query);
  };
  const deleteCartItem = (index) => {
    let newCart = [...cart];
    let newItems = [...items];
    for (let i=0; i<newItems.length; i++) {
      if (newItems[i].name === newCart[index].name) {
        newItems[i].instock += 1;
        newCart.splice(index,1);
        break;
      }
    }
    setItems([...newItems]);
    setCart(newCart);
  };
  
  let list = items.map((item, index) => {
    let n = index + 1049;
    let photos = "https://picsum.photos/id/" + n + "/50/50";
    //<Image src={photos[index % products.length]} width={70} roundedCircle></Image>

    return (
      <li key={index}>
        <Image src={photos} width={70} roundedCircle></Image>
        <Button variant="primary" size="large" style={{ width: "12em"}}>
          {item.name}:{item.cost}-Stock={item.instock}
        </Button>
        <input name={item.name} type="submit" onClick={addToCart}></input>
      </li>
    );
  });
  let cartList = cart.map((item, index) => {
    return (
      <div key={index} className="accordion-item" id={`cart_${index}`}>
        <h3 className="accordion-header">
          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse_${index}`} aria-expanded="true" aria-controls={`collapse_${index}`}>
            {item.name}
          </button>
        </h3>
        <div id={`collapse_${index}`} className="accordion-collapse collapse collapsed" aria-labelledby={`cart_${index}`} data-bs-parent="#cartContents">
          <div className="accordion-body" onClick={() => deleteCartItem(index)}>
            $ {item.cost} from {item.country}
          </div>
        </div>
      </div>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };
  // TODO: implement the restockProducts function
  const restockProducts = (url) => {
    doFetch(url);
    let restockItems = data.data.map((item) => {
      const { name, country, cost, instock } = item.attributes;
      return { name, country, cost, instock };
    });
    //setItems([...items, ...restockItems]);
    restockItems.map((stockItem, index) => {
      items.map((item) => {
        if (stockItem.name === item.name) {
          stockItem.instock += item.instock;
        }
      })
    })
    setItems([...restockItems]);
  };
  
  return (
    <Container>
      <Row>
        <Col>
          <h1>Product List</h1>
          <ul style={{ listStyleType: "none" }}>{list}</ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          <div className="accordion" id="cartContents">{cartList}</div>
        </Col>
        <Col>
          <h1>CheckOut </h1>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            restockProducts(`http://localhost:1337/api/${query}`);
            console.log(`Restock called on ${query}`);
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
};

export default Products;