import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, CalendarPlus, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

          <div className="flex items-center gap-4">
            <Link href="/features">
              <Button variant="ghost" className="gap-2">
                Features
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="default" className="gap-2">
                Go to App
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
