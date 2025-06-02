const Snippet = require('../models/Snippet');

const createSnippet = async (req, res) => {
  try {
    const { title, code, language, tags, description, isPublic } = req.body;

    // Manual validation
    if (!title || title.length > 100) {
      return res.status(400).json({ message: 'Title is required and must be 100 characters or less' });
    }
    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }
    if (!language) {
      return res.status(400).json({ message: 'Language is required' });
    }
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array' });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ message: 'Description must be 500 characters or less' });
    }
    if (isPublic !== undefined && typeof isPublic !== 'boolean') {
      return res.status(400).json({ message: 'isPublic must be a boolean' });
    }

    const snippet = new Snippet({
      title,
      code,
      language,
      tags: tags || [],
      description: description || '',
      userId: req.user.id,
      isPublic: isPublic || false,
    });
    await snippet.save();
    res.status(201).json(snippet);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Create snippet error:`, error);
    res.status(400).json({ message: 'Server error' });
  }
};

const getMySnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({ userId: req.user.id });
    res.json(snippets);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Get my snippets error:`, error);
    res.status(400).json({ message: 'Server error' });
  }
};

const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet || (snippet.userId.toString() !== req.user?.id && !snippet.isPublic)) {
      return res.status(404).json({ message: 'Snippet not found or unauthorized' });
    }
    res.json(snippet);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Get snippet by ID error:`, error);
    res.status(400).json({ message: 'Server error' });
  }
};

const updateSnippet = async (req, res) => {
  try {
    const { title, code, language, tags, description, isPublic } = req.body;

    // Manual validation
    if (title && (title.length === 0 || title.length > 100)) {
      return res.status(400).json({ message: 'Title cannot be empty and must be 100 characters or less' });
    }
    if (code && code.length === 0) {
      return res.status(400).json({ message: 'Code cannot be empty' });
    }
    if (language && language.length === 0) {
      return res.status(400).json({ message: 'Language cannot be empty' });
    }
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array' });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ message: 'Description must be 500 characters or less' });
    }
    if (isPublic !== undefined && typeof isPublic !== 'boolean') {
      return res.status(400).json({ message: 'isPublic must be a boolean' });
    }

    const snippet = await Snippet.findById(req.params.id);
    if (!snippet || snippet.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Snippet not found or unauthorized' });
    }
    Object.assign(snippet, req.body);
    await snippet.save();
    res.json(snippet);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Update snippet error:`, error);
    res.status(400).json({ message: 'Server error' });
  }
};

const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet || snippet.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Snippet not found or unauthorized' });
    }
    await snippet.deleteOne();
    res.json({ message: 'Snippet deleted' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Delete snippet error:`, error);
    res.status(400).json({ message: 'Server error' });
  }
};

const searchSnippets = async (req, res) => {
  try {
    const { tags } = req.query;

    // Manual validation
    if (!tags || tags.trim() === '') {
      return res.status(400).json({ message: 'Tags parameter is required' });
    }

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    if (tagArray.length === 0) {
      return res.status(400).json({ message: 'At least one valid tag is required' });
    }

    const query = { tags: { $in: tagArray } };
    if (req.user) {
      query.userId = req.user.id;
    } else {
      query.isPublic = true;
    }

    const snippets = await Snippet.find(query).select('_id title description language tags code isPublic');
    res.json(snippets);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Search snippets error:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllPublicSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({ isPublic: true }).select('_id title description language tags code isPublic');
    res.status(200).json(snippets);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Get public snippets error:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createSnippet,
  getMySnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  searchSnippets,
  getAllPublicSnippets,
};