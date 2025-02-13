import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, CalendarPlus, UserCog, User, LogOut, Users, Map } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 font-semibold text-lg">
              <Calendar className="h-6 w-6" />
              GoLucky
            </a>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/features">
              <Button variant="ghost" className="gap-2">
                Features
              </Button>
            </Link>
            <Link href="/roadmap">
              <Button variant="ghost" className="gap-2">
                <Map className="h-4 w-4" />
                Roadmap
              </Button>
            </Link>
            {user ? (
              <>
                <Link href="/app">
                  <Button variant="default" className="gap-2">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/collaborative-event">
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Plan Together
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/preferences">
                      <DropdownMenuItem className="cursor-pointer">
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Edit Preferences</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/calendars">
                      <DropdownMenuItem className="cursor-pointer">
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        <span>Edit Calendars</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button variant="default" className="gap-2">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}