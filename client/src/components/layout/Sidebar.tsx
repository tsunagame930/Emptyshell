import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  PiggyBank, 
  CreditCard, 
  Truck, 
  Package, 
  User, 
  LogOut,
  Glasses 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Demandes clients", href: "/demandes", icon: FileText, badge: "3" },
  { name: "Cagnottes optiques", href: "/cagnottes", icon: PiggyBank, badge: null },
  { name: "Paiements", href: "/paiements", icon: CreditCard, badge: null },
  { name: "Livraisons", href: "/livraisons", icon: Truck, badge: "5" },
  { name: "Stock produits", href: "/produits", icon: Package, badge: null },
];

export default function Sidebar() {
  const [location] = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      {/* Logo Header */}
      <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Glasses className="w-4 h-4 text-white" />
          </div>
          <span className="ml-3 text-xl font-semibold text-gray-900">Emptyshell</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 text-sm",
                      isActive
                        ? "text-primary"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                    size={16}
                  />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </div>

        {/* Profile Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href="/profil">
            <a
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg",
                location === "/profil"
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <User
                className={cn(
                  "mr-3 text-sm",
                  location === "/profil"
                    ? "text-primary"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
                size={16}
              />
              Mon profil
            </a>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="mr-3 text-sm text-gray-400 group-hover:text-gray-500" size={16} />
            Déconnexion
          </button>
        </div>
      </nav>
    </div>
  );
}
