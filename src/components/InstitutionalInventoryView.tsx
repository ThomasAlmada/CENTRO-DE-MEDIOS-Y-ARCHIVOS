import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ShieldCheck, 
  Download,
  Building,
  Sparkles
} from 'lucide-react';
import { InstitutionalInventoryItem, UserProfile, OperativeArea } from '../types';
import { OPERATIVE_AREAS } from '../data/mockData';
import { StorageService } from '../services/storageService';

interface InstitutionalInventoryViewProps {
  currentUser: UserProfile;
}

export const InstitutionalInventoryView: React.FC<InstitutionalInventoryViewProps> = ({
  currentUser,
}) => {
  const isAdmin = currentUser.role === 'ADMIN';
  const canManage = isAdmin || currentUser.role === 'CARGADOR_DATOS';

  const [items, setItems] = useState<InstitutionalInventoryItem[]>(() => 
    StorageService.getInstitutionalInventory()
  );

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUbicacion, setFilterUbicacion] = useState<string>('TODOS');
  const [filterArea, setFilterArea] = useState<string>('TODAS');

  // Form states - Exactly matching user specifications:
  // "persona que inventaría, fecha y hora, día, articulo, código y cosas necesarias"
  const [articulo, setArticulo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [personaQueInventaria, setPersonaQueInventaria] = useState(currentUser.name);
  const [dia, setDia] = useState(() => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[new Date().getDay()];
  });
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [espacioUbicacion, setEspacioUbicacion] = useState<InstitutionalInventoryItem['espacioUbicacion']>('SEDE CENTRAL');
  const [estanteAsignado, setEstanteAsignado] = useState('Estante 1 - Coordinación General y Resoluciones');
  const [areaAsignada, setAreaAsignada] = useState<OperativeArea | 'GENERAL INSTITUCIONAL'>('GENERAL INSTITUCIONAL');
  const [categoria, setCategoria] = useState<InstitutionalInventoryItem['categoria']>('Varios');
  const [cantidad, setCantidad] = useState(1);
  const [estado, setEstado] = useState<InstitutionalInventoryItem['estado']>('Excelente');
  const [observaciones, setObservaciones] = useState('');

  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotificationMsg({ type, text });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const resetForm = () => {
    setIsAddingItem(false);
    setEditingItemId(null);
    setArticulo('');
    setCodigo('');
    setPersonaQueInventaria(currentUser.name);
    setCantidad(1);
    setEstado('Excelente');
    setObservaciones('');
  };

  const handleStartEdit = (item: InstitutionalInventoryItem) => {
    setEditingItemId(item.id);
    setArticulo(item.articulo);
    setCodigo(item.codigo);
    setPersonaQueInventaria(item.personaQueInventaria);
    setDia(item.dia);
    setFecha(item.fecha);
    setHora(item.hora);
    setEspacioUbicacion(item.espacioUbicacion);
    setEstanteAsignado(item.estanteAsignado || 'Estante 1 - Coordinación General y Resoluciones');
    setAreaAsignada(item.areaAsignada);
    setCategoria(item.categoria);
    setCantidad(item.cantidad);
    setEstado(item.estado);
    setObservaciones(item.observaciones);
    setIsAddingItem(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      showNotification('error', 'Solo el Coordinador General o el Cargador de Datos pueden asentar o modificar inventario.');
      return;
    }
    if (!articulo.trim()) {
      showNotification('error', 'El nombre del artículo a inventariar es obligatorio.');
      return;
    }

    const cleanCodigo = codigo.trim() || `INV-${Date.now().toString().slice(-4)}`;

    const itemToSave: InstitutionalInventoryItem = {
      id: editingItemId || 'inv-' + Date.now(),
      codigo: cleanCodigo,
      articulo: articulo.trim(),
      personaQueInventaria: personaQueInventaria.trim() || currentUser.name,
      dia,
      fecha,
      hora,
      espacioUbicacion,
      estanteAsignado,
      areaAsignada,
      categoria,
      cantidad: Number(cantidad) || 1,
      estado,
      observaciones: observaciones.trim(),
      registradoPorUsuario: currentUser.username,
    };

    const updated = StorageService.saveInstitutionalInventoryItem(itemToSave, currentUser);
    setItems(updated);
    showNotification('success', editingItemId ? 'Artículo de inventario actualizado.' : `Inventariado con éxito: ${itemToSave.articulo}`);
    resetForm();
  };

  const handleDelete = (item: InstitutionalInventoryItem) => {
    if (!canManage) {
      showNotification('error', 'No tiene permisos para dar de baja inventario.');
      return;
    }
    const updated = StorageService.deleteInstitutionalInventoryItem(item.id, currentUser);
    setItems(updated);
    showNotification('success', `Baja registrada para: ${item.articulo}`);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filterUbicacion !== 'TODOS' && item.espacioUbicacion !== filterUbicacion) {
        return false;
      }
      if (filterArea !== 'TODAS' && item.areaAsignada !== filterArea) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.articulo.toLowerCase().includes(q) ||
          item.codigo.toLowerCase().includes(q) ||
          item.personaQueInventaria.toLowerCase().includes(q) ||
          item.observaciones.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, filterUbicacion, filterArea, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-[#0D472C] text-[#F9F6EC] p-6 sm:p-7 shadow-lg border-2 border-emerald-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold bg-amber-400 text-gray-950 px-2.5 py-0.5 rounded uppercase">
                Inventario General Institucional
              </span>
              <span className="text-xs text-emerald-200">Puerto Esperanza</span>
              <span className="text-xs bg-emerald-900 px-2.5 py-0.5 rounded border border-emerald-700">
                Sede Central & Espacio Esperanza Somos Todos
              </span>
            </div>

            <h1 className="font-archival text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Libro de Inventario Patrimonial
            </h1>
            <p className="text-xs text-emerald-100 max-w-xl mt-1.5 leading-relaxed">
              Registro obligatorio de bienes, mobiliario, sonido, herramientas y equipamiento deportivo. Cada asiento detalla la persona que inventaría, día, fecha y hora, artículo y código.
            </p>
          </div>

          {canManage && !isAddingItem && (
            <button
              onClick={() => {
                resetForm();
                setIsAddingItem(true);
              }}
              className="flex items-center gap-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-950 px-5 py-3 text-xs font-bold shadow-md transition cursor-pointer self-start md:self-auto active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Inventariar Nuevo Artículo</span>
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

      {/* FORM TO INVENTARY A NEW ITEM (EXACT SPECIFICATION) */}
      {isAddingItem && canManage && (
        <div className="rounded-3xl border-2 border-[#0D472C] bg-[#FFFDF8] p-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#0D472C]" />
              <h3 className="font-archival text-base font-bold text-[#0D472C]">
                {editingItemId ? 'Modificar Registro de Inventario' : 'Cargar e Inventariar Objeto en el Centro'}
              </h3>
            </div>
            <button
              onClick={resetForm}
              className="text-xs text-gray-500 hover:text-black font-semibold cursor-pointer underline"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* ROW 1: Articulo y Código */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nombre del Artículo / Bien *
                </label>
                <input
                  type="text"
                  value={articulo}
                  onChange={(e) => setArticulo(e.target.value)}
                  placeholder="Ej: Consola de Sonido Yamaha / 10 Pelotas de Fútbol N° 5"
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#0D472C]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Código Único Patrimonial *
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ej: INV-ESP-015"
                  className="font-mono w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-[#0D472C] focus:ring-2 focus:ring-[#0D472C]"
                />
              </div>
            </div>

            {/* ROW 2: Persona que inventaría, Día, Fecha y Hora (EXACT SPEC) */}
            <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-[#0D472C] mb-1 flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>Persona que Inventaría *</span>
                </label>
                <input
                  type="text"
                  value={personaQueInventaria}
                  onChange={(e) => setPersonaQueInventaria(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Día de la Semana *</label>
                <select
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold"
                >
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Fecha *</span>
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Hora Exacta *</span>
                </label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-mono"
                  required
                />
              </div>
            </div>

            {/* ROW 3: Ubicacion Espacio, Estante y Area Asignada */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Espacio Físico *</label>
                <select
                  value={espacioUbicacion}
                  onChange={(e) => setEspacioUbicacion(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-[#0D472C]"
                >
                  <option value="SEDE CENTRAL">SEDE CENTRAL</option>
                  <option value="ESPACIO ESPERANZA SOMOS TODOS">ESPACIO ESPERANZA SOMOS TODOS</option>
                  <option value="GALPÓN TALLERES">GALPÓN TALLERES</option>
                  <option value="CANCHA / EXTERIOR">CANCHA / EXTERIOR</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Estante Asignado</label>
                <input
                  type="text"
                  value={estanteAsignado}
                  onChange={(e) => setEstanteAsignado(e.target.value)}
                  placeholder="Ej: Estante 1 / Estante 2"
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Área Asignada</label>
                <select
                  value={areaAsignada}
                  onChange={(e) => setAreaAsignada(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs"
                >
                  <option value="GENERAL INSTITUCIONAL">GENERAL INSTITUCIONAL</option>
                  {OPERATIVE_AREAS.map((a) => (
                    <option key={a.key} value={a.key}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ROW 4: Cantidad, Categoria, Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Cantidad / Unidades *</label>
                <input
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Categoría</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs"
                >
                  <option value="Deportes">Deportes</option>
                  <option value="Audio y Tecnología">Audio y Tecnología</option>
                  <option value="Mobiliario">Mobiliario</option>
                  <option value="Arte y Pinturas">Arte y Pinturas</option>
                  <option value="Sanidad y Rescate">Sanidad y Rescate</option>
                  <option value="Herramientas">Herramientas</option>
                  <option value="Varios">Varios</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Estado de Conservación</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold"
                >
                  <option value="Excelente">Excelente</option>
                  <option value="Bueno">Bueno</option>
                  <option value="Regular">Regular</option>
                  <option value="A Reparar">A Reparar</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Observaciones / Detalles Adicionales</label>
              <textarea
                rows={2}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Origen, donación, accesorios incluidos o precauciones de resguardo..."
                className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-[#0D472C] hover:bg-[#165B3A] text-white font-bold shadow-md cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{editingItemId ? 'Guardar Cambios' : 'Asentar en Inventario'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por artículo, código o persona..."
            className="w-full rounded-xl border border-gray-300 bg-[#FFFDF8] pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-[#0D472C]"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div>
            <select
              value={filterUbicacion}
              onChange={(e) => setFilterUbicacion(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold"
            >
              <option value="TODOS">Todas las Sedes / Espacios</option>
              <option value="SEDE CENTRAL">SEDE CENTRAL</option>
              <option value="ESPACIO ESPERANZA SOMOS TODOS">ESPACIO ESPERANZA SOMOS TODOS</option>
              <option value="GALPÓN TALLERES">GALPÓN TALLERES</option>
              <option value="CANCHA / EXTERIOR">CANCHA / EXTERIOR</option>
            </select>
          </div>

          <div>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold"
            >
              <option value="TODAS">Todas las Áreas</option>
              <option value="GENERAL INSTITUCIONAL">GENERAL INSTITUCIONAL</option>
              {OPERATIVE_AREAS.map((a) => (
                <option key={a.key} value={a.key}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* INVENTORY ITEMS TABLE / CARDS */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b bg-[#FAF7F0] flex items-center justify-between">
          <span className="text-xs font-bold text-[#0D472C] uppercase tracking-wider">
            Total de Bienes Inventariados: {filteredItems.length} registros
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            Sede Central + Espacio Esperanza Somos Todos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 font-bold uppercase text-[10px]">
                <th className="p-3">Código</th>
                <th className="p-3">Artículo / Bien</th>
                <th className="p-3">Inventariado Por</th>
                <th className="p-3">Día, Fecha y Hora</th>
                <th className="p-3">Sede / Ubicación</th>
                <th className="p-3">Área Asignada</th>
                <th className="p-3">Cant.</th>
                <th className="p-3">Estado</th>
                {isAdmin && <th className="p-3 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-mono font-bold text-[#0D472C]">
                    {item.codigo}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{item.articulo}</div>
                    {item.observaciones && (
                      <div className="text-[11px] text-gray-500 line-clamp-1">{item.observaciones}</div>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-gray-800">
                    {item.personaQueInventaria}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-gray-600">
                    <div>{item.dia}, {item.fecha}</div>
                    <div className="text-gray-400">{item.hora} hs</div>
                  </td>
                  <td className="p-3">
                    <span className="bg-[#E8F3ED] text-[#0D472C] font-semibold text-[10px] px-2 py-0.5 rounded border border-[#0D472C]/20 block w-fit">
                      {item.espacioUbicacion}
                    </span>
                    {item.estanteAsignado && (
                      <span className="text-[10px] text-gray-400 block mt-0.5">{item.estanteAsignado}</span>
                    )}
                  </td>
                  <td className="p-3 text-[11px] font-medium text-gray-700">
                    {item.areaAsignada}
                  </td>
                  <td className="p-3 font-mono font-black text-gray-900 text-sm">
                    {item.cantidad}
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.estado === 'Excelente' ? 'bg-emerald-100 text-emerald-800' :
                      item.estado === 'Bueno' ? 'bg-blue-100 text-blue-800' :
                      item.estado === 'Regular' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.estado}
                    </span>
                  </td>
                  {canManage && (
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 text-gray-600 hover:text-[#0D472C] hover:bg-gray-100 rounded-lg cursor-pointer"
                          title="Editar registro"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Dar de baja este artículo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
