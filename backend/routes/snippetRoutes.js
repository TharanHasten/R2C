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

// Debug middleware import
console.log('Imported authMiddleware:', typeof authMiddleware);
console.log('Imported handlers:', {
  createSnippet: typeof createSnippet,
  getMySnippets: typeof getMySnippets,
  getSnippetById: typeof getSnippetById,
  updateSnippet: typeof updateSnippet,
  deleteSnippet: typeof deleteSnippet,
  searchSnippets: typeof searchSnippets,
  getAllPublicSnippets: typeof getAllPublicSnippets,
});

// Public route to get all public snippets (no authentication)
router.get('/', getAllPublicSnippets);

// Authenticated route to get user's snippets
router.get('/my-snippets', authMiddleware, getMySnippets);

// Public and authenticated search routes
router.get('/search2', searchSnippets); // Public search for Collection page
router.get('/search', authMiddleware, searchSnippets); // Authenticated search

// Authenticated routes for snippet CRUD
router.post('/', authMiddleware, createSnippet);
router.get('/:id', authMiddleware, getSnippetById);
router.put('/:id', authMiddleware, updateSnippet);
router.delete('/:id', authMiddleware, deleteSnippet);

module.exports = router;