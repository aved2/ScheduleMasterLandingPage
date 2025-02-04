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
              Smart Calendar
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
                <DropdownMenuItem className="cursor-pointer" onSelect={() => window.open("/auth/google", "_blank")}>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  <span>Connect Google Calendar</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onSelect={() => window.open("/auth/outlook", "_blank")}>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  <span>Connect Outlook</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onSelect={() => window.open("/auth/apple", "_blank")}>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  <span>Connect Apple Calendar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
