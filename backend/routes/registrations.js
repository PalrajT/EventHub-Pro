const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Create Registration (Public)
router.post('/', [
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, name, email, phone } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if ticket limit is reached
    if (event.approvedCount >= event.ticketLimit) {
      return res.status(400).json({ message: 'Event is full, no more tickets available' });
    }

    // Check if user already registered for this event
    const existingRegistration = await Registration.findOne({ event: eventId, email });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }

    // Create registration
    const registration = new Registration({
      event: eventId,
      name,
      email,
      phone,
      status: event.approvalMode === 'auto' ? 'approved' : 'pending'
    });

    await registration.save();

    // If auto-approved, increment approved count
    if (event.approvalMode === 'auto') {
      event.approvedCount += 1;
      await event.save();
    }

    res.status(201).json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Registration Status (Organizer only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const registration = await Registration.findById(req.params.id).populate('event');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if user is the organizer
    if (registration.event.organizer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if already processed
    if (registration.status !== 'pending') {
      return res.status(400).json({ message: 'Registration already processed' });
    }

    // If approving, check ticket limit
    if (status === 'approved') {
      const event = registration.event;
      if (event.approvedCount >= event.ticketLimit) {
        return res.status(400).json({ message: 'Event is full, cannot approve more registrations' });
      }
      
      event.approvedCount += 1;
      await event.save();
    }

    registration.status = status;
    await registration.save();

    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ticket by ID (Public)
router.get('/ticket/:ticketId', async (req, res) => {
  try {
    const registration = await Registration.findOne({ ticketId: req.params.ticketId })
      .populate('event', 'title description date venue');
    
    if (!registration) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (registration.status !== 'approved') {
      return res.status(400).json({ message: 'Ticket is not approved yet' });
    }

    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check registration status by email and event
router.get('/check/:eventId/:email', async (req, res) => {
  try {
    const registration = await Registration.findOne({ 
      event: req.params.eventId, 
      email: req.params.email 
    }).populate('event', 'title description date venue');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
