import React, { useState } from 'react';
import { 
  Shield, 
  UserCheck, 
  Users, 
  Eye, 
  Download, 
  Upload, 
  RotateCcw, 
  Smartphone, 
  Search, 
  Wifi, 
  WifiOff, 
  Check, 
  ChevronDown,
  UserPlus,
  LogOut
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HeaderProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  onSearchFolio: (query: string) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
  onResetFactory: () => void;
  onOpenUserManagement: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onSearchFolio,
  onExportBackup,
  onImportBackup,
  onResetFactory,
  onOpenUserManagement,
  onLogout,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearchFolio(searchVal.trim());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackup(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'ADMINISTRADOR GENERAL', color: 'bg-emerald-900 text-amber-200 border-amber-400/40', icon: Shield };
      case 'CARGADOR_DATOS':
        return { label: 'CARGADOR DE DATOS', color: 'bg-emerald-800 text-white border-emerald-600', icon: UserCheck };
      case 'SOLICITANTE':
        return { label: 'SOLICITANTE POR ÁREA', color: 'bg-amber-900 text-amber-100 border-amber-700', icon: Users };
      case 'VISITANTE':
        return { label: 'VISITANTE / COMUNIDAD', color: 'bg-stone-700 text-stone-100 border-stone-500', icon: Eye };
    }
  };

  const currentBadge = getRoleBadge(currentUser.role);
  const BadgeIcon = currentBadge.icon;

  return (
    <header className="border-b-2 border-[#0D472C] bg-[#FFFDF8] shadow-md sticky top-0 z-40">
      {/* Top micro bar for connectivity & office notice */}
      <div className="bg-[#0D472C] text-[#F9F6EC] px-4 py-1.5 text-[11px] font-medium flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wider uppercase text-[10px]">
            CENTRO DE MEDIOS Y ARCHIVOS • PUERTO ESPERANZA • SISTEMA ACTIVO DE RESGUARDO INSTITUCIONAL
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Online/Offline status */}
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-200 text-[10px]">
                <Wifi className="h-3 w-3" /> En Línea (PWA Activa)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-300 text-[10px] bg-amber-900/60 px-1.5 py-0.5 rounded">
                <WifiOff className="h-3 w-3" /> Modo Fuera de Línea (Caché Local)
              </span>
            )}
          </div>

          {/* Backup & Admin Tools */}
          {currentUser.role === 'ADMIN' && (
            <div className="hidden sm:flex items-center gap-2 border-l border-emerald-700/60 pl-3">
              <button
                onClick={onOpenUserManagement}
                title="Crear y administrar usuarios con sus roles y áreas"
                className="bg-emerald-800 text-amber-200 hover:bg-emerald-700 px-2 py-0.5 rounded transition flex items-center gap-1 text-[10px] font-bold border border-emerald-600 cursor-pointer"
              >
                <UserPlus className="h-3 w-3" /> Usuarios & Roles
              </button>
              <button
                onClick={onExportBackup}
                title="Exportar respaldo JSON completo de la oficina"
                className="hover:text-amber-200 transition flex items-center gap-1 text-[10px]"
              >
                <Download className="h-3 w-3" /> Exportar
              </button>
              <label className="hover:text-amber-200 transition flex items-center gap-1 text-[10px] cursor-pointer">
                <Upload className="h-3 w-3" /> Restaurar
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={onResetFactory}
                title="Restablecer registros base oficiales"
                className="hover:text-red-300 transition flex items-center gap-1 text-[10px]"
              >
                <RotateCcw className="h-3 w-3" /> Base
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/7b7d3321-35c1-4d47-9d2f-28cfcd4eb5e9_72fa0376.jpg"
            alt="Escudo Centro de Medios y Archivos"
            className="h-14 w-auto rounded-md border border-[#0D472C]/40 shadow-xs object-cover"
          />
          <div>
            <h1 className="font-archival text-lg sm:text-xl font-black text-[#0D472C] tracking-tight leading-tight">
              CENTRO DE MEDIOS Y ARCHIVOS
            </h1>
            <p className="text-xs font-semibold text-[#162B1F]/80 flex items-center gap-1">
              <span>Puerto Esperanza</span>
              <span className="text-[#0D472C]">●</span>
              <span className="italic text-[#0D472C] font-normal">Esperanza somos TODOS • Huella Verde</span>
            </p>
            <p className="text-[10px] text-gray-500 hidden sm:block">
              ⚽ Deportes • 🎭 Cultura • 🌱 Ambiente • 📸 Prensa y Comunicación • Salud • Niñez • Tecnología
            </p>
          </div>
        </div>

        {/* Quick folio search & Role Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Quick Folio Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative grow sm:grow-0">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Buscar Folio (ej: PE-DEP)..."
              className="font-mono-tag w-full sm:w-44 md:w-52 rounded-lg border border-[#0D472C]/30 bg-[#F9F6EC] pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D472C]"
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-500" />
          </form>

          {/* PWA Install Button */}
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 rounded-lg bg-[#0D472C] px-3 py-1.5 text-xs font-bold text-[#F9F6EC] hover:bg-[#165B3A] shadow-xs transition cursor-pointer"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Instalar</span>
            </button>
          )}

          {isIOS && !isInstalled && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-1 rounded-lg border border-[#0D472C]/40 px-2.5 py-1.5 text-xs font-medium text-[#0D472C] hover:bg-emerald-50 transition"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Instalar iOS</span>
            </button>
          )}

          {/* Active User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 rounded-xl border border-[#0D472C]/30 bg-white px-3 py-1.5 shadow-xs hover:border-[#0D472C] transition cursor-pointer"
            >
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${currentBadge.color}`}>
                <BadgeIcon className="h-3 w-3" />
                <span>{currentUser.role}</span>
              </span>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-gray-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-gray-500 leading-tight">
                  {currentUser.assignedArea ? `${currentUser.assignedArea}` : currentUser.position}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#FFFDF8] border-2 border-[#0D472C] p-2 shadow-2xl z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-[#0D472C]/20 mb-1 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#0D472C] uppercase tracking-wider block">
                      USUARIOS Y ACCESOS DE OFICINA
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Conectado como: <strong>{currentUser.name}</strong>
                    </span>
                  </div>
                </div>

                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {allUsers.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    const meta = getRoleBadge(user.role);
                    const Icon = meta.icon;
                    const isHeadAdmin = user.username === '49993070';

                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl transition flex items-start gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#E8F3ED] border border-[#0D472C]/30'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className={`mt-0.5 p-1 rounded-lg border ${meta.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="grow truncate">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900 truncate">
                              {isHeadAdmin && '👑 '}
                              {user.name}
                            </span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-[#0D472C]" />}
                          </div>
                          <span className="text-[10px] font-semibold text-[#0D472C] block truncate">
                            {user.role} {user.assignedArea && `• ${user.assignedArea}`}
                          </span>
                          <span className="text-[9px] font-mono text-gray-400 block">
                            Usuario: {user.username}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {currentUser.role === 'ADMIN' && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onOpenUserManagement();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#0D472C] py-1.5 text-xs font-bold text-white hover:bg-[#165B3A] transition cursor-pointer"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Crear / Gestionar Usuarios</span>
                    </button>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout Quick Button */}
          <button
            onClick={onLogout}
            title="Cerrar sesión de la oficina"
            className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border-2 border-[#0D472C]">
            <h3 className="text-base font-bold text-[#0D472C]">Instalar en iPhone o iPad</h3>
            <p className="mt-2 text-xs text-gray-700 leading-relaxed">
              1. En Safari, toque el botón <strong>Compartir</strong> (cuadrado con flecha hacia arriba).<br /><br />
              2. Deslice hacia abajo y seleccione <strong>"Agregar al inicio"</strong>.<br /><br />
              3. La app quedará guardada como un acceso directo con ícono institucional para operar incluso sin conexión.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-lg bg-[#0D472C] py-2 text-xs font-bold text-white hover:bg-[#165B3A] transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
