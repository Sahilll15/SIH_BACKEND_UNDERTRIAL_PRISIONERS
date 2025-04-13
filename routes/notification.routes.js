const express = require('express');
const router = express.Router();
const { 
    createNotification, 
    getUserNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification,
    createCaseStatusChangeNotification,
    createHearingDateNotification
} = require('../controllers/notification.controllers');
const { validateToken } = require('../middlewares/validateToken');

// Base route: /api/notifications/
router.post('/', validateToken, createNotification);
router.get('/', validateToken, getUserNotifications);
router.patch('/mark-all-read', validateToken, markAllNotificationsAsRead);
router.patch('/:id/read', validateToken, markNotificationAsRead);
router.delete('/:id', validateToken, deleteNotification);

// Governor-specific routes
router.post('/case-status-change', validateToken, createCaseStatusChangeNotification);
router.post('/hearing-date-update', validateToken, createHearingDateNotification);

module.exports = router;
