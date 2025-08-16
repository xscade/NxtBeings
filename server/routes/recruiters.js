import express from 'express';
import Recruiter from '../models/Recruiter.js';

const router = express.Router();

// Get recruiter profile
router.get('/:id', async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id)
      .select('-password')
      .populate('jobPostings')
      .populate('teamMembers.recruiterId');
    
    if (!recruiter) {
      return res.status(404).json({ error: 'Recruiter not found' });
    }
    
    res.json(recruiter);
  } catch (error) {
    console.error('Error fetching recruiter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update recruiter profile
router.put('/:id', async (req, res) => {
  try {
    const recruiter = await Recruiter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!recruiter) {
      return res.status(404).json({ error: 'Recruiter not found' });
    }
    
    res.json(recruiter);
  } catch (error) {
    console.error('Error updating recruiter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
