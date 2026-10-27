import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Plus, 
  Eye, 
  Sparkles,
  Share2
} from 'lucide-react';
import { OfficeEvent, OperativeArea, UserProfile } from '../types';
import { OPERATIVE_AREAS } from '../data/mockData';

interface CalendarViewProps {
  events: OfficeEvent[];
  currentUser: UserProfile;
  initialAreaFilter?: OperativeArea | 'TODAS';
  onOpenNewEvent?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  currentUser,
  initialAreaFilter = 'TODAS',
}) => {
  const [selectedArea, setSelectedArea] = useState<OperativeArea | 'TODAS'>(initialAreaFilter);

  // If VISITANTE, only show public events as requested
  const visibleEvents = events.filter((e) => {
    if (currentUser.role === 'VISITANTE' && !e.esPublico) return false;
    if (selectedArea !== 'TODAS' && e.areaOperativa !== selectedArea) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0D472C]/20 pb-4">
        <div>
          <h2 className="font-archival text-xl font-bold text-[#0D472C]">
            Calendario de Eventos y Talleres Comunitarios
          </h2>
          <p className="text-xs text-gray-600">
            Jornadas de salud, torneos barriales, muestras de arte, ferias tecnológicas y asambleas
          </p>
        </div>

        {/* Area filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600">Filtrar por Área:</span>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value as any)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#0D472C] focus:ring-2 focus:ring-[#0D472C]"
          >
            <option value="TODAS">Todas las Áreas</option>
            {OPERATIVE_AREAS.map((a) => (
              <option key={a.key} value={a.key}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentUser.role === 'VISITANTE' && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4 text-xs text-emerald-900 flex items-center gap-3">
          <Eye className="h-5 w-5 shrink-0 text-emerald-700" />
          <div>
            <span className="font-bold block">Cartelera Abierta para Familias y Vecinos de Puerto Esperanza</span>
            <span>Todos los eventos y talleres que se muestran a continuación son gratuitos y de acceso libre a la comunidad.</span>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visibleEvents.map((e) => {
          return (
            <div
              key={e.id}
              className="rounded-2xl border border-[#0D472C]/25 bg-white p-5 shadow-xs hover:border-[#0D472C] hover:shadow-md transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <span className="text-xs font-bold text-white bg-[#0D472C] px-2.5 py-0.5 rounded">
                    {e.areaOperativa}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-800 bg-[#FAF7F0] px-2 py-0.5 rounded border border-gray-200">
                      📅 {e.fecha}
                    </span>
                    {e.esPublico ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Público
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Interno
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-archival text-base font-bold text-gray-900 mt-2 leading-snug">
                  {e.titulo}
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {e.descripcion}
                </p>

                <div className="mt-3 space-y-1 text-xs text-gray-700 bg-[#FAF7F0] p-3 rounded-xl border border-gray-200">
                  <p className="flex items-center gap-1.5 font-semibold">
                    <Clock className="h-3.5 w-3.5 text-[#0D472C]" />
                    Horario: {e.hora}
                  </p>
                  <p className="flex items-center gap-1.5 font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-[#0D472C]" />
                    Lugar: {e.lugar}
                  </p>
                  <p className="flex items-center gap-1.5 text-gray-600 text-[11px]">
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                    Responsable: <strong>{e.responsable}</strong> • Convocatoria estimada: ~{e.participantesEsperados} personas
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Puerto Esperanza • Huella Verde</span>
                <span className="text-[11px] font-bold text-[#0D472C]">
                  Centro de Medios y Archivos
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
