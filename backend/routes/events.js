const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Create Event
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('ticketLimit').isInt({ min: 1 }).withMessage('Ticket limit must be at least 1'),
  body('approvalMode').isIn(['auto', 'manual']).withMessage('Approval mode must be auto or manual')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, venue, ticketLimit, approvalMode } = req.body;

    const event = new Event({
      title,
      description,
      date,
      venue,
      ticketLimit,
      approvalMode,
      organizer: req.userId
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events for organizer
router.get('/my-events', auth, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.userId }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get registrations for an event
router.get('/:id/registrations', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({ event: req.params.id }).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
