export type Category =
  | "All"
  | "Shorts"
  | "Pants"
  | "Shoes"
  | "Jeans"
  | "T-Shirts";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: Exclude<Category, "All">;
  sizes: string[];
};

export const products: Product[] = [
  {
    id: "1",
    name: "Black T-Shirt",
    price: 20,
    image: "https://via.placeholder.com/300x400.png?text=Black+T-Shirt",
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "2",
    name: "Blue Jeans",
    price: 45,
    image: "https://via.placeholder.com/300x400.png?text=Blue+Jeans",
    category: "Jeans",
    sizes: ["30", "32", "34", "36"],
  },
  {
    id: "3",
    name: "Running Shoes",
    price: 60,
    image: "https://via.placeholder.com/300x400.png?text=Running+Shoes",
    category: "Shoes",
    sizes: ["40", "41", "42", "43"],
  },
  {
    id: "4",
    name: "Summer Shorts",
    price: 25,
    image: "https://via.placeholder.com/300x400.png?text=Summer+Shorts",
    category: "Shorts",
    sizes: ["S", "M", "L"],
  },
  {
    id: "5",
    name: "Cargo Pants",
    price: 38,
    image: "https://via.placeholder.com/300x400.png?text=Cargo+Pants",
    category: "Pants",
    sizes: ["S", "M", "L", "XL"],
  },
];