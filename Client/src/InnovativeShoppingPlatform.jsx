import React from 'react';
import { Map, ShoppingBag, MessageCircle, Search, Leaf, Calendar, Users, BarChart, Image, Bot, Store, Shield } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
    <div className={`absolute top-0 left-0 w-2 h-full ${color}`}></div>
    <div className="p-5">
      <div className="flex items-start">
        <div className={`flex-shrink-0 p-2 rounded-full ${color.replace('bg-', 'bg-opacity-10 text-')}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  </div>
);

const InnovativeShoppingPlatform = () => {
  const features = [
    {
      icon: Map,
      title: "Smart Local Product Search",
      description: "Search by text or image to find products in nearby stores, compare prices, check reviews, and view store-specific offers.",
      color: "bg-blue-500"
    },
    {
      icon: ShoppingBag,
      title: "AI-Powered Inventory Management",
      description: "Small, family-run stores can easily list their inventory online using our AI integration tool, without needing advanced systems.",
      color: "bg-purple-500"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Shopping Mode",
      description: "Discover stores with sustainable practices, eco-friendly packaging, and products with a low carbon footprint.",
      color: "bg-green-500"
    },
    {
      icon: Calendar,
      title: "Product Reservation System",
      description: "Reserve items at nearby stores before visiting, ensuring product availability when you arrive.",
      color: "bg-yellow-500"
    },
    {
      icon: MessageCircle,
      title: "Community Chat Platform",
      description: "Connect with fellow shoppers to share tips, reviews, and recommendations about local stores and products.",
      color: "bg-pink-500"
    },
    {
      icon: Bot,
      title: "Intelligent AI Assistant",
      description: "Get real-time answers about the platform, products, or stores through our AI chatbot available 24/7.",
      color: "bg-red-500"
    },
    {
      icon: BarChart,
      title: "Business Analytics Dashboard",
      description: "Store owners can analyze customer buying patterns to stock popular items and offer targeted discounts.",
      color: "bg-indigo-500"
    },
    {
      icon: Image,
      title: "Social Media Product Feed",
      description: "Browse through visually appealing product posts similar to social media platforms.",
      color: "bg-cyan-500"
    },
    {
      icon: Store,
      title: "Small Business Empowerment",
      description: "Local shops can showcase their products to a wider audience and compete effectively in the digital marketplace.",
      color: "bg-amber-500"
    },
    {
      icon: Shield,
      title: "Secure Local Transactions",
      description: "Safe payment options and verified store profiles to ensure trusted shopping experiences.",
      color: "bg-emerald-500"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            Revolutionizing Local Shopping
          </h1>
          <p className="mt-3 text-lg text-gray-700 max-w-3xl mx-auto">
            A community-driven platform connecting shoppers with nearby stores through intelligent search, social features, and sustainable shopping options.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-purple-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="p-3 bg-purple-100 rounded-full">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-700 text-center md:text-left">
              <span className="font-semibold text-purple-700">Our Main Approach:</span> A Google Maps-type interface that helps users search for products in nearby stores, integrating AI for inventory management, sustainable shopping features, and a vibrant community platform.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InnovativeShoppingPlatform;