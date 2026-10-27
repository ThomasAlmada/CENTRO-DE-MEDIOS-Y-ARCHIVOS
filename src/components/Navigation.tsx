import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  SendHorizontal, 
  Coins, 
  Calendar, 
  QrCode,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserProfile;
  pendingRequestsCount: number;
  activeLoansCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  currentUser,
  pendingRequestsCount,
  activeLoansCount,
}) => {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Tablero General',
      icon: LayoutDashboard,
      description: 'Métricas por área',
    },
    {
      id: 'documents',
      label: 'Archivo Documental',
      icon: FileText,
      description: 'Foliado y estantes',
    },
    {
      id: 'kids',
      label: 'Fichas de Niñez',
      icon: Users,
      description: 'Padrón y tutores',
    },
    {
      id: 'inventory',
      label: 'Inventario & Préstamos',
      icon: Package,
      badge: activeLoansCount > 0 ? `${activeLoansCount}` : undefined,
      description: 'Firma digital',
    },
    {
      id: 'requests',
      label: 'Solicitudes por Área',
      icon: SendHorizontal,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
      description: 'Pedidos internos',
    },
    {
      id: 'budget',
      label: 'Presupuesto & Balance',
      icon: Coins,
      adminOnly: true,
      description: 'Exclusivo Admin',
    },
    {
      id: 'calendar',
      label: 'Calendario & Cartelera',
      icon: Calendar,
      description: 'Eventos comunitarios',
    },
    {
      id: 'qr_lookup',
      label: 'Localizador QR',
      icon: QrCode,
      description: 'Buscador de estante',
    },
  ];

  return (
    <nav className="bg-[#FFFDF8] border-b border-[#0D472C]/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto py-2 gap-1.5 scrollbar-none">
        {tabs.map((tab) => {
          // If role is VISITANTE, hide budget and requests
          if (currentUser.role === 'VISITANTE' && (tab.id === 'budget' || tab.id === 'requests')) {
            return null;
          }

          // If role is CARGADOR_DATOS or SOLICITANTE, hide budget
          if (currentUser.role !== 'ADMIN' && tab.adminOnly) {
            return null;
          }

          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#0D472C] text-[#F9F6EC] shadow-sm'
                  : 'text-gray-700 hover:bg-[#E8F3ED] hover:text-[#0D472C]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-amber-400 text-gray-900' : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
