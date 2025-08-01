import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { Mail, UserCircle2, KeyRound } from 'lucide-react';

const Account = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      {user ? (
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl flex items-center p-6 space-x-6 border border-gray-100 dark:border-gray-700">
          {/* Profile Picture Placeholder */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <UserCircle2 className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.full_name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Welcome to your dashboard</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Member since:{' '}
              <span className="text-gray-700 dark:text-gray-300">
                {format(new Date(user.created_at), 'MMMM yyyy')}
              </span>
            </p>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-600" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <UserCircle2 className="w-4 h-4 text-green-600" />
                <span>{user.username}</span>
              </div>
            </div>

            <div className="mt-4">
              <button className="inline-flex items-center text-green-600 text-sm font-medium hover:underline">
                <KeyRound className="w-4 h-4 mr-1" />
                Reset Password
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">Loading user info...</p>
      )}
    </div>
  );
};

export default Account;
