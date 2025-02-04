import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Settings } from "lucide-react";

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
            <Link href="/preferences">
              <Button variant="ghost" className="gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
