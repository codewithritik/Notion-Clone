import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePages } from '../../contexts/PageContext';

const PageItem = ({ page, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const { deletePage } = usePages();

  const handleClick = () => {
    navigate(`/page/${page._id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await deletePage(page._id);
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    }
  };

  return (
    <div>
      <div
        className={`flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer ${
          level > 0 ? 'ml-' + (level * 4) : ''
        }`}
        onClick={handleClick}
      >
        {page.children?.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mr-1 text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        <span className="flex-grow">{page.title}</span>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100"
        >
          ×
        </button>
      </div>
      {isExpanded && page.children?.length > 0 && (
        <div className="ml-4">
          {page.children.map((child) => (
            <PageItem key={child._id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const { pages, loading, createPage } = usePages();
  const [newPageTitle, setNewPageTitle] = useState('');

  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    try {
      await createPage(newPageTitle);
      setNewPageTitle('');
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleCreatePage} className="flex gap-2">
          <input
            type="text"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            placeholder="New page title"
            className="flex-grow px-2 py-1 border rounded"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Add
          </button>
        </form>
      </div>
      <div className="flex-grow overflow-y-auto">
        {pages.map((page) => (
          <PageItem key={page._id} page={page} />
        ))}
      </div>
    </div>
  );
} 