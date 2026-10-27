import React, { useState } from 'react';
import { 
  KeyRound, 
  User, 
  ShieldCheck, 
  LogIn, 
  AlertCircle, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storageService';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('49993070');
  const [passwordPin, setPasswordPin] = useState('49993070');
  const [errorMsg, setErrorMsg] = useState('');
  const [showQuickSelect, setShowQuickSelect] = useState(true);

  const usersList = StorageService.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Ingrese su usuario o DNI.');
      return;
    }

    const auth = StorageService.authenticate(username, passwordPin || '1234');
    if (auth) {
      onLoginSuccess(auth);
    } else {
      setErrorMsg('Usuario o clave incorrecta. Verifique sus credenciales.');
    }
  };

  const handleDirectSelect = (u: UserProfile) => {
    setUsername(u.username);
    setPasswordPin(u.passwordPin);
    const auth = StorageService.authenticate(u.username, u.passwordPin);
    if (auth) {
      onLoginSuccess(auth);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6EC] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-xl">
        {/* Institutional Card */}
        <div className="rounded-3xl border-2 border-[#0D472C] bg-[#FFFDF8] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Corner borders */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#0D472C]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#0D472C]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#0D472C]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#0D472C]" />

          {/* Official badge header */}
          <div className="text-center mb-6">
            <div className="inline-block p-1 bg-white rounded-xl border border-[#0D472C]/30 shadow-sm mb-3">
              <img
                src="/assets/aistudio/7b7d3321-35c1-4d47-9d2f-28cfcd4eb5e9_72fa0376.jpg"
                alt="Centro de Medios y Archivos - Puerto Esperanza"
                className="max-h-24 w-auto object-contain mx-auto rounded"
              />
            </div>
            <h1 className="font-archival text-xl sm:text-2xl font-black text-[#0D472C] tracking-tight">
              CENTRO DE MEDIOS Y ARCHIVOS
            </h1>
            <p className="text-xs font-semibold text-[#162B1F]/80">
              Puerto Esperanza • Esperanza somos TODOS • Huella Verde
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3ED] text-[#0D472C] text-[11px] font-bold border border-[#0D472C]/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Acceso Seguro a la Oficina Central</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Main Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Usuario o Número de DNI *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej: 49993070"
                  className="font-mono-tag w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm font-bold text-[#0D472C] focus:ring-2 focus:ring-[#0D472C] focus:outline-none"
                  required
                />
                <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Contraseña / PIN de Acceso *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordPin}
                  onChange={(e) => setPasswordPin(e.target.value)}
                  placeholder="PIN o contraseña..."
                  className="font-mono-tag w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#0D472C] focus:outline-none"
                />
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0D472C] py-3 text-xs font-bold text-[#F9F6EC] hover:bg-[#165B3A] shadow-md transition cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Ingresar al Sistema de la Oficina</span>
            </button>
          </form>

          {/* Quick Access for Real Office Staff (From WhatsApp) */}
          <div className="mt-6 pt-5 border-t border-[#0D472C]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase font-bold text-[#0D472C] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Equipo Real de la Oficina (Ingreso Directo)
              </span>
              <button
                type="button"
                onClick={() => setShowQuickSelect(!showQuickSelect)}
                className="text-[11px] text-gray-500 hover:text-black underline cursor-pointer"
              >
                {showQuickSelect ? 'Ocultar' : 'Ver Equipo'}
              </button>
            </div>

            {showQuickSelect && (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {/* HEAD ADMIN: Almada Eduardo Thomas */}
                {usersList
                  .filter((u) => u.username === '49993070')
                  .map((admin) => (
                    <button
                      key={admin.id}
                      type="button"
                      onClick={() => handleDirectSelect(admin)}
                      className="w-full text-left p-2.5 rounded-xl bg-[#E8F3ED] border-2 border-[#0D472C] transition hover:bg-[#d8ecdf] flex items-center justify-between cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D472C] text-amber-300 font-bold text-xs">
                          👑
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#0D472C]">
                            {admin.name} (Usuario: {admin.username})
                          </div>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                            ADMINISTRADOR GENERAL
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#0D472C]" />
                    </button>
                  ))}

                {/* Team members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {usersList
                    .filter((u) => u.username !== '49993070')
                    .map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleDirectSelect(user)}
                        className="text-left p-2 rounded-xl bg-white border border-gray-200 hover:border-[#0D472C] hover:bg-[#FAF7F0] transition flex items-center justify-between cursor-pointer"
                      >
                        <div className="truncate pr-1">
                          <span className="text-xs font-bold text-gray-900 block truncate">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-gray-500 block truncate">
                            {user.assignedArea || user.role}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-gray-400 shrink-0">
                          {user.username}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer notes */}
        <div className="mt-4 text-center text-xs text-gray-500 space-y-1">
          <p>Oficina de Centro de Medios y Archivos • Puerto Esperanza</p>
          <p className="text-[11px] text-gray-400">
            Coordinador General: Almada Eduardo Thomas • Usuario: 49993070
          </p>
        </div>
      </div>
    </div>
  );
};
