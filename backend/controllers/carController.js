const db = require('../config/db');

exports.getAllCars = (req, res) => {
  const query = 'SELECT * FROM cars ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

exports.getCarById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM cars WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(results[0]);
  });
};

exports.createCar = (req, res) => {
  const { brand, model, year, price, color, fuel_type, transmission, mileage, image_url } = req.body;
  
  const query = `INSERT INTO cars (brand, model, year, price, color, fuel_type, transmission, mileage, image_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [brand, model, year, price, color, fuel_type, transmission, mileage, image_url], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: result.insertId, message: 'Car created successfully' });
  });
};

exports.updateCar = (req, res) => {
  const { id } = req.params;
  const { brand, model, year, price, color, fuel_type, transmission, mileage, image_url } = req.body;
  
  const query = `UPDATE cars SET brand = ?, model = ?, year = ?, price = ?, color = ?, 
                 fuel_type = ?, transmission = ?, mileage = ?, image_url = ? WHERE id = ?`;
  
  db.query(query, [brand, model, year, price, color, fuel_type, transmission, mileage, image_url, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json({ message: 'Car updated successfully' });
  });
};

exports.deleteCar = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM cars WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  });
};