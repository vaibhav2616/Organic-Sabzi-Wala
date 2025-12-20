import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 pb-24 pt-8 transition-colors">
            <div className="max-w-2xl mx-auto px-6">
                <div className="grid grid-cols-1 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h2 className="text-xl font-bold text-green-700 dark:text-green-500 mb-2">Organic Sabzi Wala</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Bringing the freshest, chemical-free organic vegetables directly from the farm to your kitchen. Eat healthy, live healthy.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-white hover:bg-green-100 hover:text-green-700 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-white hover:bg-green-100 hover:text-green-700 transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-white hover:bg-green-100 hover:text-green-700 transition-colors">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li><Link to="/" className="hover:text-green-600">Home</Link></li>
                                <li><Link to="/categories" className="hover:text-green-600">Categories</Link></li>
                                <li><Link to="/orders" className="hover:text-green-600">My Orders</Link></li>
                                <li><Link to="/account" className="hover:text-green-600">Account</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Support</h3>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li><Link to="/contact-us" className="hover:text-green-600">Contact Us</Link></li>
                                <li><Link to="/privacy-policy" className="hover:text-green-600">Privacy Policy</Link></li>
                                <li><Link to="/terms-conditions" className="hover:text-green-600">Terms of Use</Link></li>
                                <li><Link to="/return-policy" className="hover:text-green-600">Return Policy</Link></li>
                                <li><Link to="/about-us" className="hover:text-green-600">About Us</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Contact Us</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-green-600 shrink-0 mt-0.5" />
                                <span>4/D-546-B Gomtinagar Extension, Sector-4, Lucknow, 226010</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-green-600 shrink-0" />
                                <a href="tel:+919235254303" className="hover:text-green-600">9235254303 (WhatsApp & Calling)</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-green-600 shrink-0" />
                                <a href="mailto:organicsabziwala1@gmail.com" className="hover:text-green-600">organicsabziwala1@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-6 text-center text-xs text-gray-400">
                    <p>© 2024 Organic Sabzi Wala. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
