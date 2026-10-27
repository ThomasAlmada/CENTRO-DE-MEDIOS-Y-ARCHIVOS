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
  UserCog,
  LogOut,
  Building2
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HeaderProps {
  currentUser: UserProfile;
  onSearchFolio: (query: string) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
  onResetFactory: () => void;
  onOpenUserManagement: () => void;
  onLogout: () => void;
  onOpenDigitize?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSearchFolio,
  onExportBackup,
  onImportBackup,
  onResetFactory,
  onOpenUserManagement,
  onLogout,
  onOpenDigitize,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
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

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return { label: '👑 COORDINADOR GENERAL', color: 'bg-emerald-950 text-amber-300 border-amber-400/40' };
      case 'SECRETARIO':
        return { label: 'SECRETARIO DE OFICINA', color: 'bg-emerald-800 text-white border-emerald-600' };
      case 'CARGADOR_DATOS':
        return { label: `CARGADOR (${currentUser.assignedArea?.split(' ')[0] || 'ÁREA'})`, color: 'bg-emerald-900 text-white border-emerald-700' };
      case 'SOLICITANTE':
        return { label: `SOLICITANTE (${currentUser.assignedArea?.split(' ')[0] || 'ÁREA'})`, color: 'bg-amber-900 text-amber-100 border-amber-800' };
      case 'VISITANTE':
        return { label: 'CONSULTA PÚBLICA (SIN ÁREA)', color: 'bg-stone-700 text-stone-100 border-stone-600' };
    }
  };

  const roleMeta = getRoleLabel(currentUser.role);

  return (
    <header className="border-b-2 border-[#0D472C] bg-[#FFFDF8] shadow-sm sticky top-0 z-40">
      {/* Top bar for connectivity status and institution branding */}
      <div className="bg-[#0D472C] text-[#F9F6EC] px-4 py-1.5 text-[11px] font-medium flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wider uppercase text-[10px]">
            CENTRO DE MEDIOS Y ARCHIVOS • PUERTO ESPERANZA
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online/Offline status */}
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-200 text-[10px]">
                <Wifi className="h-3 w-3" /> Conectado
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-300 text-[10px] bg-amber-900/60 px-1.5 py-0.5 rounded">
                <WifiOff className="h-3 w-3" /> Modo Sin Conexión
              </span>
            )}
          </div>

          {/* Admin Tools */}
          {currentUser.role === 'ADMIN' && (
            <div className="flex items-center gap-1.5 border-l border-emerald-700/60 pl-2">
              <button
                onClick={onOpenUserManagement}
                className="bg-amber-500 hover:bg-amber-400 text-emerald-950 px-2 py-0.5 rounded transition flex items-center gap-1 text-[11px] font-bold shadow-xs cursor-pointer"
                title="Administrar usuarios y personal de la oficina"
              >
                <UserCog className="h-3.5 w-3.5" />
                <span>Personal</span>
              </button>
              <button
                onClick={onExportBackup}
                title="Exportar copia de seguridad del archivo"
                className="hidden md:flex hover:text-amber-200 transition items-center gap-1 text-[10px] cursor-pointer"
              >
                <Download className="h-3 w-3" /> Copia Respaldo
              </button>
              <label className="hidden md:flex hover:text-amber-200 transition items-center gap-1 text-[10px] cursor-pointer">
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
                title="Restablecer datos de inicio"
                className="hidden md:flex hover:text-red-300 transition items-center gap-1 text-[10px] cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Base
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/7b7d3321-35c1-4d47-9d2f-28cfcd4eb5e9_72fa0376.jpg"
            alt="Centro de Medios y Archivos"
            className="h-12 w-auto rounded border border-[#0D472C]/40 shadow-xs object-cover"
          />
          <div>
            <h1 className="font-archival text-base sm:text-lg font-black text-[#0D472C] tracking-tight leading-tight">
              CENTRO DE MEDIOS Y ARCHIVOS
            </h1>
            <p className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
              <span>Puerto Esperanza</span>
              <span className="text-[#0D472C]">●</span>
              <span className="italic text-[#0D472C] font-normal">Esperanza somos TODOS • Huella Verde</span>
            </p>
          </div>
        </div>

        {/* Quick action: Subir Papel, Search & User profile with Logout */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Direct "Subir Papel / Digitalizar" button */}
          {currentUser.role !== 'VISITANTE' && onOpenDigitize && (
            <button
              onClick={onOpenDigitize}
              className="flex items-center gap-1.5 rounded-lg bg-[#0D472C] hover:bg-[#165B3A] text-[#F9F6EC] px-3 py-1.5 text-xs font-bold shadow-sm transition cursor-pointer"
              title="Sacar foto o subir papel a los folios de los estantes"
            >
              <span className="text-sm">📸</span>
              <span>Subir Papel a Folio</span>
            </button>
          )}

          {/* Quick Folio Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative grow sm:grow-0">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Buscar Folio..."
              className="font-mono-tag w-full sm:w-36 md:w-44 rounded-lg border border-gray-300 bg-[#FAF7F0] pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D472C]"
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
          </form>

          {/* PWA Install Button */}
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 rounded-lg bg-[#0D472C] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#165B3A] shadow-xs transition cursor-pointer"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Instalar</span>
            </button>
          )}

          {/* Logged in User Profile Info + Direct Logout (NO PROMPT CONFIRMATION) */}
          <div className="flex items-center gap-2 bg-white border border-[#0D472C]/25 rounded-xl px-2.5 py-1.5 shadow-xs">
            <div className="text-right">
              <div className="text-xs font-bold text-gray-900 leading-tight">
                {currentUser.name}
              </div>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleMeta.color}`}>
                  {roleMeta.label}
                </span>
              </div>
            </div>

            {/* DIRECT Logout button without blocking window.confirm */}
            <button
              onClick={() => onLogout()}
              title="Cerrar Sesión de la Oficina"
              className="flex items-center gap-1 py-1 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition cursor-pointer text-xs font-bold border border-red-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border-2 border-[#0D472C]">
            <h3 className="text-base font-bold text-[#0D472C]">Instalar en iPhone o iPad</h3>
            <p className="mt-2 text-xs text-gray-700 leading-relaxed">
              1. En Safari, toque el botón <strong>Compartir</strong>.<br /><br />
              2. Deslice hacia abajo y seleccione <strong>"Agregar al inicio"</strong>.<br /><br />
              3. La app quedará instalada para operar de manera directa en su dispositivo.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-lg bg-[#0D472C] py-2 text-xs font-bold text-white hover:bg-[#165B3A] transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
