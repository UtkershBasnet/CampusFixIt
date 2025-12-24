const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Issue = require('../models/Issue');

// @route   POST api/issues
// @desc    Create a new issue
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, category, imageUrl } = req.body;

  try {
    const newIssue = new Issue({
      title,
      description,
      category,
      imageUrl,
      userId: req.user.id,
    });

    const issue = await newIssue.save();
    res.json(issue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/issues
// @desc    Get all issues (admin sees all, student sees theirs)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let issues;
    if (req.user.role === 'admin') {
      issues = await Issue.find().populate('userId', 'name email');
    } else {
      issues = await Issue.find({ userId: req.user.id }).populate('userId', 'name email');
    }
    res.json(issues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/issues/:id
// @desc    Update issue status (Admin only)
// @access  Private/Admin
router.patch('/:id', auth, async (req, res) => {
  const { status } = req.body;

  try {
     // Check if user is admin
     if (req.user.role !== 'admin') {
         return res.status(403).json({ msg: 'Access denied: Admins only' });
     }

    let issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });

    issue.status = status;
    await issue.save();

    res.json(issue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
