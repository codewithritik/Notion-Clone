import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PageProvider } from './contexts/PageContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/pages/Sidebar';
import PageEditor from './components/pages/PageEditor';

function App() {
  return (
    // <Router>
    //   <AuthProvider>
    //     <PageProvider>
    //       <Routes>
    //         <Route path="/login" element={<Login />} />
    //         <Route path="/register" element={<Register />} />
    //         <Route
    //           path="/"
    //           element={
    //             <ProtectedRoute>
    //               <div className="flex h-screen">
    //                 <Sidebar />
    //                 <div className="flex-grow">
    //                   <div className="p-4 text-center text-gray-500">
    //                     Select a page or create a new one
    //                   </div>
    //                 </div>
    //               </div>
    //             </ProtectedRoute>
    //           }
    //         />
    //         <Route
    //           path="/page/:id"
    //           element={
    //             <ProtectedRoute>
    //               <div className="flex h-screen">
    //                 <Sidebar />
    //                 <PageEditor />
    //               </div>
    //             </ProtectedRoute>
    //           }
    //         />
    //         <Route path="*" element={<Navigate to="/" replace />} />
    //       </Routes>
    //     </PageProvider>
    //   </AuthProvider>
    // </Router>
    <div>
        nkjnknkn
    </div>
  );
}

export default App; 