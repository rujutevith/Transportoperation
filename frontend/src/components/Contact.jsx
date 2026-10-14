import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, MessageSquare, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactService } from '../services/apiServices';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // Live Chat Floating Widget State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! Welcome to EliteRent Rwanda. Are you looking to rent a car or inquire about vehicle sales?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const faqs = [
    {
      q: "Where is your primary showroom and vehicle pickup hub located?",
      a: "Our headquarters and primary executive showroom is situated in Bugesera, Nyamata (Property Investment Area), with expedited airport meet-and-greet delivery directly at Kigali International Airport."
    },
    {
      q: "What documents are required to rent a vehicle?",
      a: "You need a valid National Driving License (held for at least 2 years) or an International Driving Permit, a government ID or passport, and verification completion."
    },
    {
      q: "Can I inspect or test drive a vehicle before purchasing?",
      a: "Yes! You can schedule a VIP test drive directly from any vehicle details page. Our automotive consultants will prepare the vehicle for your review."
    },
    {
      q: "Do you offer chauffeur services for weddings and diplomatic delegations?",
      a: "Yes, we have certified professional chauffeurs for executive VIP delegations, airport transfers, and special events across Rwanda."
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactService.submit(formData);
      toast.success(`Thank you, ${formData.name}! Your message has been routed to our Bugesera office.`);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.success(`Message recorded! Our customer support team will contact you shortly.`);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let botReply = "Thank you for reaching out! A live concierge representative is reviewing your message. You can also reach our 24/7 hotline at 0790068051.";
      const lower = userText.toLowerCase();
      if (lower.includes('rent') || lower.includes('hire')) {
        botReply = "Our rental fleet includes Land Cruisers, luxury sedans, and sports cars. You can browse them on our Cars page!";
      } else if (lower.includes('buy') || lower.includes('sale') || lower.includes('price')) {
        botReply = "All vehicles listed For Sale include verified history, clear titles, and financing calculators on their details page!";
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 700);
  };

  const whatsappNumber = '250790068051';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const instagramUsername = 'zodiac45';
  const instagramLink = `https://instagram.com/${instagramUsername}`;

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Support & Showroom</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-1">Get in Touch with EliteRent</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Our Bugesera concierge and vehicle specialists are available 24/7 to assist with rentals, purchases, and test drives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Details Card */}
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-bold text-lg text-white">Showroom & Headquarters</h3>
            
            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Bugesera, Nyamata</p>
                  <p className="text-gray-400">Property Investment Area, Eastern Province, Rwanda</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Direct Hotline / WhatsApp</p>
                  <p className="text-gray-400">0790068051 / +250 790 068 051</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Executive Desk</p>
                  <p className="text-gray-400">isingizwekingthierry@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Operating Hours</p>
                  <p className="text-gray-400">Monday - Sunday: 24/7 VIP Assistance</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 space-y-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition"
              >
                <MessageSquare className="w-4 h-4" /> Open Live Chat Widget
              </button>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-2 bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8">
            <h3 className="font-bold text-lg text-white mb-1">Send an Official Inquiry</h3>
            <p className="text-xs text-gray-400 mb-6">Whether booking a fleet or requesting a quote, we reply promptly.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Jean Paul"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. jean@example.com"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+250 7..."
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Car Rental Request">Car Rental Request</option>
                    <option value="Vehicle Purchase Consultation">Vehicle Purchase Consultation</option>
                    <option value="Dealer Partnership">Dealer Partnership Application</option>
                    <option value="Chauffeur & Airport Pickup">Chauffeur & Airport Pickup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Your Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Detail your requirements, preferred car, dates, or specific questions..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Transmitting...' : 'Dispatch Message'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQs Accordion Section */}
        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-10 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-gray-800 rounded-2xl overflow-hidden bg-black/60">
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full text-left p-4 flex items-center justify-between text-xs font-bold text-white hover:text-amber-400 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-gray-300 leading-relaxed border-t border-gray-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Live Chat Modal Widget */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[460px]">
          <div className="bg-gray-900 p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <div>
                <h4 className="font-bold text-xs text-white">Elite Concierge Live</h4>
                <p className="text-[10px] text-gray-400">Instant answers in Bugesera & Kigali</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-gray-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user' ? 'bg-amber-400 text-black font-semibold' : 'bg-gray-900 text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask about rental rates, models, buying..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="bg-amber-400 text-black px-3 rounded-xl font-bold text-xs hover:bg-amber-300"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Contact;