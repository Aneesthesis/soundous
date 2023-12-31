import bcrypt from "bcryptjs";
const data = {
  users: [
    {
      name: "Anees",
      email: "admin@soundous.com",
      password: bcrypt.hashSync("12345"),
      isAdmin: true,
    },
    {
      name: "Seena",
      email: "seena@soundous.com",
      password: bcrypt.hashSync("12345"),
      isAdmin: false,
    },
  ],

  products: [
    {
      name: "Logo Slim Shirt",
      slug: "logo-slim-shirt",
      category: "Shirts",
      image: "/images/p1.png",
      price: 1200,
      countInStock: 3,
      brand: "Nike",
      rating: 4.6,
      numReviews: 10,
      description: "high quality fabric",
    },
    {
      name: "Logo Slim Skirt",
      slug: "logo-slim-skirt",
      category: "Skirts",
      image: "/images/p2.png",
      price: 200,
      countInStock: 10,
      brand: "Lulu",
      rating: 3.2,
      numReviews: 10,
      description: "high quality print",
    },
    {
      name: "Fayd Regal Robes",
      slug: "fayd-regal-robes",
      category: "Robes",
      image: "/images/robe.png",
      price: 12233,
      countInStock: 2,
      brand: "Fayd",
      rating: 4,
      numReviews: 10,
      description: "premium nylon fabric",
    },
  ],
};

export default data;
