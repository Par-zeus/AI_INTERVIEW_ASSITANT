// src/components/Layout.jsx
import React from 'react';
import Navbar from '../Header/Navbar';
import Footer from '../Footer/Footer';

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

export default Layout;
