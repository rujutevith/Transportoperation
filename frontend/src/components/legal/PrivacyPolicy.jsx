import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Privacy & Data Governance</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">Privacy Policy & GDPR Compliance</h1>
            <p className="text-xs text-gray-400 mt-2">How we collect, protect, and process user credentials and identity documentation.</p>
          </div>

          <div className="space-y-6 text-xs text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-white mb-2">1. Information We Collect</h2>
              <p>
                We collect personal information necessary to deliver automotive sales and rental services: (a) Contact details (name, email, phone number, residential address); (b) Government identity and driving license photos for statutory driver verification; (c) Vehicle inquiry and rental history.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">2. Processing of Identity & Driving Credentials</h2>
              <p>
                Driving license photographs and personal IDs uploaded through our Driver Verification system are stored using encrypted cloud storage with restricted access controls. They are accessed exclusively by authorized compliance personnel for insurance and fraud mitigation.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">3. Data Sharing & Third Parties</h2>
              <p>
                We do not sell user data. Relevant vehicle booking details are shared strictly between the customer and the listing dealership for rental fulfillment or vehicle delivery.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">4. Your Data Protection Rights</h2>
              <p>
                Under applicable data protection laws, you retain the right to request access to, rectification of, or erasure of your personal records. For inquiries, contact our Data Protection Officer at: <strong className="text-amber-400">isingizwekingthierry@gmail.com</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
