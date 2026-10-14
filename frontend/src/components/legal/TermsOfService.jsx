import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Legal Agreement</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">Platform Terms of Service</h1>
            <p className="text-xs text-gray-400 mt-2">Effective Date: October 2026 • EliteRent & TransportOperation Rwanda</p>
          </div>

          <div className="space-y-6 text-xs text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the TransportOperation / EliteRent platform, you agree to be bound by these Terms of Service. If you are registering on behalf of a vehicle dealership or commercial fleet operator, you warrant that you have authority to bind that entity.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">2. Dual Marketplace Operations</h2>
              <p>
                TransportOperation operates a dual-purpose automotive platform providing: (a) Vehicle short-term and long-term rental reservations, and (b) Vehicle sales marketplace facilitation between prospective buyers and verified dealers.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">3. User Roles & Account Security</h2>
              <p>
                Accounts are classified into Customers, Verified Dealers, and Platform Administrators. You are strictly prohibited from attempting unauthorized privilege escalation or circumventing platform access controls. All users must supply accurate identity documentation.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">4. Vehicle Transactions & Listings</h2>
              <p>
                Dealerships must ensure that all advertised vehicles comply with local roadworthiness standards, possess clear titles, and reflect genuine mileage and condition. TransportOperation reserves the right to unpublish or ban listings containing fraudulent claims.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">5. Governing Law & Dispute Resolution</h2>
              <p>
                These terms are governed by and construed in accordance with the laws of the Republic of Rwanda. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Kigali / Bugesera, Rwanda.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
