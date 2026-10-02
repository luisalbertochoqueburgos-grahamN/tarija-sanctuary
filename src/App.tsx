import React, { useState, useEffect } from "react";

// Types
interface Service {
  name: string;
  price: number;
}

interface Salon {
  id: string;
  name: string;
  image: string;
  coverImage?: string;
  location: string;
  rating: number;
  reviewsCount: number;
  category: "salon" | "peluqueria" | "barberia" | "unas" | "spa";
  services: Service[];
  badge?: string;
  badgeIcon?: string;
  description?: string;
  distance?: string;
  minPrice?: string;
}

interface Booking {
  id: string;
  salonId: string;
  salonName: string;
  salonImage: string;
  salonLocation: string;
  salonRating: number;
  salonReviewsCount: number;
  services: Service[];
  date: string; // e.g. "15 Nov 2024"
  time: string; // e.g. "10:30 AM"
  subtotal: number;
  taxes: number;
  total: number;
  status: "Confirmada" | "Completada";
}

// Full Premium Mock Database matching exactly with the screenshots' hotlinks and copy
const ALL_SALONS: Salon[] = [
  {
    id: "lumiere",
    name: "Lumière Beauty Studio",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBu8Ih8ejtqCIrWH4wR79cm5V0z8IUFC3MSjfnrv7xUpt9-YEs_cfGbjDnsIpyGKLPleM0PSLgbTJOSAyZBpr_2t-e7h-kZLgRInDcnUA8TsMmKbptKmtnWBF36mrcnUF3eCKp1hZ-aEY6OHewRkbaFsMUPHZ-NCDH5mK0t2Q6MPMBxpgbzlmTpzWlXzdzx0sZf61OksaHYKvEkXJa4HxIVCoWT4I-ZlSwwS87Mt1_re7NenDo9qujM",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaDCIVtcXcu2F6LT4IINAcimvEzZyS6VqP4mXmSDF4fsvzU26lfkhTYMMN99Lsr1ZhgD12VD8GCwIUeedPxWOPLdh_YAjVWQOq9zJSZPSrrd2oqph0YBLWmDsUqPpgKN0lEPKBVqsrOa6vUDyE-1Ftp1x4MdhVPTQpdCQUgeRQ2Xd4l3QiWxW7fUYd_5vlndyT8ZouSm333uTtam-lTymvngqD1ekUDV6VYhxnv02bDbENISNc4o5g",
    location: "Av. San Bernardo 123, Tarija",
    rating: 4.95,
    reviewsCount: 128,
    category: "salon",
    distance: "500 m",
    minPrice: "Bs 80",
    description: "Espacio exclusivo para realzar tu belleza con los mejores tratamientos de Tarija.",
    services: [
      { name: "Corte de Cabello", price: 120 },
      { name: "Lavado y Peinado", price: 80 },
      { name: "Tratamiento Capilar", price: 150 },
      { name: "Corte y Peinado Especial", price: 180 }
    ]
  },
  {
    id: "nail_art",
    name: "Nail Art & Spa",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1qXWz0_mMoms9-HIw_LILOu9VCJWrEyHpfhofo8kq3bPlrBuPYekjfzsKs92G2RGQQJpbxT1dOQc7QKLofJU33kIE5zXKyYbieBmqaXVNAuBK-wKfJBNpxU4ZfeXEQ1XuYm444vHiWzar5xFIpiO0tLwi2z8432upVrN_9fCR-oJRzyGgoYG82F73likWLXNxrpevvpi645SUOwEBnLJ6-Df2JfBc3XoppYscLWsMs2uEtncL6ADN",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdahvV9L7yH4YpEdpauxime5y0H_grK6muVVvp_fFxZQ9FgDEFEHveysok5sddMl-Tkm-7LRdAzvM3u-pjcnKan0FKJQdpbWo7TMGdHnOwnAdFhlrPLjB3_NM6sfsQBrQTrXFumrA3gu5EmP4EDx4j6c8HiCWLAsWWmY1Z6rsPZ-93W9ptA8dnNauWZNeyw0HSBU-iKo1SYCI4G1XK5tuZHHQQgPLgh51spNBzW1MnDcsEBM9j3PgQ",
    location: "Calle Junín, Tarija",
    rating: 4.8,
    reviewsCount: 95,
    category: "unas",
    distance: "1.5 km",
    minPrice: "Bs 90",
    description: "Especialistas en manicura rusa, uñas esculpidas en gel y spa de manos premium.",
    services: [
      { name: "Manicura Rusa", price: 90 },
      { name: "Pedicura Spa de Rosas", price: 130 },
      { name: "Diseño Esculpido Gel", price: 160 }
    ]
  },
  {
    id: "gentleman",
    name: "The Gentleman’s Cut",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZMh8oQqyttGeqmMqoRPSNoKG-igEH7fdBc1RiTy7FxYuHyXmggOxeGQgp3EwNt0_p48m69O8Py73BlQtqujcATZBedVvcA2HJA5g8VulxEOuhvnxzBV6HVJhG5T3KojGdKgaV0Kqwi5KDLkULfFxLJ5HppBRcFqOSPunAb7s-V80QuoTrfJ_-KWiqGPmErtv-rizZzJypZo3qBI6hJKOnsappzlzM-1CR5RJbcECJs7P8NPCEKNmU",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZMh8oQqyttGeqmMqoRPSNoKG-igEH7fdBc1RiTy7FxYuHyXmggOxeGQgp3EwNt0_p48m69O8Py73BlQtqujcATZBedVvcA2HJA5g8VulxEOuhvnxzBV6HVJhG5T3KojGdKgaV0Kqwi5KDLkULfFxLJ5HppBRcFqOSPunAb7s-V80QuoTrfJ_-KWiqGPmErtv-rizZzJypZo3qBI6hJKOnsappzlzM-1CR5RJbcECJs7P8NPCEKNmU",
    location: "Plaza Principal, Tarija",
    rating: 4.9,
    reviewsCount: 210,
    category: "barberia",
    distance: "900 m",
    minPrice: "Bs 70",
    description: "Barbería clásica para el caballero de hoy. Afeitado con toalla caliente y cortes clásicos.",
    services: [
      { name: "Corte Ejecutivo", price: 100 },
      { name: "Afeitado Toalla Caliente", price: 70 },
      { name: "Cuidado de Barba VIP", price: 90 }
    ]
  },
  {
    id: "glow",
    name: "Glow Aesthetics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhtr2o7rle7iGGvpdyviDz3ACfBsxI6Xe9eSd9MduR2JaFEzDpjRpNKG-tI61_AeUx_oOVIZi9dZ9wbUsAwl5RMGR_DIuhAi7LXkr2uDktn9jlsTLBOaWN-NHgQKnCqAYPu1VJ3pDfq9_FqPnKrBfAZk8LTMBCDyt7BTDHNacLl9RJzI-J5sLa58BVisjpdr-xiTwLqrj40Gr8mNk7WFXrlFbylVoL1ktta92cBtGUt4mHoXpjH9HT",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhtr2o7rle7iGGvpdyviDz3ACfBsxI6Xe9eSd9MduR2JaFEzDpjRpNKG-tI61_AeUx_oOVIZi9dZ9wbUsAwl5RMGR_DIuhAi7LXkr2uDktn9jlsTLBOaWN-NHgQKnCqAYPu1VJ3pDfq9_FqPnKrBfAZk8LTMBCDyt7BTDHNacLl9RJzI-J5sLa58BVisjpdr-xiTwLqrj40Gr8mNk7WFXrlFbylVoL1ktta92cBtGUt4mHoXpjH9HT",
    location: "Av. Víctor Paz, Tarija",
    rating: 4.7,
    reviewsCount: 64,
    category: "spa",
    distance: "2.1 km",
    minPrice: "Bs 150",
    description: "Tu santuario de desconexión. Tratamientos faciales avanzados y masajes relajantes.",
    services: [
      { name: "Masaje Relajante Corporal", price: 200 },
      { name: "Limpieza Facial Profunda", price: 150 },
      { name: "Tratamiento Rehidratante", price: 180 }
    ]
  },
  {
    id: "eleganza",
    name: "Salón Eleganza Tarija",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWftEUd_0ejAD7wH30DSExB2ttWx93DP03OEe8WTwOSFpRLvLD7CWE1BjY3OjVmnY8-SSQfI70eWBW-QwqZkL1SL915PA1Gzz25yKdqA0RICWPbP4ZOfrx1hMwkaRdXd__TWPE1l7OxZOqhcG2MQLu92frvjFHqD81uAzCdnyVBKWKY35JuBkic8LO5E_uZ7aIgDfHqWaXfWuXIDTpF4pe9kMRvcRrfZEGC_ayLI_WnflgSKKCvQjI",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWftEUd_0ejAD7wH30DSExB2ttWx93DP03OEe8WTwOSFpRLvLD7CWE1BjY3OjVmnY8-SSQfI70eWBW-QwqZkL1SL915PA1Gzz25yKdqA0RICWPbP4ZOfrx1hMwkaRdXd__TWPE1l7OxZOqhcG2MQLu92frvjFHqD81uAzCdnyVBKWKY35JuBkic8LO5E_uZ7aIgDfHqWaXfWuXIDTpF4pe9kMRvcRrfZEGC_ayLI_WnflgSKKCvQjI",
    location: "Av. Victor Paz Estenssoro",
    rating: 4.9,
    reviewsCount: 184,
    category: "salon",
    distance: "1.2 km",
    minPrice: "Bs 120",
    badge: "Recomendado",
    badgeIcon: "verified",
    description: "Expertos en color y cortes de autor con técnicas vanguardistas europeas.",
    services: [
      { name: "Color y Reflejos", price: 250 },
      { name: "Corte de Autor", price: 120 },
      { name: "Peinado de Gala", price: 100 }
    ]
  },
  {
    id: "bellavida",
    name: "Bella Vida Estética",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFJEDzRGtXjv5k90tnC42NZRLQ-U-XjUr6IZmrhaMdzklEOwc1xhob9XyzHad7vZBlPeArXzaq13fRdPiPhGk_yOSlxabvQnfdOmKeJIP6VWpD5_QE0AzVu2KUtZf221KBH8qXUmLJNo3xCKiIR0DgZilETuNxKEqA--lXMfmAQV-6cXT1L6-Jsmf01UV8-JahEQwB4np2JA50kYL-K0B-fzxq0W16-wcNMyZ-hbNeHHTwGe8wpZjp",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFJEDzRGtXjv5k90tnC42NZRLQ-U-XjUr6IZmrhaMdzklEOwc1xhob9XyzHad7vZBlPeArXzaq13fRdPiPhGk_yOSlxabvQnfdOmKeJIP6VWpD5_QE0AzVu2KUtZf221KBH8qXUmLJNo3xCKiIR0DgZilETuNxKEqA--lXMfmAQV-6cXT1L6-Jsmf01UV8-JahEQwB4np2JA50kYL-K0B-fzxq0W16-wcNMyZ-hbNeHHTwGe8wpZjp",
    location: "Barrio Las Panosas",
    rating: 4.8,
    reviewsCount: 96,
    category: "salon",
    distance: "2.4 km",
    minPrice: "Bs 150",
    badge: "Tendencia",
    badgeIcon: "trending_up",
    description: "Tratamientos capilares premium, botox orgánico y balayage espectacular.",
    services: [
      { name: "Tratamiento Balayage", price: 320 },
      { name: "Botox Capilar Premium", price: 150 },
      { name: "Brushing de Queratina", price: 120 }
    ]
  },
  {
    id: "glamour",
    name: "Glamour Nails & Hair",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdahvV9L7yH4YpEdpauxime5y0H_grK6muVVvp_fFxZQ9FgDEFEHveysok5sddMl-Tkm-7LRdAzvM3u-pjcnKan0FKJQdpbWo7TMGdHnOwnAdFhlrPLjB3_NM6sfsQBrQTrXFumrA3gu5EmP4EDx4j6c8HiCWLAsWWmY1Z6rsPZ-93W9ptA8dnNauWZNeyw0HSBU-iKo1SYCI4G1XK5tuZHHQQgPLgh51spNBzW1MnDcsEBM9j3PgQ",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdahvV9L7yH4YpEdpauxime5y0H_grK6muVVvp_fFxZQ9FgDEFEHveysok5sddMl-Tkm-7LRdAzvM3u-pjcnKan0FKJQdpbWo7TMGdHnOwnAdFhlrPLjB3_NM6sfsQBrQTrXFumrA3gu5EmP4EDx4j6c8HiCWLAsWWmY1Z6rsPZ-93W9ptA8dnNauWZNeyw0HSBU-iKo1SYCI4G1XK5tuZHHQQgPLgh51spNBzW1MnDcsEBM9j3PgQ",
    location: "Calle General Trigo",
    rating: 4.9,
    reviewsCount: 210,
    category: "unas",
    distance: "800 m",
    minPrice: "Bs 90",
    badge: "Spa Ritual",
    badgeIcon: "spa",
    description: "Manicura y pedicura rusa impecable, diseño esculpido y color extraordinario.",
    services: [
      { name: "Manicura Rusa Esculpida", price: 150 },
      { name: "Pedicura Spa Rejuvenecedor", price: 130 },
      { name: "Corte y Peinado Básico", price: 90 }
    ]
  }
];

