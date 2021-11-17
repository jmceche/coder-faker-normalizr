import faker from "faker";

const productFaker = () => {
  let products = [];
  for (let i = 0; i < 5; i++) {
    products.push({
      id: i,
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      image: faker.image.image(),
    });
  }

  return products;
}
  
export default productFaker;