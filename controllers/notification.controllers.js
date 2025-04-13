const { Notification } = require('../models/notificationModel');
const { Case } = require('../models/caseModel');
const { Prisioner } = require('../models/prisionerModels');

/**
 * Format a date to readable string format
 * @param {Date} date - Date to format
 * @returns {String} Formatted date string
 */
const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Create a new notification
 * @route POST /api/notifications
 */
const createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();

        res.status(201).json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create notification',
            error: error.message
        });
    }
};

/**
 * Get all notifications for a user
 * @route GET /api/notifications
 */
const getUserNotifications = async (req, res) => {
    try {
        const { userId, userType } = req.user;

        const notifications = await Notification.find({
            recipient: userId,
            recipientModel: userType
        })
        .populate({
            path: 'sender',
            select: 'name profileImage',
        })
        .populate({
            path: 'relatedCase',
            select: 'cnr_number registration_number filing_date status'
        })
        .sort({ createdAt: -1 });
        
        // Format dates before sending to frontend
        const formattedNotifications = notifications.map(notification => {
            return {
                ...notification._doc,
                createdAt: formatDate(notification.createdAt),
                createdAtRaw: notification.createdAt,
                updatedAt: formatDate(notification.updatedAt),
                updatedAtRaw: notification.updatedAt,
                relatedCase: notification.relatedCase ? {
                    ...notification.relatedCase._doc,
                    filing_date: formatDate(notification.relatedCase.filing_date),
                    filing_date_raw: notification.relatedCase.filing_date
                } : null
            };
        });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications: formattedNotifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message
        });
    }
};

/**
 * Mark notification as read
 * @route PATCH /api/notifications/:id/read
 */
const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const notification = await Notification.findById(id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Check if the notification belongs to the requesting user
        if (notification.recipient.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this notification'
            });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read',
            error: error.message
        });
    }
};

/**
 * Mark all notifications as read
 * @route PATCH /api/notifications/mark-all-read
 */
const markAllNotificationsAsRead = async (req, res) => {
    try {
        const { userId, userType } = req.user;

        const result = await Notification.updateMany(
            { 
                recipient: userId,
                recipientModel: userType,
                isRead: false
            },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: `Marked ${result.modifiedCount} notifications as read`
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark all notifications as read',
            error: error.message
        });
    }
};

/**
 * Delete a notification
 * @route DELETE /api/notifications/:id
 */
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const notification = await Notification.findById(id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Check if the notification belongs to the requesting user
        if (notification.recipient.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this notification'
            });
        }

        await notification.remove();

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification',
            error: error.message
        });
    }
};

/**
 * Create case status change notification for a prisoner
 * @route POST /api/notifications/case-status-change
 */
const createCaseStatusChangeNotification = async (req, res) => {
    try {
        const { caseId, newStatus, message } = req.body;
        const { userId } = req.user;

        // Find the case
        const caseData = await Case.findById(caseId);
        if (!caseData) {
            return res.status(404).json({
                success: false,
                message: 'Case not found'
            });
        }

        // Find the prisoner associated with the case
        const prisoner = await Prisioner.findOne({
            cases: { $elemMatch: { $eq: caseId } }
        });

        if (!prisoner) {
            return res.status(404).json({
                success: false,
                message: 'Prisoner associated with this case not found'
            });
        }

        // Create notification
        const notification = new Notification({
            recipient: prisoner._id,
            recipientModel: 'prisoner',
            sender: userId,
            senderModel: 'governor',
            type: 'CASE_STATUS_CHANGE',
            title: `Case Status Updated to ${newStatus}`,
            message: message || `Your case (${caseData.cnr_number}) status has been updated to ${newStatus}`,
            relatedCase: caseId
        });

        await notification.save();

        // Update case status
        caseData.status = newStatus;
        await caseData.save();

        res.status(201).json({
            success: true,
            message: 'Case status updated and notification sent',
            notification
        });
    } catch (error) {
        console.error('Error creating case status notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create case status notification',
            error: error.message
        });
    }
};

/**
 * Create hearing date update notification for a prisoner
 * @route POST /api/notifications/hearing-date-update
 */
const createHearingDateNotification = async (req, res) => {
    try {
        const { caseId, hearingDate, message } = req.body;
        const { userId } = req.user;

        // Find the case
        const caseData = await Case.findById(caseId);
        if (!caseData) {
            return res.status(404).json({
                success: false,
                message: 'Case not found'
            });
        }

        // Find the prisoner associated with the case
        const prisoner = await Prisioner.findOne({
            cases: { $elemMatch: { $eq: caseId } }
        });

        if (!prisoner) {
            return res.status(404).json({
                success: false,
                message: 'Prisoner associated with this case not found'
            });
        }

        // Format the hearing date
        const formattedDate = formatDate(new Date(hearingDate));

        // Create notification
        const notification = new Notification({
            recipient: prisoner._id,
            recipientModel: 'prisoner',
            sender: userId,
            senderModel: 'governor',
            type: 'HEARING_DATE',
            title: `Hearing Date Set: ${formattedDate}`,
            message: message || `A new hearing date has been set for your case (${caseData.cnr_number}): ${formattedDate}`,
            relatedCase: caseId
        });

        await notification.save();

        // Update case next hearing date
        if (caseData.cnr_details && caseData.cnr_details.case_status) {
            caseData.cnr_details.case_status.next_hearing_date = hearingDate;
        } else {
            caseData.next_hearing_date = hearingDate;
        }
        await caseData.save();

        res.status(201).json({
            success: true,
            message: 'Hearing date updated and notification sent',
            notification
        });
    } catch (error) {
        console.error('Error creating hearing date notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create hearing date notification',
            error: error.message
        });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    createCaseStatusChangeNotification,
    createHearingDateNotification
};
