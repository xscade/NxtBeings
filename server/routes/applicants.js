import express from 'express';
import Applicant from '../models/Applicant.js';

const router = express.Router();

// Get applicant profile
router.get('/:id', async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id)
      .select('-password')
      .populate('workExperience')
      .populate('education')
      .populate('projects');
    
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    
    res.json(applicant);
  } catch (error) {
    console.error('Error fetching applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update applicant profile
router.put('/:id', async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    
    res.json(applicant);
  } catch (error) {
    console.error('Error updating applicant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
