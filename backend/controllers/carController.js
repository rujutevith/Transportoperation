const db = require('../config/db');
const store = require('../config/store');

// GET all cars with multi-parameter filtering & sorting
exports.getAllCars = async (req, res) => {
  try {
    const {
      listing_type, // 'sale', 'rent', 'both'
      category,     // 'suv', 'sedan', 'luxury', 'electric', 'sports', 'pickup'
      brand,
      model,
      fuel_type,
      transmission,
      price_min,
      price_max,
      year_min,
      year_max,
      search,
      sort,
      status
    } = req.query;

    let cars = [];

    try {
      let sql = 'SELECT * FROM cars WHERE 1=1';
      const params = [];

      if (status) {
        sql += ' AND status = ?';
        params.push(status);
      }

      if (brand) {
        sql += ' AND LOWER(brand) LIKE ?';
        params.push(`%${brand.toLowerCase()}%`);
      }

      if (category) {
        sql += ' AND category = ?';
        params.push(category);
      }

      if (listing_type && listing_type !== 'all') {
        sql += ' AND (listing_type = ? OR listing_type = "both")';
        params.push(listing_type);
      }

      sql += ' ORDER BY created_at DESC';

      const [rows] = await db.query(sql, params);
      if (rows && rows.length > 0) {
        cars = rows;
      }
    } catch (dbErr) {
      // Fallback to store
    }

    if (!cars || cars.length === 0) {
      cars = [...store.cars];
    }

    // Apply unified filtering across in-memory / results
    let filtered = cars.filter(c => {
      // Listing type filter
      if (listing_type && listing_type !== 'all') {
        if (c.listing_type !== 'both' && c.listing_type !== listing_type) {
          return false;
        }
      }

      // Category filter
      if (category && category !== 'all') {
        if (c.category?.toLowerCase() !== category.toLowerCase()) {
          return false;
        }
      }

      // Brand filter
      if (brand && brand !== 'all') {
        if (!c.brand.toLowerCase().includes(brand.toLowerCase())) {
          return false;
        }
      }

      // Fuel type
      if (fuel_type && fuel_type !== 'all') {
        if (!c.fuel_type?.toLowerCase().includes(fuel_type.toLowerCase())) {
          return false;
        }
      }

      // Transmission
      if (transmission && transmission !== 'all') {
        if (!c.transmission?.toLowerCase().includes(transmission.toLowerCase())) {
          return false;
        }
      }

      // Price range filter: checks sale_price if sale, else daily price
      const priceToCheck = (listing_type === 'sale' && c.sale_price) ? c.sale_price : (c.daily_rental_rate || c.price);
      if (price_min && priceToCheck < Number(price_min)) return false;
      if (price_max && priceToCheck > Number(price_max)) return false;

      // Year range
      if (year_min && c.year < Number(year_min)) return false;
      if (year_max && c.year > Number(year_max)) return false;

      // Search query
      if (search) {
        const q = search.toLowerCase();
        const matches = 
          c.brand?.toLowerCase().includes(q) ||
          c.model?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });

    // Sorting
    if (sort === 'price_asc') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'year_desc') {
      filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else {
      // Newest
      filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    res.json({
      success: true,
      count: filtered.length,
      cars: filtered
    });
  } catch (error) {
    console.error('Error in getAllCars:', error);
    res.status(500).json({ success: false, error: 'Internal server error', cars: store.cars });
  }
};

// GET car by ID
exports.getCarById = async (req, res) => {
  const { id } = req.params;
  const numId = Number(id);

  try {
    let car = null;
    try {
      const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [id]);
      if (rows && rows.length > 0) {
        car = rows[0];
      }
    } catch (e) {
      // Use fallback
    }

    if (!car) {
      car = store.cars.find(c => c.id === numId || String(c.id) === String(id));
    }

    if (!car) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }

    // Get reviews for this car
    const carReviews = store.reviews.filter(r => r.car_id === numId);

    // Get similar vehicles in same category
    const similar = store.cars
      .filter(c => c.id !== numId && (c.category === car.category || c.brand === car.brand))
      .slice(0, 3);

    res.json({
      success: true,
      car,
      reviews: carReviews,
      similar
    });
  } catch (error) {
    console.error('Error in getCarById:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch car details' });
  }
};

