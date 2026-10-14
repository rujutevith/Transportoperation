import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

const RentalAgreement = () => {
  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Rental Policies</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">Rental Agreement & Insurance Policy</h1>
            <p className="text-xs text-gray-400 mt-2">Comprehensive terms governing self-drive and chauffeur rentals in Rwanda</p>
          </div>

          <div className="space-y-6 text-xs text-gray-300 leading-relaxed">
            <section className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
              <h2 className="text-base font-bold text-amber-400 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" /> 1. Driver Eligibility & Verification
              </h2>
              <p>
                The Renter must be at least 21 years of age and present a valid original national driving license held for a minimum of 2 years (or a recognized International Driving Permit for foreign visitors). Successful completion of the in-app Driver’s Verification is mandatory before keys handover.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">2. Security Deposit & Payment Hold</h2>
              <p>
                A refundable security deposit ($200 to $500 depending on vehicle class) is authorized at check-in. This deposit covers minor damages, traffic toll infractions, or fuel discrepancies and is fully released within 48 hours following vehicle return in undamaged condition.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">3. Mileage Limits & Territory of Use</h2>
              <p>
                Standard daily rentals include 250 km per day. Additional mileage is billed at $0.40/km for standard SUVs and $1.00/km for supercars. All vehicles are fitted with GPS telemetry for security. Crossing international borders into neighboring countries requires written advance authorization from EliteRent operations.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">4. Fuel Policy (Like-for-Like)</h2>
              <p>
                Vehicles are handed over with a full tank (or recorded level) and must be returned with the same fuel level. If returned lower, the refueling fee plus prevailing fuel cost will be debited from the security deposit.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-white mb-2">5. Insurance Coverages & Accident Liabilities</h2>
              <p className="mb-2">We provide three tiers of insurance coverage:</p>
              <ul className="space-y-1.5 ml-4">
                <li>• <strong>Basic Coverage:</strong> Third-party liability with a $1,000 deductible on accidental collision.</li>
                <li>• <strong>Comprehensive Plus:</strong> Reduced $300 deductible with windscreen and tire damage protection.</li>
                <li>• <strong>Full Zero-Deductible Waiver:</strong> Complete waiver covering all accidental damages under standard prudent driving.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalAgreement;
