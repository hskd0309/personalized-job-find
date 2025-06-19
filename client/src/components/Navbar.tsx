import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {user && <Sidebar user={user} onLogout={onLogout} />}
            <Link to="/" className="text-xl font-bold text-primary">
              CareerHub
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {!user && (
              <Link to="/auth">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}