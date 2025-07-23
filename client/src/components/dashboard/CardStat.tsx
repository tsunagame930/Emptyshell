import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CardStatProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: string;
    label: string;
    color: string;
  };
}

export default function CardStat({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  iconBgColor, 
  trend 
}: CardStatProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <Icon className={`${iconColor} text-xl`} size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={`${trend.color} font-medium`}>{trend.value}</span>
            <span className="text-gray-500 ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
