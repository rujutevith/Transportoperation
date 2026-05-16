import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    home: "Home",
    cars: "Cars",
    rent: "Rent",
    about: "About",
    contact: "Contact",
    
    // Hero Section
    hero_title: "Drive Your Dream Car",
    hero_subtitle: "Experience luxury and comfort with our premium car rental service. Choose from our wide range of high-end vehicles.",
    browse_cars: "Browse Cars",
    rent_now: "Rent Now",
    
    // Features
    why_choose: "Why Choose EliteRent?",
    wide_selection: "Wide Selection",
    wide_selection_desc: "Choose from 50+ luxury and economy cars",
    full_insurance: "Full Insurance",
    full_insurance_desc: "Comprehensive coverage for peace of mind",
    support_247: "24/7 Support",
    support_247_desc: "Round-the-clock customer assistance",
    best_prices: "Best Prices",
    best_prices_desc: "Competitive rates with no hidden fees",
    
    // Featured Cars
    featured_vehicles: "Featured Vehicles",
    view_details: "View Details",
    view_all_cars: "View All Cars",
    
    // Stats
    happy_customers: "Happy Customers",
    luxury_cars: "Luxury Cars",
    successful_rentals: "Successful Rentals",
    
    // Cars Page
    our_fleet: "Our Fleet",
    search_placeholder: "Search by brand or model...",
    all_types: "All Types",
    petrol: "Petrol",
    diesel: "Diesel",
    electric: "Electric",
    hybrid: "Hybrid",
    fuel: "Fuel",
    transmission: "Transmission",
    seats: "Seats",
    per_day: "/day",
    no_cars_found: "No cars found matching your criteria.",
    
    // Rent Page
    rental_details: "Rental Details",
    location: "Location",
    pickup_location: "Pickup Location",
    dropoff_location: "Dropoff Location",
    date_time: "Date & Time",
    pickup_date: "Pickup Date",
    pickup_time: "Pickup Time",
    dropoff_date: "Dropoff Date",
    dropoff_time: "Dropoff Time",
    personal_info: "Personal Information",
    full_name: "Full Name",
    email: "Email",
    phone: "Phone",
    payment_info: "Payment Information",
    card_number: "Card Number",
    expiry_date: "Expiry Date",
    cvv: "CVV",
    confirm_booking: "Confirm Booking",
    why_rent_us: "Why Rent With Us?",
    no_hidden_fees: "No hidden fees",
    free_cancellation: "Free cancellation up to 24 hours",
    roadside_assistance: "24/7 roadside assistance",
    full_coverage: "Full insurance coverage",
    need_help: "Need Help?",
    call_support: "Call our support team at",
    
    // Car Details
    reviews: "reviews",
    daily_rate: "Daily Rate",
    number_of_days: "Number of Days",
    total_price: "Total Price",
    rent_this_car: "Rent This Car Now",
    free_cancellation_text: "Free Cancellation",
    
    // About Page
    about_us: "About EliteRent",
    our_mission: "Our Mission",
    mission_text: "To provide exceptional car rental experiences through quality vehicles, transparent pricing, and outstanding customer service. We strive to make luxury and convenience accessible to everyone.",
    our_values: "Our Values",
    customer_first: "Customer First",
    customer_first_desc: "Your satisfaction is our top priority",
    quality_service: "Quality Service",
    quality_service_desc: "Maintaining the highest standards",
    passion_cars: "Passion for Cars",
    passion_cars_desc: "Loving what we do every day",
    our_team: "Our Leadership Team",
    
    // Contact Page
    contact_us: "Contact Us",
    contact_subtitle: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    get_in_touch: "Get in Touch",
    address: "Address",
    business_hours: "Business Hours",
    mon_fri: "Monday - Friday: 9am - 8pm",
    sat_sun: "Saturday - Sunday: 10am - 6pm",
    emergency_support: "Emergency Support",
    roadside_assistance_247: "24/7 roadside assistance",
    your_name: "Your Name",
    email_address: "Email Address",
    subject: "Subject",
    message: "Message",
    send_message: "Send Message",
    
    // Footer
    quick_links: "Quick Links",
    contact_info: "Contact Info",
    newsletter: "Newsletter",
    newsletter_text: "Subscribe for exclusive offers and updates!",
    subscribe: "Subscribe",
    privacy_policy: "Privacy Policy",
    terms_service: "Terms of Service",
    all_rights: "All rights reserved",
    
    // Common
    loading: "Loading...",
    back: "Back",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    confirm_delete: "Are you sure you want to delete this car?"
  },
  fr: {
    // Navbar
    home: "Accueil",
    cars: "Voitures",
    rent: "Location",
    about: "À propos",
    contact: "Contact",
    
    // Hero Section
    hero_title: "Conduisez votre voiture de rêve",
    hero_subtitle: "Vivez le luxe et le confort avec notre service de location de voitures premium. Choisissez parmi notre large gamme de véhicules haut de gamme.",
    browse_cars: "Parcourir les voitures",
    rent_now: "Louer maintenant",
    
    // Features
    why_choose: "Pourquoi choisir EliteRent?",
    wide_selection: "Large sélection",
    wide_selection_desc: "Choisissez parmi 50+ voitures de luxe et économiques",
    full_insurance: "Assurance complète",
    full_insurance_desc: "Couverture complète pour la tranquillité d'esprit",
    support_247: "Support 24/7",
    support_247_desc: "Assistance clientèle 24 heures sur 24",
    best_prices: "Meilleurs prix",
    best_prices_desc: "Tarifs compétitifs sans frais cachés",
    
    // Featured Cars
    featured_vehicles: "Véhicules en vedette",
    view_details: "Voir les détails",
    view_all_cars: "Voir toutes les voitures",
    
    // Stats
    happy_customers: "Clients satisfaits",
    luxury_cars: "Voitures de luxe",
    successful_rentals: "Locations réussies",
    
    // Cars Page
    our_fleet: "Notre flotte",
    search_placeholder: "Rechercher par marque ou modèle...",
    all_types: "Tous les types",
    petrol: "Essence",
    diesel: "Diesel",
    electric: "Électrique",
    hybrid: "Hybride",
    fuel: "Carburant",
    transmission: "Transmission",
    seats: "Sièges",
    per_day: "/jour",
    no_cars_found: "Aucune voiture trouvée correspondant à vos critères.",
    
    // Rent Page
    rental_details: "Détails de location",
    location: "Emplacement",
    pickup_location: "Lieu de prise en charge",
    dropoff_location: "Lieu de dépôt",
    date_time: "Date et heure",
    pickup_date: "Date de prise en charge",
    pickup_time: "Heure de prise en charge",
    dropoff_date: "Date de dépôt",
    dropoff_time: "Heure de dépôt",
    personal_info: "Informations personnelles",
    full_name: "Nom complet",
    email: "E-mail",
    phone: "Téléphone",
    payment_info: "Informations de paiement",
    card_number: "Numéro de carte",
    expiry_date: "Date d'expiration",
    cvv: "CVV",
    confirm_booking: "Confirmer la réservation",
    why_rent_us: "Pourquoi louer chez nous?",
    no_hidden_fees: "Pas de frais cachés",
    free_cancellation: "Annulation gratuite jusqu'à 24 heures",
    roadside_assistance: "Assistance routière 24/7",
    full_coverage: "Couverture d'assurance complète",
    need_help: "Besoin d'aide?",
    call_support: "Appelez notre équipe de support au",
    
    // Car Details
    reviews: "avis",
    daily_rate: "Tarif journalier",
    number_of_days: "Nombre de jours",
    total_price: "Prix total",
    rent_this_car: "Louer cette voiture maintenant",
    free_cancellation_text: "Annulation gratuite",
    
    // About Page
    about_us: "À propos d'EliteRent",
    our_mission: "Notre mission",
    mission_text: "Fournir des expériences de location de voitures exceptionnelles grâce à des véhicules de qualité, des prix transparents et un service client exceptionnel. Nous nous efforçons de rendre le luxe et la commodité accessibles à tous.",
    our_values: "Nos valeurs",
    customer_first: "Client d'abord",
    customer_first_desc: "Votre satisfaction est notre priorité absolue",
    quality_service: "Service de qualité",
    quality_service_desc: "Maintenir les plus hauts standards",
    passion_cars: "Passion pour les voitures",
    passion_cars_desc: "Aimer ce que nous faisons chaque jour",
    our_team: "Notre équipe de direction",
    
    // Contact Page
    contact_us: "Contactez-nous",
    contact_subtitle: "Des questions? Nous aimerions avoir de vos nouvelles. Envoyez-nous un message et nous répondrons dès que possible.",
    get_in_touch: "Contactez-nous",
    address: "Adresse",
    business_hours: "Heures d'ouverture",
    mon_fri: "Lundi - Vendredi: 9h - 20h",
    sat_sun: "Samedi - Dimanche: 10h - 18h",
    emergency_support: "Support d'urgence",
    roadside_assistance_247: "Assistance routière 24/7",
    your_name: "Votre nom",
    email_address: "Adresse e-mail",
    subject: "Sujet",
    message: "Message",
    send_message: "Envoyer le message",
    
    // Footer
    quick_links: "Liens rapides",
    contact_info: "Coordonnées",
    newsletter: "Newsletter",
    newsletter_text: "Abonnez-vous pour des offres exclusives et des mises à jour!",
    subscribe: "S'abonner",
    privacy_policy: "Politique de confidentialité",
    terms_service: "Conditions d'utilisation",
    all_rights: "Tous droits réservés",
    
    // Common
    loading: "Chargement...",
    back: "Retour",
    cancel: "Annuler",
    save: "Enregistrer",
    edit: "Modifier",
    delete: "Supprimer",
    confirm_delete: "Êtes-vous sûr de vouloir supprimer cette voiture?"
  },
  rw: {
    // Navbar
    home: "Akarere",
    cars: "Imodoka",
    rent: "Gukodesha",
    about: "Ibiranga",
    contact: "Twandikire",
    
    // Hero Section
    hero_title: "Gitwara Imodoka yawe Nziza",
    hero_subtitle: "Menya uburyo bworoshye n'ibyiza hamwe na serivisi yacu yo gukodesha imodoka za premium. Hitamo mu modoka nyinshi zo mu rwego rwo hejuru.",
    browse_cars: "Reba Imodoka",
    rent_now: "Kodesha Nonaha",
    
    // Features
    why_choose: "Kuki wahitamo EliteRent?",
    wide_selection: "Amahitamo Menshi",
    wide_selection_desc: "Hitamo muri 50+ za modoka za karemani n'izisanzwe",
    full_insurance: "Ubwishingizi Bwuzuye",
    full_insurance_desc: "Ubwishingizi bwuzuye kugirango ube umutekano",
    support_247: "Ubufasha 24/7",
    support_247_desc: "Ubufasha bw'abakiriya buri gihe",
    best_prices: "Ibiciro Byiza",
    best_prices_desc: "Ibiciro bihambaye nta n'ibyoherwa byihishe",
    
    // Featured Cars
    featured_vehicles: "Imodoka Zagaragaye",
    view_details: "Reba Ibisobanuro",
    view_all_cars: "Reba Imodoka Zose",
    
    // Stats
    happy_customers: "Abakiriya Benevya",
    luxury_cars: "Imodoka za Karemani",
    successful_rentals: "Gukodesha Byakunze",
    
    // Cars Page
    our_fleet: "Imodoka Zacu",
    search_placeholder: "Shakisha ukurikije marike cyangwa model...",
    all_types: "Ubwose",
    petrol: "Petiro",
    diesel: "Dizeli",
    electric: "Amashanyarazi",
    hybrid: "Hibridi",
    fuel: "Amavuta",
    transmission: "Imashini",
    seats: "Imyanya",
    per_day: "/umunsi",
    no_cars_found: "Nta modoka ziboneka zihuje ibyo ushaka.",
    
    // Rent Page
    rental_details: "Ibisobanuro byo Gukodesha",
    location: "Ahantu",
    pickup_location: "Ahantu Ufata Imodoka",
    dropoff_location: "Ahantu Usigariza Imodoka",
    date_time: "Itariki n'Igihe",
    pickup_date: "Itariki Yo Gufata",
    pickup_time: "Igihe Cyo Gufata",
    dropoff_date: "Itariki Yo Gusigariza",
    dropoff_time: "Igihe Cyo Gusigariza",
    personal_info: "Amakuru Yawe",
    full_name: "Izina Ryawe",
    email: "Imeri",
    phone: "Telefone",
    payment_info: "Amakuru Yo Kwishyura",
    card_number: "Nomero ya Karte",
    expiry_date: "Itariki Iheruka",
    cvv: "CVV",
    confirm_booking: "Emeza Reservation",
    why_rent_us: "Kuki Wakodesha Turi Twebwe?",
    no_hidden_fees: "Nta nyungu zihishe",
    free_cancellation: "Guhagarika ubusa kugeza saa 24",
    roadside_assistance: "Ubufasha ku Muhanda 24/7",
    full_coverage: "Ubwishingizi bwuzuye",
    need_help: "Ukeneye Ubufasha?",
    call_support: "Hamagara timu yacu y'ubufasha kuri",
    
    // Car Details
    reviews: "ibitekerezo",
    daily_rate: "Igiciro cy'Umunsi",
    number_of_days: "Iminsi",
    total_price: "Igiciro Cyose",
    rent_this_car: "Kodesha Iyi Modoka Nonaha",
    free_cancellation_text: "Guhagarika ubusa",
    
    // About Page
    about_us: "Ibiranga EliteRent",
    our_mission: "Intego Yacu",
    mission_text: "Kugeza serivisi nziza yo gukodesha imodoka, ibiciro biringaniye, n'ubufasha bw'abakiriya budasanzwe. Duharanira ko buri wese abona uburyo bworoshye n'ibyiza.",
    our_values: "Indangagaciro Zacu",
    customer_first: "Abakiriya Banjye",
    customer_first_desc: "Kunyurwa kwawe ni byo byibanze",
    quality_service: "Serivisi Nziza",
    quality_service_desc: "Gukomeza ibipimo byo hejuru",
    passion_cars: "Gukunda Imodoka",
    passion_cars_desc: "Gukunda ibyo dukora buri munsi",
    our_team: "Ikipe Y'ubuyobozi",
    
    // Contact Page
    contact_us: "Twandikire",
    contact_subtitle: "Ufite ibibazo? Twakunda kubumva. Twandikire ubutumwa tuzagusubiza vuba.",
    get_in_touch: "Twandikire",
    address: "Aderesi",
    business_hours: "Saa Z'akazi",
    mon_fri: "Kuwa Mbere - Kuwa Gatanu: 9h - 20h",
    sat_sun: "Kuwa Gatandatu - Kuwa Cyumweru: 10h - 18h",
    emergency_support: "Ubufasha bw'Ingo",
    roadside_assistance_247: "Ubufasha ku Muhanda 24/7",
    your_name: "Izina Ryawe",
    email_address: "Aderesi ya Imeri",
    subject: "Ikibazo",
    message: "Ubutumwa",
    send_message: "Ohereza Ubutumwa",
    
    // Footer
    quick_links: "Amahuza Yihuse",
    contact_info: "Amakuru Yo Kuvugana",
    newsletter: "Amakuru Mashya",
    newsletter_text: "Iyandikishe kugirango ubone amakuru mashya!",
    subscribe: "Iyandikishe",
    privacy_policy: "Amabwiriza ya Bwirunga",
    terms_service: "Amategeko ya Serivisi",
    all_rights: "Uburenganzira bwose",
    
    // Common
    loading: "Birimo...",
    back: "Inyuma",
    cancel: "Guhagarika",
    save: "Kubika",
    edit: "Guhindura",
    delete: "Gusiba",
    confirm_delete: "Urabyizeye ko ushaka gusiba iyi modoka?"
  }
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};