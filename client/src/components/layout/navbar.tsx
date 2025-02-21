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

          <div className="flex items-center gap-0 -space-x-2">
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
          </div>
        </div>
      </div>
    </nav>
  );
}