// CREATE car (Dealer / Admin)
exports.createCar = async (req, res) => {
  const {
    brand,
    model,
    year,
    price,
    daily_rental_rate,
    weekly_rental_rate,
    sale_price,
    listing_type = 'both',
    category = 'luxury',
    color,
    fuel_type,
    transmission,
    mileage,
    seats = 5,
    engine_specs,
    image_url,
    description,
    features,
    location = 'Bugesera, Nyamata, Rwanda'
  } = req.body;

  if (!brand || !model || !year || !image_url) {
    return res.status(400).json({ success: false, error: 'Brand, model, year, and image URL are required' });
  }

  const newCar = {
    id: Date.now(),
    brand,
    model,
    year: Number(year),
    price: Number(price || daily_rental_rate || 100),
    daily_rental_rate: Number(daily_rental_rate || price || 100),
    weekly_rental_rate: Number(weekly_rental_rate || (price ? price * 6 : 600)),
    sale_price: sale_price ? Number(sale_price) : 0,
    listing_type,
    category,
    color: color || 'Black',
    fuel_type: fuel_type || 'Petrol',
    transmission: transmission || 'Automatic',
    mileage: Number(mileage || 0),
    seats: Number(seats || 5),
    engine_specs: engine_specs || 'Standard Engine',
    rating: 5.0,
    reviews_count: 0,
    image_url,
    description: description || `${year} ${brand} ${model} available at EliteRent.`,
    features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : ["Air Conditioning", "Bluetooth", "Power Steering"]),
    location,
    status: 'available',
    owner_id: req.user?.id || 1,
    is_approved: true,
    created_at: new Date().toISOString()
  };

  try {
    const [result] = await db.query(
      `INSERT INTO cars (brand, model, year, price, daily_rental_rate, weekly_rental_rate, sale_price, 
       listing_type, category, color, fuel_type, transmission, mileage, seats, engine_specs, image_url, description, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newCar.brand, newCar.model, newCar.year, newCar.price, newCar.daily_rental_rate, newCar.weekly_rental_rate,
       newCar.sale_price, newCar.listing_type, newCar.category, newCar.color, newCar.fuel_type, newCar.transmission,
       newCar.mileage, newCar.seats, newCar.engine_specs, newCar.image_url, newCar.description, newCar.location]
    );
    newCar.id = result.insertId;
  } catch (err) {
    console.warn('DB create car fallback to store:', err.message);
  }

  store.cars.unshift(newCar);
  res.status(201).json({ success: true, message: 'Vehicle listed successfully', car: newCar });
};

// UPDATE car
exports.updateCar = async (req, res) => {
  const { id } = req.params;
  const numId = Number(id);

  try {
    const updates = req.body;
    try {
      await db.query(
        `UPDATE cars SET brand = COALESCE(?, brand), model = COALESCE(?, model), price = COALESCE(?, price),
         status = COALESCE(?, status), image_url = COALESCE(?, image_url) WHERE id = ?`,
        [updates.brand, updates.model, updates.price, updates.status, updates.image_url, id]
      );
    } catch (e) {
      // Store fallback
    }

    const car = store.cars.find(c => c.id === numId || String(c.id) === String(id));
    if (car) {
      Object.assign(car, updates);
    }

    res.json({ success: true, message: 'Vehicle updated successfully', car });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update vehicle' });
  }
};

// DELETE car
exports.deleteCar = async (req, res) => {
  const { id } = req.params;
  const numId = Number(id);

  try {
    try {
      await db.query('DELETE FROM cars WHERE id = ?', [id]);
    } catch (e) {
      // Store fallback
    }

    const index = store.cars.findIndex(c => c.id === numId || String(c.id) === String(id));
    if (index !== -1) {
      store.cars.splice(index, 1);
    }

    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete vehicle' });
  }
};