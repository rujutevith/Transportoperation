const { seedCars } = require('./seedData');

// In-memory data store with initial seeds for fallback / local development
class DataStore {
  constructor() {
    this.cars = [...seedCars];
    this.users = [
      {
        id: 1,
        name: "Thierry (Master Admin)",
        email: "isingizwetitanthierry@gmail.com",
        password: "$2a$10$rVeiREC.37t6TFl612vMIuEbtZFdIJzHEZKE5tulkcoeiMuBMa/3S", // "king@123"
        role: "admin",
        phone: "+250 790 068 051",
        address: "Bugesera, Nyamata, Rwanda",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
        is_verified: true,
        verification_status: "approved"
      },
      {
        id: 99,
        name: "Admin Thierry",
        email: "isingizwekingthierry@gmail.com",
        password: "$2a$10$rVeiREC.37t6TFl612vMIuEbtZFdIJzHEZKE5tulkcoeiMuBMa/3S", // "king@123"
        role: "admin",
        phone: "+250 790 068 051",
        address: "Bugesera, Nyamata, Rwanda",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
        is_verified: true,
        verification_status: "approved"
      },
      {
        id: 2,
        name: "Elite Motors Dealership",
        email: "dealer@eliterent.rw",
        password: "$2a$10$w0Bv4tT8vIqvXp/J01X8A.y066Vq1YmFkWFf4kU10O7R4Hq7mOaW2", // "admin123"
        role: "dealer",
        phone: "+250 788 123 456",
        address: "Kigali Special Economic Zone",
        dealer_company_name: "Elite Motors Rwanda Ltd",
        dealer_description: "Premier certified automotive sales and VIP rental operations in East Africa.",
        is_verified: true,
        verification_status: "approved"
      },
      {
        id: 3,
        name: "Eric Mugabo",
        email: "customer@gmail.com",
        password: "$2a$10$w0Bv4tT8vIqvXp/J01X8A.y066Vq1YmFkWFf4kU10O7R4Hq7mOaW2", // "admin123"
        role: "customer",
        phone: "+250 789 987 654",
        address: "Kicukiro, Kigali",
        is_verified: true,
        verification_status: "approved"
      }
    ];

    this.rentals = [
      {
        id: 101,
        user_id: 3,
        car_id: 9, // Land Cruiser
        start_date: "2026-10-20",
        end_date: "2026-10-25",
        pickup_time: "09:00 AM",
        dropoff_time: "05:00 PM",
        total_price: 700,
        status: "approved",
        insurance_option: "premium",
        insurance_cost: 150,
        security_deposit: 300,
        payment_status: "deposit_paid",
        pickup_location: "Bugesera, Nyamata",
        dropoff_location: "Bugesera, Nyamata",
        created_at: new Date().toISOString()
      },
      {
        id: 102,
        user_id: 3,
        car_id: 1, // Ferrari
        start_date: "2026-11-02",
        end_date: "2026-11-04",
        pickup_time: "10:00 AM",
        dropoff_time: "06:00 PM",
        total_price: 1700,
        status: "pending",
        insurance_option: "full",
        insurance_cost: 200,
        security_deposit: 500,
        payment_status: "unpaid",
        pickup_location: "Kigali Marriott Hotel",
        dropoff_location: "Kigali Marriott Hotel",
        created_at: new Date().toISOString()
      }
    ];

    this.salesOrders = [
      {
        id: 501,
        car_id: 4, // McLaren 720S
        buyer_id: 3,
        seller_id: 1,
        sale_price: 315000,
        financing_selected: true,
        down_payment: 63000,
        monthly_term_months: 48,
        status: "inquiry",
        payment_status: "unpaid",
        notes: "Interested in trade-in evaluation and delivery to Bugesera residence.",
        delivery_address: "Bugesera, Property Investment Area",
        created_at: new Date().toISOString()
      }
    ];

    this.testDrives = [
      {
        id: 301,
        car_id: 8, // BMW M8
        user_id: 3,
        scheduled_date: "2026-10-22",
        scheduled_time: "02:00 PM",
        notes: "Requesting test drive with sales consultant.",
        status: "confirmed",
        created_at: new Date().toISOString()
      }
    ];

    this.wishlists = [
      { id: 1, user_id: 3, car_id: 1 },
      { id: 2, user_id: 3, car_id: 3 },
      { id: 3, user_id: 3, car_id: 9 }
    ];

    this.verifications = [
      {
        id: 1,
        user_id: 3,
        license_number: "RW-DL-982341",
        license_expiry: "2029-08-15",
        license_front_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
        license_back_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
        id_document_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
        status: "approved",
        admin_notes: "Identity and driver license verified by EliteRent management.",
        submitted_at: "2026-09-01T10:00:00Z",
        reviewed_at: "2026-09-02T11:00:00Z"
      }
    ];

    this.reviews = [
      {
        id: 1,
        user_id: 3,
        user_name: "Eric Mugabo",
        car_id: 9,
        rating: 5,
        title: "Flawless safari and business trip",
        comment: "The Land Cruiser V8 was in immaculate condition. Clean interior, smooth transmission, and pick-up in Bugesera took under 3 minutes.",
        created_at: "2026-10-05T14:30:00Z"
      },
      {
        id: 2,
        user_id: 1,
        user_name: "David K.",
        car_id: 3,
        rating: 5,
        title: "Rolls Royce wedding service",
        comment: "Top notch chauffeur service with the Rolls Royce Ghost. The starlight ceiling was magical.",
        created_at: "2026-09-28T09:15:00Z"
      }
    ];

    this.messages = [
      {
        id: 1,
        sender_id: 3,
        sender_name: "Eric Mugabo",
        receiver_id: 1,
        car_id: 4,
        content: "Hello! Is the McLaren 720S available for viewing this Saturday afternoon?",
        is_read: false,
        created_at: "2026-10-12T16:20:00Z"
      },
      {
        id: 2,
        sender_id: 1,
        sender_name: "Admin Thierry",
        receiver_id: 3,
        car_id: 4,
        content: "Hi Eric! Yes, we have our showroom open from 9 AM to 6 PM. Let us know what time works best.",
        is_read: true,
        created_at: "2026-10-12T16:45:00Z"
      }
    ];

    this.blockedDates = [
      // { car_id: 1, date: "2026-10-24", reason: "maintenance" }
    ];
  }
}

const store = new DataStore();
module.exports = store;
