import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      setIsLoading(true);
      const result = await signup(data.name, data.email, data.password);
      
      if (result.success) {
        navigate('/create-workspace');
      } else {
        setError(result.error);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2F3136]">
      <div className="bg-[#1E1F22] p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-white mb-4">Sign Up</h1>
        {error && (
          <div className="mb-4 p-2 bg-red-500/10 border border-red-500 rounded text-red-500">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-white mb-2">Name</label>
            <input 
              {...register('name')} 
              type="text" 
              className="w-full p-2 rounded bg-[#2F3136] text-white border border-[#40444B] focus:border-[#0056F2] focus:outline-none" 
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Email</label>
            <input 
              {...register('email')} 
              type="email" 
              className="w-full p-2 rounded bg-[#2F3136] text-white border border-[#40444B] focus:border-[#0056F2] focus:outline-none" 
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Password</label>
            <input 
              {...register('password')} 
              type="password" 
              className="w-full p-2 rounded bg-[#2F3136] text-white border border-[#40444B] focus:border-[#0056F2] focus:outline-none" 
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#0056F2] text-white p-2 rounded hover:bg-[#0047CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0056F2] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup; 