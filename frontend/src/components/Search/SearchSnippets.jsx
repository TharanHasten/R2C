import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchSnippets.css';

function SearchSnippets() {
  const [tags, setTags] = useState('');
  const [snippets, setSnippets] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    // Clean and validate tags
    const cleanedTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (cleanedTags.length === 0) {
      setError('Please enter at least one tag to search');
      setSnippets([]);
      return;
    }

    // Join tags for the query and encode
    const tagsQuery = encodeURIComponent(cleanedTags.join(','));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/snippets/search?tags=${tagsQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.length === 0) {
        setError('No snippets found for the given tags');
        setSnippets([]);
      } else {
        setSnippets(response.data);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search snippets');
      setSnippets([]);
    }
  };

  return (
    <div className="search-snippets-container">
      <h2>Search Snippets</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>Tags (comma-separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., array,prime number"
          />
        </div>
        <button type="submit">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="snippet-list">
        {snippets.map((snippet) => (
          <div key={snippet._id} className="snippet-item">
            <h3>{snippet.title}</h3>
            <p>{snippet.description}</p>
            <p>Language: {snippet.language}</p>
            <p>Tags: {snippet.tags.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchSnippets;