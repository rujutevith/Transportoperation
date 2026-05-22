import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    home: "Home",
    cars: "Cars",
    rent: "Rent",
    about: "About",
    contact: "Contact",
    browse_cars: "Browse Cars",
    rent_now: "Rent Now",
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
    view_details: "View Details",
    view_all_cars: "View All Cars"
  },
  fr: {
    home: "Accueil",
    cars: "Voitures",
    rent: "Location",
    about: "À propos",
    contact: "Contact",
    browse_cars: "Parcourir",
    rent_now: "Louer",
    our_fleet: "Notre Flotte",
    search_placeholder: "Rechercher...",
    all_types: "Tous",
    petrol: "Essence",
    diesel: "Diesel",
    electric: "Électrique",
    hybrid: "Hybride",
    fuel: "Carburant",
    transmission: "Transmission",
    seats: "Sièges",
    per_day: "/jour",
    view_details: "Voir",
    view_all_cars: "Voir tout"
  },
  rw: {
    home: "Akarere",
    cars: "Imodoka",
    rent: "Gukodesha",
    about: "Ibiranga",
    contact: "Twandikire",
    browse_cars: "Reba",
    rent_now: "Kodesha",
    our_fleet: "Imodoka Zacu",
    search_placeholder: "Shakisha...",
    all_types: "Zose",
    petrol: "Petiro",
    diesel: "Dizeli",
    electric: "Amashanyarazi",
    hybrid: "Hibridi",
    fuel: "Amavuta",
    transmission: "Imashini",
    seats: "Imyanya",
    per_day: "/umunsi",
    view_details: "Reba",
    view_all_cars: "Reba Zose"
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // t is a function, not an array!
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};