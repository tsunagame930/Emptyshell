import { Bell } from "lucide-react";
import { getCurrentOpticien } from "@/lib/auth";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const opticien = getCurrentOpticien();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {opticien ? `${opticien.nom[0]}${opticien.prenom[0]}` : 'OP'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {opticien ? `${opticien.prenom} ${opticien.nom}` : 'Opticien'}
                </p>
                <p className="text-xs text-gray-500">Opticien Lunetier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
