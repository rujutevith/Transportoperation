import api from '../config/axios';

export const carService = {
  getAll: (params) => api.get('/api/cars', { params }),
  getById: (id) => api.get(`/api/cars/${id}`),
  create: (data) => api.post('/api/cars', data),
  update: (id, data) => api.put(`/api/cars/${id}`, data),
  delete: (id) => api.delete(`/api/cars/${id}`)
};

export const rentalService = {
  getMyRentals: () => api.get('/api/rentals/my-rentals'),
  book: (data) => api.post('/api/rentals/rent', data),
  cancel: (id) => api.put(`/api/rentals/cancel/${id}`),
  getAllRentals: () => api.get('/api/rentals/all-rentals'),
  updateStatus: (id, status) => api.put(`/api/rentals/update-status/${id}`, { status }),
  getCustomers: () => api.get('/api/rentals/customers')
};

export const salesService = {
  submitInquiry: (data) => api.post('/api/sales/inquiry', data),
  scheduleTestDrive: (data) => api.post('/api/sales/test-drive', data),
  getMyPurchases: () => api.get('/api/sales/my-purchases'),
  getAllOrders: () => api.get('/api/sales/all-orders'),
  updateOrderStatus: (id, data) => api.put(`/api/sales/order-status/${id}`, data),
  calculateFinancing: (data) => api.post('/api/sales/calculate-financing', data)
};

export const wishlistService = {
  getWishlist: () => api.get('/api/wishlist'),
  toggle: (carId) => api.post(`/api/wishlist/toggle/${carId}`)
};

export const verificationService = {
  getStatus: () => api.get('/api/verification/status'),
  upload: (data) => api.post('/api/verification/upload', data),
  getAll: () => api.get('/api/verification/all'),
  review: (id, data) => api.put(`/api/verification/review/${id}`, data)
};

export const messageService = {
  getConversations: () => api.get('/api/messages/conversations'),
  getThread: (targetUserId) => api.get(`/api/messages/thread/${targetUserId}`),
  send: (data) => api.post('/api/messages/send', data)
};

export const reviewService = {
  getCarReviews: (carId) => api.get(`/api/reviews/car/${carId}`),
  submit: (data) => api.post('/api/reviews', data)
};

export const dealerService = {
  apply: (data) => api.post('/api/dealer/apply', data),
  getDashboard: () => api.get('/api/dealer/dashboard'),
  getListings: () => api.get('/api/dealer/listings'),
  getCalendar: (carId) => api.get(`/api/dealer/calendar/${carId}`),
  toggleBlockDate: (data) => api.post('/api/dealer/calendar/toggle-block', data)
};

export const adminService = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/api/admin/users/${id}/role`, { role }),
  getModerationListings: () => api.get('/api/admin/listings/moderation'),
  approveListing: (id, is_approved) => api.put(`/api/admin/listings/${id}/approve`, { is_approved }),
  getFinancials: () => api.get('/api/admin/financials')
};

export const contactService = {
  submit: (data) => api.post('/api/contact/submit', data),
  newsletter: (email) => api.post('/api/contact/newsletter', { email })
};
