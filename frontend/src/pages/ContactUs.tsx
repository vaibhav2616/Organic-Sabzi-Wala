import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: 'Inquiry', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Thank you for your ${formData.subject.toLowerCase()}! We will get back to you shortly.`);
        setFormData({ name: '', email: '', subject: 'Inquiry', message: '' });
    };

    return (
        <div className="min-h-screen bg-organic-cream dark:bg-gray-900 pt-20 pb-24 px-4 transition-colors">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-serif font-bold text-organic-text dark:text-gray-100 mb-2 text-center">Contact Us</h1>
                <p className="text-stone-500 dark:text-gray-400 text-center mb-10">We'd love to hear from you. Reach out to us for any queries.</p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-organic-green dark:text-green-400">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-organic-text dark:text-gray-200">Phone</h3>
                                <p className="text-sm text-stone-500 dark:text-gray-400">+91 98765 43210</p>
                                <p className="text-xs text-stone-400">Mon-Sat, 9am - 7pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-organic-green dark:text-green-400">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-organic-text dark:text-gray-200">Email</h3>
                                <p className="text-sm text-stone-500 dark:text-gray-400">support@organicsabziwala.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-organic-green dark:text-green-400">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-organic-text dark:text-gray-200">Office</h3>
                                <p className="text-sm text-stone-500 dark:text-gray-400">
                                    123, Organic Farm Road,<br />
                                    Gomti Nagar, Lucknow,<br />
                                    Uttar Pradesh - 226010
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
                        <div>
                            <label className="text-xs font-bold text-stone-500 dark:text-gray-400 uppercase mb-1 block">Your Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-gray-700 border border-stone-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-organic-green dark:text-white"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-stone-500 dark:text-gray-400 uppercase mb-1 block">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-gray-700 border border-stone-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-organic-green dark:text-white"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-stone-500 dark:text-gray-400 uppercase mb-1 block">Topic</label>
                            <select
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-gray-700 border border-stone-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-organic-green dark:text-white appearance-none"
                            >
                                <option value="Inquiry">General Inquiry</option>
                                <option value="Support">Order Support</option>
                                <option value="Suggestion">Suggestion / Feedback</option>
                                <option value="Complaint">Complaint</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-stone-500 dark:text-gray-400 uppercase mb-1 block">Message</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full p-3 rounded-xl bg-stone-50 dark:bg-gray-700 border border-stone-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-organic-green dark:text-white"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-organic-green text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Send size={18} /> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
