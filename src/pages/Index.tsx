
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Home, Building } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-[#1A1F2C] py-4 px-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              <span className="text-[#ea384c]">Jenga</span>{" "}
              <span className="text-white">Safe</span>
            </h1>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="text-black bg-white hover:bg-gray-100"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button 
                className="bg-[#ea384c] hover:bg-[#d32f41] text-white font-medium"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <div className="relative py-16 text-center text-white">
        <div className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80')",
            opacity: 0.7
          }}>
          <div className="absolute inset-0 bg-[#1A1F2C]/80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Property Management Platform</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Pay rent, chat with neighbors, request maintenance, monitor bills, and manage properties — all in one smart ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#ea384c] hover:bg-[#d32f41] text-white px-8 font-medium text-lg"
              onClick={() => navigate("/register")}
            >
              Create an Account
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 border border-gray-200"
              onClick={() => navigate("/login")}
            >
              Already Registered? Login
            </Button>
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#ea384c]">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#ea384c]/10 text-[#ea384c] mx-auto">
              <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Simplified Rent Collection</h2>
            <p className="text-gray-600 text-center">
              Streamline payments and keep track of all transactions in one place
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#1A1F2C]">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#1A1F2C]/10 text-[#1A1F2C] mx-auto">
              <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Easy Communication</h2>
            <p className="text-gray-600 text-center">
              Keep all property-related conversations organized and accessible
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#ea384c]">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#ea384c]/10 text-[#ea384c] mx-auto">
              <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Maintenance Management</h2>
            <p className="text-gray-600 text-center">
              Handle maintenance requests and track issues from start to resolution
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#ea384c] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <Home className="h-10 w-10 mx-auto mb-4 text-[#ea384c]" />
              <h3 className="font-semibold mb-2">Register & Verify</h3>
              <p className="text-gray-600 text-sm">Create an account and complete identity verification</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#1A1F2C] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <Building className="h-10 w-10 mx-auto mb-4 text-[#1A1F2C]" />
              <h3 className="font-semibold mb-2">Find Properties</h3>
              <p className="text-gray-600 text-sm">Browse available properties or list your own</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#ea384c] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <svg className="h-10 w-10 mx-auto mb-4 text-[#ea384c]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-semibold mb-2">Digital Leases</h3>
              <p className="text-gray-600 text-sm">Sign leases electronically and manage documents</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-[#1A1F2C] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
              <svg className="h-10 w-10 mx-auto mb-4 text-[#1A1F2C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold mb-2">Manage Payments</h3>
              <p className="text-gray-600 text-sm">Easy rent payments and financial tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our platform today and experience a better way to manage your rental properties or find your next home.
          </p>
          <Button 
            onClick={() => navigate("/register")} 
            className="bg-[#ea384c] hover:bg-[#d32f41] text-white px-8 font-medium text-lg"
          >
            Register Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Explore Properties Section - Moved to the end */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Explore Properties</h2>
        
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                <div className="relative h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" 
                    alt="Modern apartment building" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#ea384c] text-white px-2 py-1 text-xs rounded-full">
                    Featured
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-[#ea384c] mr-1" />
                    <span className="text-gray-600 text-sm">Karen, Nairobi</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Modern Apartment</h3>
                  <p className="text-gray-600 mb-4 text-sm">2 bedroom luxury apartment with modern amenities</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">KES 45,000/mo</span>
                    <Button variant="outline" size="sm" className="border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                <div className="relative h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" 
                    alt="Glass office building" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#1A1F2C] text-white px-2 py-1 text-xs rounded-full">
                    Commercial
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-[#1A1F2C] mr-1" />
                    <span className="text-gray-600 text-sm">Westlands, Nairobi</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Office Space</h3>
                  <p className="text-gray-600 mb-4 text-sm">Prime location office space with 24/7 security</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">KES 80,000/mo</span>
                    <Button variant="outline" size="sm" className="border-[#1A1F2C] text-[#1A1F2C] hover:bg-[#1A1F2C] hover:text-white">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>

            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                <div className="relative h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" 
                    alt="Cozy living room" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-[#ea384c] mr-1" />
                    <span className="text-gray-600 text-sm">Kilimani, Nairobi</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Family Townhouse</h3>
                  <p className="text-gray-600 mb-4 text-sm">3 bedroom townhouse in a gated community</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">KES 65,000/mo</span>
                    <Button variant="outline" size="sm" className="border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
        
        <div className="text-center mt-8">
          <Button 
            onClick={() => navigate("/register")} 
            className="bg-[#ea384c] hover:bg-[#d32f41] text-white font-medium text-lg"
          >
            Browse More Properties <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="mt-4 p-4 bg-green-600 rounded-md text-white max-w-lg mx-auto">
            <p className="text-sm">
              To view complete property details and submit rental applications, you need to sign up for an account. Registration is quick and free!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1A1F2C] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">
                <span className="text-[#ea384c]">Jenga</span>{" "}
                <span className="text-white">Safe</span>
              </h3>
              <p className="text-gray-400 text-sm">© 2025 All rights reserved</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#ea384c]">Terms</a>
              <a href="#" className="hover:text-[#ea384c]">Privacy</a>
              <a href="#" className="hover:text-[#ea384c]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
