import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { FileQuestion, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { role } = useAuth();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 mb-6">
        The requested URL path does not exist in the Smart Academic Platform routing directory.
      </p>
      <Link to={`/${role}`}>
        <Button size="sm" leftIcon={<Home className="w-4 h-4" />}>
          Return to {role.toUpperCase()} Dashboard
        </Button>
      </Link>
    </div>
  );
};
