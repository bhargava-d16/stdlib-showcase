# Data pipeline explorer

This is a simple React app that shows how data moves through different stages. It is interactive, so you can see how numbers change from raw input to the final analysis step by step.

### how it works

- **raw data** – generating a starting set of numbers  
- **ndarray** – putting those numbers into a structured ndarray  
- **transform** – changing the shape or slicing the data  
- **compute** – running operations like cumulative max or range  
- **analyze** – getting statistics like mean, median, and variance  

### how to run

1. clone the repo  
2. install dependencies: `npm install`  
3. run the project: `npm run dev`  

### tech used

- React (Vite)  
- JavaScript  
- stdlib  

### notes

- this project focuses more on understanding how data flows than on UI design  
- most operations are simple on purpose, so the behavior is easy to see  
- stdlib is used to explore ndarray and basic statistical operations  
