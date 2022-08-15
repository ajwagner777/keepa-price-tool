import React from 'react'
import ProductList from './features/products/ProductList'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-container">
        <ProductList />
      </header>
    </div>
  );
}

export default App;
