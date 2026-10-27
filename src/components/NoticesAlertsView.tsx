import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Check, 
  Calendar, 
  Send, 
  AlertCircle
} from 'lucide-react';
import { OfficeNotice, UserProfile, OperativeArea } from '../types';
import { OPERATIVE_AREAS } from '../data/mockData';
import { StorageService } from '../services/storageService';

interface NoticesAlertsViewProps {
  currentUser: UserProfile;
}

export const NoticesAlertsView: React.FC<NoticesAlertsViewProps> = ({
  currentUser,
}) => {
  const isAdmin = currentUser.role === 'ADMIN';

  const [notices, setNotices] = useState<OfficeNotice[]>(() => StorageService.getNotices());
  const [isCreatingNotice, setIsCreatingNotice] = useState(false);

  // Form states
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [nivel, setNivel] = useState<OfficeNotice['nivel']>('IMPORTANTE');
  const [areaDestino, setAreaDestino] = useState<OperativeArea | 'TODAS'>('TODAS');

  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotificationMsg({ type, text });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showNotification('error', 'Solo el Coordinador General puede emitir avisos y alertas oficiales.');
      return;
    }
    if (!titulo.trim() || !mensaje.trim()) {
      showNotification('error', 'El título y el mensaje del aviso son obligatorios.');
      return;
    }

    const newNotice: OfficeNotice = {
      id: 'not-' + Date.now(),
      titulo: titulo.trim(),
      mensaje: mensaje.trim(),
      nivel,
      areaDestino,
      creadoPor: currentUser.name + ' (Coordinación)',
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activo: true,
    };

    const updated = StorageService.saveNotice(newNotice, currentUser);
    setNotices(updated);
    setIsCreatingNotice(false);
    setTitulo('');
    setMensaje('');
    setNivel('IMPORTANTE');
    setAreaDestino('TODAS');
    showNotification('success', `Aviso emitido con éxito para ${areaDestino === 'TODAS' ? 'toda la oficina' : areaDestino}`);
  };

  const handleToggleNotice = (id: string) => {
    if (!isAdmin) return;
    const updated = StorageService.toggleNotice(id, currentUser);
    setNotices(updated);
    showNotification('success', 'Estado de la alerta modificado');
  };

  const handleDeleteNotice = (id: string) => {
    if (!isAdmin) return;
    const updated = StorageService.deleteNotice(id, currentUser);
    setNotices(updated);
    showNotification('success', 'Aviso eliminado del historial');
  };

  // Filter notices for display
  const visibleNotices = notices.filter((n) => {
    if (isAdmin) return true;
    if (n.areaDestino === 'TODAS') return true;
    return currentUser.assignedArea === n.areaDestino;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-amber-600 text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold bg-white text-gray-950 px-2.5 py-0.5 rounded uppercase">
                Comunicación Institucional
              </span>
              <span className="text-xs text-amber-100">Puerto Esperanza</span>
              <span className="text-xs bg-black/30 px-2.5 py-0.5 rounded border border-white/20">
                {visibleNotices.filter((n) => n.activo).length} alertas activas
              </span>
            </div>

            <h1 className="font-archival text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Avisos y Alertas de Coordinación
            </h1>
            <p className="text-xs text-amber-50 max-w-xl mt-1.5 leading-relaxed">
              Canal oficial de directivas, convocatorias urgentes, plazos de entrega de planillas y avisos para el personal de las áreas.
            </p>
          </div>

          {isAdmin && !isCreatingNotice && (
            <button
              onClick={() => setIsCreatingNotice(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-white text-amber-950 hover:bg-amber-100 px-5 py-3 text-xs font-bold shadow-md transition cursor-pointer self-start md:self-auto active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Emitir Nuevo Aviso o Alerta</span>
            </button>
          )}
        </div>
      </div>

      {notificationMsg && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in ${
          notificationMsg.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'
        }`}>
          {notificationMsg.type === 'success' ? <Check className="h-4 w-4 text-emerald-700" /> : <AlertCircle className="h-4 w-4 text-red-700" />}
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* FORM: EMIT NEW NOTICE / ALERT (ADMIN ONLY) */}
      {isCreatingNotice && isAdmin && (
        <div className="rounded-3xl border-2 border-amber-600 bg-[#FFFDF8] p-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="font-archival text-base font-bold text-amber-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-600" />
              <span>Redactar y Emitir Comunicado Oficial</span>
            </h3>
            <button
              onClick={() => setIsCreatingNotice(false)}
              className="text-xs text-gray-500 hover:text-black underline cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSaveNotice} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">
                Título o Asunto de la Alerta *
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Cierre de Entrega de Planillas de Asistencia del Mes"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-amber-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nivel de Prioridad *</label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="INFO">Informativo (General)</option>
                  <option value="IMPORTANTE">Importante (Atención requerida)</option>
                  <option value="URGENTE">Urgente / Alerta Máxima (Acción inmediata)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Destinatarios *</label>
                <select
                  value={areaDestino}
                  onChange={(e) => setAreaDestino(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="TODAS">Todos los Equipos y Áreas de la Oficina</option>
                  {OPERATIVE_AREAS.map((a) => (
                    <option key={a.key} value={a.key}>Solo: {a.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Cuerpo del Mensaje / Directiva *
              </label>
              <textarea
                rows={4}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escriba aquí los detalles, plazos, requerimientos o instrucciones para el personal..."
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-xs leading-relaxed"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsCreatingNotice(false)}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Emitir Comunicado a las Áreas</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NOTICES LIST */}
      <div className="space-y-4">
        {visibleNotices.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center text-gray-500 text-xs">
            <Bell className="h-10 w-10 mx-auto text-gray-300 mb-2" />
            <span>No hay avisos o alertas en este momento para su área.</span>
          </div>
        ) : (
          visibleNotices.map((notice) => (
            <div
              key={notice.id}
              className={`rounded-2xl border-2 bg-white p-5 shadow-xs transition ${
                notice.activo ? 'border-amber-300' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    notice.nivel === 'URGENTE' ? 'bg-red-600 text-white' :
                    notice.nivel === 'IMPORTANTE' ? 'bg-amber-500 text-gray-950 font-black' :
                    'bg-blue-100 text-blue-900'
                  }`}>
                    {notice.nivel}
                  </span>

                  <span className="text-xs font-mono font-bold text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {notice.fecha} ({notice.hora} hs)
                  </span>

                  <span className="text-[10px] font-bold bg-[#E8F3ED] text-[#0D472C] px-2 py-0.5 rounded">
                    Destino: {notice.areaDestino === 'TODAS' ? 'Toda la Oficina' : notice.areaDestino}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleToggleNotice(notice.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                          notice.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {notice.activo ? 'Activa' : 'Pausada'}
                      </button>

                      <button
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition cursor-pointer"
                        title="Eliminar aviso"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h3 className="font-archival text-base font-bold text-gray-900 mb-1">
                {notice.titulo}
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line mb-3">
                {notice.mensaje}
              </p>

              <div className="text-[11px] text-gray-400 border-t pt-2 flex items-center justify-between">
                <span>Emitido por: {notice.creadoPor}</span>
                <span className="text-emerald-800 font-semibold">Oficina Central Puerto Esperanza</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
