import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { MenuProvider } from './context/MenuContext.tsx';
import { ProductProvider } from './context/ProductContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* <CartProvider> */}
          {/* <ProductProvider> */}
          {/* <MenuProvider> */}
        <App />
        {/* </MenuProvider> */}
        {/* </ProductProvider> */}
        {/* </CartProvider> */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
