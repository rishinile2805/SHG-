import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to Jijamata SHG office in Nashik! We will reply promptly.', 'success');
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: 'General Inquiry',
      message: ''
    });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const faqs = [
    {
      q: 'Do you deliver across India or only in Maharashtra?',
      a: 'We ship all over India! We deliver to Mumbai, Pune, Nagpur, Bengaluru, Delhi, Hyderabad, and all major PIN codes via express courier partners. Dispatches originate from our Nashik facility within 24 hours.'
    },
    {
      q: 'Are any chemicals, preservatives, or artificial colors used?',
      a: 'Absolutely none. All our products are prepared according to traditional home recipes. Pickles are aged using pure cold-pressed mustard/sesame oil and salt. Sweets are bound in pure cow ghee.'
    },
    {
      q: 'What is the shelf life of Chakli, Papad, and Pickles?',
      a: 'Chakli & Chivda stay fresh and crisp for 3 months in airtight containers. Hand-rolled papads have a shelf life of 6 months. Pickles and Thecha have a shelf life of 9 to 12 months.'
    },
    {
      q: 'Can we order bulk gift boxes for Diwali or Family Weddings?',
      a: 'Yes! We customize corporate hampers and wedding return gift packs with personalized labels. Please send us an inquiry using the contact form or call us directly.'
    },
    {
      q: 'How can I support the women artisans of Jijamata SHG?',
      a: 'Every purchase directly supports our 45+ women members. You can also share our website with your friends, leave reviews, and spread word of authentic homemade Maharashtrian delicacies.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D2B]">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-serif text-[#2C221E]">
          We’d Love to Hear From You
        </h1>
        <p className="text-sm text-[#735F50]">
          Have questions about our homemade recipes, bulk orders, or your current delivery?
        </p>
      </div>

      {/* Contact Cards & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-6">
            <h3 className="font-bold text-lg font-serif text-[#2C221E]">
              Nashik Headquarters & Kitchen
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[#5C4A3E]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1E4D2B] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C221E]">Workshop Address</h4>
                  <p className="text-[#735F50] mt-0.5 leading-relaxed">
                    Jijamata Mahila Bachat Gat, Survey No. 42, Near Trimbak Road, Nashik, Maharashtra 422007
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C85A32] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C221E]">Phone Support</h4>
                  <p className="text-[#735F50] mt-0.5">+91 94222 18942 / +91 98230 55120</p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    WhatsApp Orders available on both numbers
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1E4D2B] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C221E]">Email Address</h4>
                  <p className="text-[#735F50] mt-0.5">contact@jijamatagruh.org</p>
                  <p className="text-[#735F50]">orders@jijamatagruh.org</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C85A32] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C221E]">Kitchen Operating Hours</h4>
                  <p className="text-[#735F50] mt-0.5">Monday to Saturday: 9:00 AM – 7:00 PM</p>
                  <p className="text-[#735F50]">Sunday: 10:00 AM – 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#E8DEC8] shadow-xs">
          <h3 className="font-bold text-xl font-serif text-[#2C221E] mb-2">
            Send a Message to Our SHG Team
          </h3>
          <p className="text-xs text-[#735F50] mb-6">
            Fill in the details below and our coordinator will get back to you within 2-4 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2C221E] block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anjali Joshi"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2C221E] block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2C221E] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2C221E] block mb-1">
                  Topic / Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  aria-label="Inquiry Topic / Subject"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
                >
                  <option value="General Inquiry">General Product Inquiry</option>
                  <option value="Bulk Order">Bulk / Corporate Gifting Order</option>
                  <option value="Order Tracking">Existing Order Inquiry</option>
                  <option value="Feedback">Recipe / Product Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2C221E] block mb-1">
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what you'd like to know or details about your order requirement..."
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
              ></textarea>
            </div>

            <button
              id="contact-form-submit-btn"
              type="submit"
              className="px-8 py-3.5 bg-[#1E4D2B] hover:bg-[#163E23] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-[#FAF4EC] rounded-3xl p-8 sm:p-12 border border-[#E8DEC8] space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            Answers to Common Queries
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2C221E]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#2C221E] hover:text-[#1E4D2B] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#C85A32] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#1E4D2B]' : 'text-gray-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#665446] leading-relaxed border-t border-[#F0E8DC]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
