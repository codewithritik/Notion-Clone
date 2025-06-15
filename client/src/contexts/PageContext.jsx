import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const PageContext = createContext(null);

export const PageProvider = ({ children }) => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all pages
  const fetchPages = async () => {
    try {
      const response = await axios.get('/api/pages');
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new page
  const createPage = async (title, content = '', parentId = null) => {
    try {
      const response = await axios.post('/api/pages', {
        title,
        content,
        parentId
      });
      await fetchPages();
      return response.data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  };

  // Update a page
  const updatePage = async (id, updates) => {
    try {
      const response = await axios.put(`/api/pages/${id}`, updates);
      await fetchPages();
      return response.data;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  };

  // Delete a page
  const deletePage = async (id) => {
    try {
      await axios.delete(`/api/pages/${id}`);
      await fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  };

  // Fetch a single page
  const fetchPage = async (id) => {
    try {
      const response = await axios.get(`/api/pages/${id}`);
      setCurrentPage(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  };

  // Fetch pages when user is authenticated
  useEffect(() => {
    if (user) {
      fetchPages();
    }
  }, [user]);

  return (
    <PageContext.Provider
      value={{
        pages,
        currentPage,
        loading,
        createPage,
        updatePage,
        deletePage,
        fetchPage,
        fetchPages
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePages = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePages must be used within a PageProvider');
  }
  return context;
}; 