// Initial bookings database
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "booking-initial",
    salonId: "lumiere",
    salonName: "Lumière Beauty Studio",
    salonImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaDCIVtcXcu2F6LT4IINAcimvEzZyS6VqP4mXmSDF4fsvzU26lfkhTYMMN99Lsr1ZhgD12VD8GCwIUeedPxWOPLdh_YAjVWQOq9zJSZPSrrd2oqph0YBLWmDsUqPpgKN0lEPKBVqsrOa6vUDyE-1Ftp1x4MdhVPTQpdCQUgeRQ2Xd4l3QiWxW7fUYd_5vlndyT8ZouSm333uTtam-lTymvngqD1ekUDV6VYhxnv02bDbENISNc4o5g",
    salonLocation: "Av. San Bernardo 123, Tarija",
    salonRating: 4.95,
    salonReviewsCount: 128,
    services: [
      { name: "Corte de Cabello", price: 120 },
      { name: "Lavado y Peinado", price: 80 },
      { name: "Tratamiento Capilar", price: 150 }
    ],
    date: "15 Nov 2024",
    time: "10:30 AM",
    subtotal: 350,
    taxes: 15,
    total: 365,
    status: "Confirmada"
  }
];

export default function App() {
  // Navigation: 'explorar' | 'destacados' | 'citas' | 'mi-reserva'
  const [activeTab, setActiveTab] = useState<"explorar" | "destacados" | "citas" | "mi-reserva">("explorar");

  // Booking details (pre-selected values based on Image 6/3)
  const [selectedSalon, setSelectedSalon] = useState<Salon>(ALL_SALONS[0]); // Lumiere by default
  const [selectedServices, setSelectedServices] = useState<Service[]>([
    ALL_SALONS[0].services[0], // Corte de Cabello
    ALL_SALONS[0].services[1], // Lavado y Peinado
    ALL_SALONS[0].services[2]  // Tratamiento Capilar
  ]);
  const [selectedDateDay, setSelectedDateDay] = useState<number>(15); // Day 15
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");

  // Local state for interactive filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [destacadosFilter, setDestacadosFilter] = useState<"valorados" | "nuevos" | "ofertas">("valorados");

  // Save states persisted in LocalStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem("sanctuary_bookmarks");
    return saved ? JSON.parse(saved) : ["lumiere", "eleganza"];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("sanctuary_favorites");
    return saved ? JSON.parse(saved) : ["lumiere", "glamour"];
  });

  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("sanctuary_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // UI notifications and modal state
  const [isConfirmingModalOpen, setIsConfirmingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Save modifications to LocalStorage
  useEffect(() => {
    localStorage.setItem("sanctuary_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("sanctuary_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("sanctuary_bookings", JSON.stringify(confirmedBookings));
  }, [confirmedBookings]);

  // Show dynamic toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(b => b !== id));
      triggerToast("Eliminado de marcadores");
    } else {
      setBookmarks([...bookmarks, id]);
      triggerToast("Guardado en selección exclusiva");
    }
  };

  // Toggle Favorite in list
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      triggerToast("Eliminado de favoritos");
    } else {
      setFavorites([...favorites, id]);
      triggerToast("Añadido a tus favoritos");
    }
  };

  // Select a salon and automatically pre-fill services and navigate to booking
  const handleSelectSalonToBook = (salon: Salon) => {
    setSelectedSalon(salon);
    // Auto-select first two services or whatever exists
    if (salon.services.length > 0) {
      setSelectedServices([salon.services[0], ...(salon.services[1] ? [salon.services[1]] : [])]);
    } else {
      setSelectedServices([]);
    }
    setActiveTab("citas");
    triggerToast(`Agendando en ${salon.name}`);
  };

  // Toggle service selection in booking screen
  const handleToggleService = (service: Service) => {
    if (selectedServices.some(s => s.name === service.name)) {
      // Keep at least one service selected
      if (selectedServices.length === 1) {
        triggerToast("Debes elegir al menos un servicio");
        return;
      }
      setSelectedServices(selectedServices.filter(s => s.name !== service.name));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Calculate prices based on selected services
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const taxes = Math.round(subtotal * 0.043); // Premium aesthetic tax
  const total = subtotal + taxes;

  // Handle final checkout confirmation
  const handleConfirmReservation = () => {
    // Generate a fresh booking entry
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      salonId: selectedSalon.id,
      salonName: selectedSalon.name,
      salonImage: selectedSalon.coverImage || selectedSalon.image,
      salonLocation: selectedSalon.location,
      salonRating: selectedSalon.rating,
      salonReviewsCount: selectedSalon.reviewsCount,
      services: [...selectedServices],
      date: `${selectedDateDay} Nov 2024`,
      time: selectedTime,
      subtotal,
      taxes,
      total,
      status: "Confirmada"
    };

    setConfirmedBookings([newBooking, ...confirmedBookings]);
    setIsSuccessModalOpen(true);
  };

  // Cancel reservation
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm("¿Estás segura de que deseas cancelar esta reserva premium?")) {
      setConfirmedBookings(confirmedBookings.filter(b => b.id !== bookingId));
      triggerToast("Reserva cancelada con éxito sin cargos.");
    }
  };

  // Get active lists based on filters
  const filteredExplorarSalons = ALL_SALONS.filter(salon => {
    const matchesSearch = salon.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          salon.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          salon.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "todos" || salon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredDestacadosSalons = ALL_SALONS.filter(salon => {
    // Show only the 3 specific high-fidelity featured salons + others matching rating
    if (destacadosFilter === "valorados") {
      return salon.rating >= 4.8;
    } else if (destacadosFilter === "nuevos") {
      // Just a mock list permutation for high fidelity feel
      return ["bellavida", "lumiere", "glow"].includes(salon.id);
    } else {
      // Ofertas
      return ["glamour", "gentleman", "eleganza"].includes(salon.id);
    }
  });

  return (
    <div className="h-dvh md:h-auto md:min-h-screen bg-[#131315] text-[#e5e1e4] flex justify-center md:items-center p-0 md:p-6 overflow-hidden select-none">
      
      {/* Phone Frame: altura exacta al viewport en móvil, marco fijo en desktop */}
      <div className="relative w-full max-w-md bg-[#131315] h-dvh md:h-[min(880px,94dvh)] md:rounded-[40px] md:border-8 md:border-[#201f21] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
        
        {/* iOS StatusBar Mockup */}
        <header className="shrink-0 sticky top-0 w-full z-50 pt-3 px-6 bg-[#131315]/85 backdrop-blur-2xl border-b border-[#201f21]/30">
        {/* Header Branding Container */}
          <div className="h-14 mt-2 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#fec4b0]">
                Tarija Sanctuary
              </span>
              <h1 className="text-[22px] font-bold tracking-tight text-white leading-tight capitalize">
                {activeTab === "explorar" && "Explorar"}
                {activeTab === "destacados" && "Destacados"}
                {activeTab === "citas" && "Citas"}
                {activeTab === "mi-reserva" && "Mi Reserva"}
              </h1>
            </div>
            
            {/* Quick Profile Avatar Click triggers Easter Egg message */}
            <button 
              onClick={() => triggerToast("¡Hola Valentina! Disfruta de tu experiencia VIP en Tarija")}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fec4b0] to-[#713a24] p-[1.5px] flex items-center justify-center shrink-0 active:scale-95 transition-transform cursor-pointer"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgyjyB21B9RPYiDrRCsHhrJrE52RoouOhYZEpN5cOaeowRIYkHqcIIzLN7LuxodvyKyptJAA7OaYTFfzHJqdU4JK5Gix2sbBbj9lMsK5Y3VU2MMrbNQ0SqOHauwMmnLw_ZrgU5JD70xsCqStnCuP4YTGWkMm5l-zop6z6mjN1-X8L0WUQa3o7XlIOzM-cNzh4E6VeTjTFnwcpGsNauKrBJ48TGXPpSNV4_YBKRfi06sp-FqyL2e1kw" 
                alt="Valentina Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            </button>
          </div>
        </header>

        {/* Dynamic Toast System */}
        {toastMessage && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-[#2a2a2c]/90 backdrop-blur-xl border border-[#fec4b0]/25 px-4 py-2.5 rounded-full text-xs text-[#fec4b0] shadow-2xl flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Main Interactive Screen Content (scroll interno, el nav queda fijo) */}
        <main className="flex-1 min-h-0 pb-32 overflow-y-auto no-scrollbar">
          
          {/* TAB 1: EXPLORAR (Hola, Valentina Screen) */}
          {activeTab === "explorar" && (
            <div className="px-5 pt-3 space-y-5 animate-fadeIn">
              
              {/* Premium Welcome Header with high end portrait backdrop */}
              <div className="flex items-center justify-between bg-gradient-to-r from-[#201f21] to-[#131315] p-4 rounded-3xl border border-[#353437]/40 relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex flex-col space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#e0a996]">
                    Experiencia Privada
                  </span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Hola, Valentina
                  </h2>
                  <p className="text-xs text-[#d5c3bd]">Disfruta del cuidado premium hoy</p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 bg-gradient-to-l from-[#fec4b0]/40 to-transparent pointer-events-none"></div>
                <span className="material-symbols-outlined text-4xl text-[#fec4b0]/20 absolute right-4 bottom-2 select-none">spa</span>
              </div>

              {/* Glassmorphic Live Search Bar */}
              <div className="relative w-full">
                <div className="flex items-center w-full h-[52px] px-4 rounded-2xl bg-[#201f21]/90 border border-[#353437]/30 shadow-inner focus-within:border-[#fec4b0]/50 focus-within:shadow-[0_0_15px_rgba(254,196,176,0.15)] transition-all duration-300">
                  <span className="material-symbols-outlined text-[#9e8d88] text-[22px] mr-2.5">search</span>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar salones, servicios, zonas..." 
                    className="w-full bg-transparent text-sm text-[#e5e1e4] placeholder-[#9e8d88] focus:outline-none"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-[#fec4b0] hover:underline mr-1 font-semibold"
                    >
                      Limpiar
                    </button>
                  )}
                  <button className="w-8 h-8 rounded-full flex items-center justify-center bg-[#2a2a2c]/85 text-[#fec4b0] shrink-0">
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                  </button>
                </div>
              </div>

              {/* Horizontal Filter Category Chips */}
              <div className="w-full">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {[
                    { id: "todos", label: "Todos" },
                    { id: "salon", label: "Salón de Belleza" },
                    { id: "peluqueria", label: "Peluquería" },
                    { id: "barberia", label: "Barbería" },
                    { id: "unas", label: "Uñas" },
                    { id: "spa", label: "Spa" }
                  ].map((chip) => {
                    const isActive = selectedCategory === chip.id;
                    return (
                      <button
                        key={chip.id}
                        onClick={() => setSelectedCategory(chip.id)}
                        className={`px-4 py-2 rounded-full font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                          isActive 
                            ? "bg-[#e0a996] text-[#311307] shadow-[0_4px_14px_rgba(224,169,150,0.35)] scale-105" 
                            : "bg-[#201f21]/70 text-[#d5c3bd] hover:text-white hover:bg-[#2a2a2c]"
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#311307]"></span>}
                        <span>{chip.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Near you (Cerca de ti) Section Title */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold tracking-tight text-white">Cerca de ti</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#201f21] text-[#fec4b0] text-[10px] font-bold uppercase tracking-wider">
                    Tarija
                  </span>
                </div>
                <button 
                  onClick={() => triggerToast("Mostrando mapa de salones en Tarija...")}
                  className="text-xs font-semibold text-[#e0a996] hover:underline"
                >
                  Ver mapa
                </button>
              </div>

              {/* Interactive List of premium salons near you */}
              <div className="space-y-4">
                {filteredExplorarSalons.length > 0 ? (
                  filteredExplorarSalons.map((salon) => {
                    const isFav = favorites.includes(salon.id);
                    return (
                      <div 
                        key={salon.id}
                        onClick={() => handleSelectSalonToBook(salon)}
                        className="group relative flex items-center p-3 rounded-3xl bg-[#201f21]/60 backdrop-blur-xl border border-[#353437]/30 hover:border-[#fec4b0]/30 hover:bg-[#2a2a2c]/50 transition-all duration-300 shadow-md cursor-pointer active:scale-[0.99]"
                      >
                        {/* Salon image thumbnail */}
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#0e0e10]">
                          <img 
                            src={salon.image} 
                            alt={salon.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <span className="absolute bottom-1.5 left-2 text-[9px] font-bold bg-[#131315]/80 text-[#fec4b0] px-1.5 py-0.5 rounded">
                            {salon.distance}
                          </span>
                        </div>

                        {/* Text and meta info */}
                        <div className="flex flex-col justify-between flex-1 min-w-0 ml-4 h-24 py-1">
                          <div>
                            <h4 className="text-[15px] font-bold text-white tracking-tight truncate leading-tight group-hover:text-[#fec4b0] transition-colors">
                              {salon.name}
                            </h4>
                            <p className="text-xs text-[#d5c3bd] flex items-center gap-1 mt-1 truncate">
                              <span className="material-symbols-outlined text-[14px] text-[#fec4b0] shrink-0">pin_drop</span>
                              {salon.location}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Stars badge */}
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#353437]/60">
                              <span className="material-symbols-outlined text-[13px] text-[#fec4b0]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <span className="text-xs font-bold text-white">{salon.rating}</span>
                              <span className="text-[10px] text-[#d5c3bd]">({salon.reviewsCount})</span>
                            </div>

                            {/* Fav heart toggle button */}
                            <button
                              onClick={(e) => toggleFavorite(salon.id, e)}
                              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#2a2a2c]/60 hover:bg-[#353437] text-[#fec4b0] active:scale-90 transition-transform"
                            >
                              <span 
                                className="material-symbols-outlined text-[18px]"
                                style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                favorite
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 bg-[#201f21]/40 rounded-3xl border border-dashed border-[#353437]">
                    <span className="material-symbols-outlined text-4xl text-[#9e8d88] mb-2">sentiment_dissatisfied</span>
                    <p className="text-sm text-[#d5c3bd]">No encontramos salones para tu búsqueda.</p>
                    <button 
                      onClick={() => { setSearchQuery(""); setSelectedCategory("todos"); }} 
                      className="mt-3 text-xs text-[#fec4b0] font-bold hover:underline"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                )}
              </div>

              {/* Extra info section matching high fidelity sanctuary feel */}
              <div className="bg-gradient-to-br from-[#713a24]/20 to-[#131315] p-5 rounded-3xl border border-[#713a24]/30">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#fec4b0] text-2xl">workspace_premium</span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Garantía Sanctuary</h4>
                    <p className="text-xs text-[#d5c3bd] leading-relaxed">
                      Todos los salones listados están verificados individualmente por nuestro equipo. Garantizamos higiene estricta, alta profesionalidad y puntualidad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DESTACADOS (Top en Tarija vertical feed) */}
          {activeTab === "destacados" && (
            <div className="px-5 pt-3 space-y-5 animate-fadeIn">
              
              {/* Back & Sub-header navigation row */}
              <div className="flex items-center justify-between py-1 mb-1">
                <button 
                  onClick={() => setActiveTab("explorar")}
                  className="w-10 h-10 rounded-full bg-[#201f21]/80 border border-[#353437]/40 flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                
                <div className="flex flex-col items-center text-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#fec4b0]">
                    Selección Exclusiva
                  </span>
                  <h2 className="text-[17px] font-bold text-white tracking-tight leading-tight">
                    Top en Tarija
                  </h2>
                </div>

                <button 
                  onClick={() => triggerToast("Filtros avanzados de selección")}
                  className="w-10 h-10 rounded-full bg-[#201f21]/80 border border-[#353437]/40 flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </button>
              </div>

              {/* Segmented iOS Style Tabs (Más valorados, Nuevos, Ofertas) */}
              <div className="flex items-center justify-between pb-1 border-b border-[#353437]/40">
                <div className="flex items-center gap-5">
                  {[
                    { id: "valorados", label: "Más valorados" },
                    { id: "nuevos", label: "Nuevos" },
                    { id: "ofertas", label: "Ofertas" }
                  ].map((tab) => {
                    const isActive = destacadosFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setDestacadosFilter(tab.id as any)}
                        className={`relative pb-2 text-xs font-semibold transition-all ${
                          isActive ? "text-[#fec4b0]" : "text-[#d5c3bd] hover:text-white"
                        }`}
                      >
                        <span>{tab.label}</span>
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fec4b0] rounded-full shadow-[0_0_10px_rgba(254,196,176,0.8)]"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 bg-[#201f21]/95 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#d5c3bd]">
                  <span className="material-symbols-outlined text-[13px] text-[#fec4b0]">location_on</span>
                  <span>Tarija, BO</span>
                </div>
              </div>

              {/* Curated list of cards matching precisely with Image 1.png */}
              <div className="space-y-5">
                {filteredDestacadosSalons.map((salon) => {
                  const isBookmarked = bookmarks.includes(salon.id);
                  return (
                    <article 
                      key={salon.id}
                      onClick={() => handleSelectSalonToBook(salon)}
                      className="group relative rounded-3xl bg-[#201f21]/40 border border-[#353437]/30 backdrop-blur-xl overflow-hidden shadow-2xl active:scale-[0.99] transition-all duration-300 cursor-pointer"
                    >
                      {/* Cover Photo */}
                      <div className="relative w-full h-48 overflow-hidden bg-[#0e0e10]">
                        <img 
                          src={salon.image} 
                          alt={salon.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#131315]/20 to-transparent"></div>

                        {/* Floating dynamic badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#0e0e10]/80 backdrop-blur-md text-[#fec4b0] text-[10px] font-bold shadow-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-[#fec4b0]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {salon.badgeIcon || "verified"}
                            </span>
                            {salon.badge || "Recomendado"}
                          </span>
                        </div>

                        {/* Floating bookmark badge button */}
                        <button 
                          onClick={(e) => toggleBookmark(salon.id, e)}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#0e0e10]/70 backdrop-blur-md flex items-center justify-center text-[#fec4b0] hover:bg-[#0e0e10]/95 active:scale-90 transition-transform"
                        >
                          <span 
                            className="material-symbols-outlined text-[18px]"
                            style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            bookmark
                          </span>
                        </button>
                      </div>

                      {/* Info and action row */}
                      <div className="p-4 pt-2 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-[#fec4b0] transition-colors">
                            {salon.name}
                          </h3>
                          {/* Rating Pill */}
                          <div className="flex items-center gap-1 bg-[#353437]/60 px-2.5 py-0.5 rounded-full shrink-0">
                            <span className="material-symbols-outlined text-[13px] text-[#fec4b0]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-xs font-bold text-white">{salon.rating}</span>
                            <span className="text-[10px] text-[#d5c3bd]">({salon.reviewsCount})</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#d5c3bd] line-clamp-1">
                          {salon.description || "Expertos con servicios de autor de alta categoría estética."}
                        </p>

                        <div className="mt-2 pt-2 border-t border-[#353437]/20 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[#d5c3bd]">
                            <span className="material-symbols-outlined text-[14px] text-[#fec4b0]/80">near_me</span>
                            <span className="text-[11px] font-medium">{salon.location} • {salon.distance}</span>
                          </div>
                          <span className="text-xs font-bold text-[#fec4b0] bg-[#713a24]/30 px-2.5 py-1 rounded-full">
                            {salon.minPrice ? `Desde ${salon.minPrice}` : "Desde Bs 100"}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Dynamic Empty bookmarks list explanation */}
              <div className="py-4 text-center text-xs text-[#9e8d88]">
                Tap on any card to book. Favorited items will be stored securely.
              </div>
            </div>
          )}

          {/* TAB 3: CITAS (Calendar and booking configuration screen) */}
          {activeTab === "citas" && (
            <div className="px-5 pt-3 space-y-5 animate-fadeIn">
              
              {/* Heading Section */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab("explorar")}
                  className="w-10 h-10 rounded-full bg-[#201f21] border border-[#353437]/40 flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                </button>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-bold text-white tracking-tight">Reservar Cita</h2>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <p className="text-xs text-[#d5c3bd] flex items-center gap-1">
                    <span className="font-semibold text-[#fec4b0]">{selectedSalon.name}</span>
                    <span>•</span>
                    <span className="text-[#fec4b0] font-medium">Tarija VIP</span>
                  </p>
                </div>
              </div>

              {/* Service Selection Checklist with total Bs calculation */}
              <div className="flex flex-col space-y-2 bg-[#201f21]/40 border border-[#353437]/30 p-4 rounded-3xl">
                <div className="flex justify-between items-center pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#fec4b0]">
                    Servicios de la sesión
                  </span>
                  <span className="text-xs font-bold text-white">
                    {selectedServices.length} {selectedServices.length === 1 ? "selección" : "selecciones"}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedSalon.services.map((srv) => {
                    const isChecked = selectedServices.some(s => s.name === srv.name);
                    return (
                      <div 
                        key={srv.name}
                        onClick={() => handleToggleService(srv)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked 
                            ? "bg-[#713a24]/30 border-[#fec4b0]/50 text-white" 
                            : "bg-[#2a2a2c]/40 border-[#353437]/20 text-[#d5c3bd] hover:border-[#353437]/80"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span 
                            className={`material-symbols-outlined text-[18px] transition-colors ${
                              isChecked ? "text-[#fec4b0]" : "text-[#9e8d88]"
                            }`}
                            style={{ fontVariationSettings: isChecked ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {isChecked ? "check_circle" : "radio_button_unchecked"}
                          </span>
                          <span className="text-xs font-medium truncate">{srv.name}</span>
                        </div>
                        <span className="text-xs font-bold text-[#fec4b0] shrink-0">Bs {srv.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Haute-Glass Calendar Container - November 2024 */}
              <div className="w-full rounded-3xl bg-[#201f21]/70 border border-[#353437]/30 p-4 shadow-xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#fec4b0]/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => triggerToast("El calendario está fijado en Noviembre 2024 para tu reserva VIP")}
                    className="w-8 h-8 rounded-full bg-[#2a2a2c] flex items-center justify-center text-[#d5c3bd] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#fec4b0]">calendar_month</span>
                    <span className="text-sm font-bold text-white">Noviembre 2024</span>
                  </div>
                  <button 
                    onClick={() => triggerToast("El calendario está fijado en Noviembre 2024 para tu reserva VIP")}
                    className="w-8 h-8 rounded-full bg-[#2a2a2c] flex items-center justify-center text-[#d5c3bd] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>

                {/* Calendar Week Days Header */}
                <div className="grid grid-cols-7 text-center mb-2.5 text-[10px] font-bold text-[#9e8d88] tracking-widest uppercase opacity-70">
                  <div>L</div>
                  <div>M</div>
                  <div>X</div>
                  <div>J</div>
                  <div>V</div>
                  <div>S</div>
                  <div>D</div>
                </div>

                {/* Calendar Grid (Nov 1 2024 is Friday) */}
                <div className="grid grid-cols-7 gap-y-2 text-center items-center text-xs">
                  {/* Blank cells for padding (Nov 1 is Friday, so 4 empty days M, T, W, Th) */}
                  <div className="py-2"></div>
                  <div className="py-2"></div>
                  <div className="py-2"></div>
                  <div className="py-2"></div>

                  {/* Generate Days 1 to 30 */}
                  {Array.from({ length: 30 }, (_, index) => {
                    const day = index + 1;
                    const isSelected = selectedDateDay === day;
                    // Mock dots for availability
                    const hasDot = [1, 5, 7, 10, 13, 15, 17, 20, 23, 26, 29].includes(day);

                    return (
                      <button
                        key={day}
                        onClick={() => {
                          setSelectedDateDay(day);
                          triggerToast(`Fecha de reserva: ${day} de Noviembre`);
                        }}
                        className={`flex flex-col items-center justify-center h-9 w-9 mx-auto rounded-full transition-all relative ${
                          isSelected 
                            ? "bg-[#e0a996] text-[#311307] font-bold shadow-[0_4px_14px_rgba(224,169,150,0.4)] scale-105" 
                            : "text-[#e5e1e4] hover:bg-[#353437]"
                        }`}
                      >
                        <span className="font-semibold">{day}</span>
                        {/* Status dot below day number */}
                        {hasDot && (
                          <span className={`w-1 h-1 rounded-full mt-0.5 ${
                            isSelected ? "bg-[#311307]" : "bg-[#fec4b0]/60"
                          }`}></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight text-white">Horarios disponibles</h3>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#fec4b0] bg-[#fec4b0]/15 px-2.5 py-0.5 rounded-full">
                    6 cupos libres
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    "09:00 AM",
                    "10:30 AM",
                    "12:00 PM",
                    "02:30 PM",
                    "04:00 PM",
                    "05:30 PM"
                  ].map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => {
                          setSelectedTime(slot);
                          triggerToast(`Hora elegida: ${slot}`);
                        }}
                        className={`h-11 rounded-full flex flex-col items-center justify-center relative transition-all active:scale-95 ${
                          isSelected 
                            ? "bg-[#2a2a2c] text-[#fec4b0] font-bold border border-[#fec4b0]/40 shadow-[0_0_12px_rgba(224,169,150,0.25)] scale-[1.02]" 
                            : "bg-[#201f21] text-[#d5c3bd] hover:bg-[#2a2a2c] border border-[#353437]/25"
                        }`}
                      >
                        <span className="text-xs">{slot}</span>
                        {isSelected && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#fec4b0]"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Continuar to Booking Summary CTA Button */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => setActiveTab("mi-reserva")}
                  className="w-full h-13 rounded-full bg-gradient-to-r from-[#fec4b0] via-[#e0a996] to-[#ffb599] text-[#311307] font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(224,169,150,0.3)] hover:brightness-105 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Continuar</span>
                  <span className="material-symbols-outlined text-[16px] font-bold">arrow_forward</span>
                </button>
                <p className="text-center text-[10px] text-[#9e8d88]">
                  Cancelación gratuita ilimitada hasta 24 horas antes del ritual.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: MI RESERVA (Checkout summary & booking confirmation) */}
          {activeTab === "mi-reserva" && (
            <div className="animate-fadeIn">
              
              {/* Top Hero Salon visual preview */}
              <div className="relative w-full h-[250px] overflow-hidden bg-black">
                <img 
                  src={selectedSalon.coverImage || selectedSalon.image} 
                  alt={selectedSalon.name} 
                  className="w-full h-full object-cover opacity-90 scale-105"
                />
                {/* Back to change booking variables */}
                <button 
                  onClick={() => setActiveTab("citas")}
                  className="absolute top-4 left-4 w-9 h-9 rounded-full bg-[#131315]/80 backdrop-blur-md border border-[#353437]/40 flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#131315]/40 to-transparent"></div>
                
                {/* Verified badge floating */}
                <div className="absolute bottom-4 left-5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#fec4b0] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#fec4b0]">
                    Salón Verificado · Tarija
                  </span>
                </div>
              </div>

              {/* Booking Summary Floating glass card */}
              <div className="px-5 -mt-6 relative z-10 space-y-5">
                
                {/* High-fidelity summary detail box */}
                <div className="w-full rounded-3xl bg-[#201f21]/80 backdrop-blur-2xl p-5 border border-[#353437]/40 shadow-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-3">
                      <h2 className="text-lg font-bold text-white tracking-tight leading-tight truncate">
                        {selectedSalon.name}
                      </h2>
                      <div className="flex items-center gap-1 mt-1 text-[#d5c3bd] text-xs">
                        <span className="material-symbols-outlined text-[14px] text-[#fec4b0] shrink-0">location_on</span>
                        <span className="truncate">{selectedSalon.location}</span>
                      </div>
                    </div>
                    {/* Stars badge */}
                    <div className="flex items-center gap-1 bg-[#131315]/80 px-2.5 py-1 rounded-full shrink-0">
                      <span className="material-symbols-outlined text-[#fec4b0] text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold text-white">{selectedSalon.rating}</span>
                      <span className="text-[9px] text-[#d5c3bd]">({selectedSalon.reviewsCount})</span>
                    </div>
                  </div>

                  {/* List of services selection with sub prices */}
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center pb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#fec4b0]">
                        Resumen de servicios
                      </span>
                      <span className="text-[11px] text-[#d5c3bd]">
                        {selectedServices.length} selecciones
                      </span>
                    </div>

                    <div className="space-y-2">
                      {selectedServices.map((srv) => (
                        <div key={srv.name} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2 text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#fec4b0]"></span>
                            <span>{srv.name}</span>
                          </div>
                          <span className="font-semibold text-white">Bs {srv.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="h-px bg-[#353437]/45"></div>

                  {/* Date and Time pill selector */}
                  <div className="grid grid-cols-2 gap-2 bg-[#0e0e10]/80 rounded-2xl p-3">
                    <div className="flex items-center gap-2.5 px-1.5 border-r border-[#353437]/20">
                      <div className="w-7 h-7 rounded-full bg-[#713a24]/50 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#fec4b0] text-[15px]">calendar_today</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] uppercase font-bold text-[#9e8d88]">Fecha</span>
                        <span className="text-xs font-bold text-white truncate">{selectedDateDay} Nov 2024</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 px-1.5">
                      <div className="w-7 h-7 rounded-full bg-[#713a24]/50 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#fec4b0] text-[15px]">schedule</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] uppercase font-bold text-[#9e8d88]">Hora</span>
                        <span className="text-xs font-bold text-white truncate">{selectedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing break downs */}
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex justify-between text-[#d5c3bd]">
                      <span>Subtotal</span>
                      <span>Bs {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#d5c3bd]">
                      <span>Impuestos estéticos</span>
                      <span>Bs {taxes}</span>
                    </div>

                    {/* Grand total grand styling */}
                    <div className="flex justify-between items-baseline pt-1.5 border-t border-[#353437]/15">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">Total:</span>
                        <span className="text-[10px] text-[#9e8d88]">IVA incluido</span>
                      </div>
                      <span className="text-2xl font-bold text-[#fec4b0] tracking-tight">Bs {total}</span>
                    </div>
                  </div>

                </div>

                {/* Secure cancellation guarantee note */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-[#d5c3bd] opacity-90 py-1">
                  <span className="material-symbols-outlined text-[#fec4b0] text-[13px]">lock</span>
                  <span>Confirmación inmediata sin cargos de cancelación hasta 24h antes</span>
                </div>

                {/* Primary Reserva Ahora button */}
                <button
                  onClick={handleConfirmReservation}
                  className="w-full h-14 rounded-full bg-gradient-to-r from-[#fec4b0] via-[#e0a996] to-[#ffb599] text-[#311307] text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(224,169,150,0.3)] hover:brightness-105 active:scale-98 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>Reserva Ahora</span>
                </button>

                {/* List of active & past reservations */}
                <div className="space-y-3.5 pt-4">
                  <h3 className="text-sm font-bold tracking-tight text-white uppercase text-left border-b border-[#353437]/20 pb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-[#fec4b0]">receipt_long</span>
                    <span>Tus Reservas Agendadas</span>
                  </h3>

                  {confirmedBookings.length > 0 ? (
                    confirmedBookings.map((b) => (
                      <div key={b.id} className="bg-[#201f21]/40 border border-[#353437]/30 p-4 rounded-3xl space-y-3">
                        <div className="flex items-center gap-3">
                          <img src={b.salonImage} alt={b.salonName} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-white truncate">{b.salonName}</h4>
                            <p className="text-[10px] text-[#d5c3bd] truncate mt-0.5">{b.salonLocation}</p>
                            <div className="flex gap-2 items-center mt-1">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[9px]">
                                {b.status}
                              </span>
                              <span className="text-[10px] text-white/70 font-semibold">
                                {b.date} @ {b.time}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* List of services */}
                        <div className="text-[11px] text-[#d5c3bd] bg-[#0e0e10]/40 p-2 rounded-xl">
                          <span className="font-bold text-white">Servicios:</span> {b.services.map(s => s.name).join(", ")}
                        </div>

                        {/* Total and Cancel option */}
                        <div className="flex justify-between items-center text-xs pt-1">
                          <span className="text-[#9e8d88]">Total pagado: <strong className="text-white">Bs {b.total}</strong></span>
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="text-[11px] text-rose-400 font-bold hover:underline"
                          >
                            Cancelar Cita
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-[#201f21]/20 rounded-3xl border border-[#353437]/15">
                      <p className="text-xs text-[#9e8d88]">No tienes reservas activas en este momento.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </main>

        {/* Floating iOS Bottom Tab Navigator exactly matching the screenshot style and data-paths */}
        <nav className="absolute bottom-0 w-full z-50 px-5 pointer-events-none">
          <div className="pointer-events-auto h-16 w-full max-w-md mx-auto rounded-full bg-[#201f21]/80 backdrop-blur-2xl shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7)] flex items-center justify-around px-2 border border-[#353437]/45">
            
            {/* Tab: Explorar */}
            <button 
              onClick={() => {
                setActiveTab("explorar");
                triggerToast("Explora salones de alta gama en Tarija");
              }}
              className={`flex flex-col items-center justify-center w-16 h-12 transition-all cursor-pointer ${
                activeTab === "explorar" 
                  ? "text-[#fec4b0] font-bold drop-shadow-[0_0_12px_rgba(254,196,176,0.45)] scale-105" 
                  : "text-[#d5c3bd] opacity-75 hover:opacity-100"
              }`}
            >
              <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: activeTab === "explorar" ? "'FILL' 1" : "'FILL' 0" }}>explore</span>
              <span className="text-[10px] tracking-tight mt-0.5">Explorar</span>
            </button>

            {/* Tab: Destacados */}
            <button 
              onClick={() => {
                setActiveTab("destacados");
                triggerToast("Selección de más valorados y tendencias");
              }}
              className={`flex flex-col items-center justify-center w-16 h-12 transition-all cursor-pointer ${
                activeTab === "destacados" 
                  ? "text-[#fec4b0] font-bold drop-shadow-[0_0_12px_rgba(254,196,176,0.45)] scale-105" 
                  : "text-[#d5c3bd] opacity-75 hover:opacity-100"
              }`}
            >
              <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: activeTab === "destacados" ? "'FILL' 1" : "'FILL' 0" }}>auto_awesome</span>
              <span className="text-[10px] tracking-tight mt-0.5">Destacados</span>
            </button>

            {/* Tab: Citas */}
            <button 
              onClick={() => {
                setActiveTab("citas");
                triggerToast("Escoge fecha y hora de reserva");
              }}
              className={`flex flex-col items-center justify-center w-16 h-12 transition-all cursor-pointer ${
                activeTab === "citas" 
                  ? "text-[#fec4b0] font-bold drop-shadow-[0_0_12px_rgba(254,196,176,0.45)] scale-105" 
                  : "text-[#d5c3bd] opacity-75 hover:opacity-100"
              }`}
            >
              <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: activeTab === "citas" ? "'FILL' 1" : "'FILL' 0" }}>calendar_today</span>
              <span className="text-[10px] tracking-tight mt-0.5">Citas</span>
            </button>

            {/* Tab: Mi Reserva */}
            <button 
              onClick={() => {
                setActiveTab("mi-reserva");
                triggerToast("Revisa tu resumen de reserva premium");
              }}
              className={`flex flex-col items-center justify-center w-16 h-12 transition-all cursor-pointer ${
                activeTab === "mi-reserva" 
                  ? "text-[#fec4b0] font-bold drop-shadow-[0_0_12px_rgba(254,196,176,0.45)] scale-105" 
                  : "text-[#d5c3bd] opacity-75 hover:opacity-100"
              }`}
            >
              <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: activeTab === "mi-reserva" ? "'FILL' 1" : "'FILL' 0" }}>confirmation_number</span>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium">Mi Reserva</span>
            </button>

          </div>
        </nav>

        {/* Modal: SUCCESSFUL RESERVATION CONFIRMED exactly as seen in Image 3.png script block */}
        {isSuccessModalOpen && (
          <div className="absolute inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md p-6 pb-20 animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl bg-[#201f21]/95 border border-[#fec4b0]/30 p-6 flex flex-col items-center text-center gap-4 shadow-2xl transform transition-transform duration-300 scale-100">
              
              <div className="w-14 h-14 rounded-full bg-[#713a24] flex items-center justify-center text-[#fec4b0] shadow-[0_0_20px_rgba(224,169,150,0.4)] animate-pulse">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <span className="text-lg font-bold text-white tracking-tight">¡Cita Confirmada!</span>
                <p className="text-xs text-[#d5c3bd] leading-relaxed">
                  Tu experiencia en <strong className="text-white">{selectedSalon.name}</strong> está reservada para el <span className="text-[#fec4b0] font-bold">{selectedDateDay} de Noviembre</span> a las <span className="text-[#fec4b0] font-bold">{selectedTime}</span>.
                </p>
              </div>

              <button 
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setActiveTab("mi-reserva");
                  triggerToast("¡Reserva añadida con éxito!");
                }}
                className="w-full h-11 rounded-full bg-[#fec4b0] text-[#311307] text-xs font-bold uppercase tracking-wider hover:brightness-105 active:scale-95 transition-transform"
              >
                Ver en Mi Reserva
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
