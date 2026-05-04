const express = require('express');
const router = express.Router();
const {
  createSnippet,
  getMySnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  searchSnippets,
  getAllPublicSnippets,
} = require('../controllers/snippetController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', getAllPublicSnippets);


router.get('/my-snippets', authMiddleware, getMySnippets);


router.get('/search2', searchSnippets); 
router.get('/search', authMiddleware, searchSnippets); 


router.post('/', authMiddleware, createSnippet);
router.get('/:id', authMiddleware, getSnippetById);
router.put('/:id', authMiddleware, updateSnippet);
router.delete('/:id', authMiddleware, deleteSnippet);

module.exports = router;