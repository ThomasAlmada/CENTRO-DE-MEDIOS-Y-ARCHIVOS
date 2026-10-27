import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FolderOpen, 
  Search, 
  Camera, 
  FileText, 
  QrCode, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  User, 
  Plus, 
  Eye, 
  Download,
  Filter,
  CheckCircle2,
  Layers,
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { ArchiveDocument, UserProfile, OfficeFolioCategory } from '../types';
import { OFFICE_SHELF_FOLIOS } from '../data/mockData';

interface OfficeShelvesViewProps {
  documents: ArchiveDocument[];
  currentUser: UserProfile;
  onOpenDigitizeFolio: (folioName: OfficeFolioCategory) => void;
  onPrintFolioLabel: (doc: ArchiveDocument) => void;
  onViewDocDetail: (doc: ArchiveDocument) => void;
}

export const OfficeShelvesView: React.FC<OfficeShelvesViewProps> = ({
  documents,
  currentUser,
  onOpenDigitizeFolio,
  onPrintFolioLabel,
  onViewDocDetail,
}) => {
  const [selectedFolioName, setSelectedFolioName] = useState<OfficeFolioCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [shelfFilter, setShelfFilter] = useState<string>('TODOS');
  const [selectedPaperPreview, setSelectedPaperPreview] = useState<ArchiveDocument | null>(null);

  // Group documents by folio
  const docsByFolio = useMemo(() => {
    const map = new Map<string, ArchiveDocument[]>();
    OFFICE_SHELF_FOLIOS.forEach((f) => map.set(f.name, []));

    documents.forEach((doc) => {
      // Find matching folio by explicit folioNombre or inferred from administrative / operative types
      let matchedName: OfficeFolioCategory | null = doc.folioNombre || null;

      if (!matchedName) {
        // Fallback mapping
        if (doc.tipoAdministrativo === 'ACTAS Y REUNIONES') matchedName = 'Actas y reuniones';
        else if (doc.tipoAdministrativo === 'INVENTARIO') matchedName = 'Inventario';
        else if (doc.tipoAdministrativo === 'EVENTOS') matchedName = 'Eventos';
        else if (doc.tipoAdministrativo === 'CARTELES') matchedName = 'Carteles';
        else if (doc.tipoAdministrativo === 'PROYECTOS') matchedName = 'Proyectos';
        else if (doc.tipoAdministrativo === 'NOTAS Y RESOLUCIONES') matchedName = 'Notas y resolucion';
        else if (doc.tipoAdministrativo === 'PRESUPUESTO, RECAUDACIÓN Y BALANCE') matchedName = 'Presupuesto recaudacion y balance';
        else if (doc.tipoAdministrativo === 'INFORME') matchedName = 'Informe';
        else if (doc.tipoAdministrativo === 'PLANIFICACIÓN') matchedName = 'Planificacion';
        else if (doc.tipoAdministrativo === 'REGISTRO') matchedName = 'Registro';
        else if (doc.areaOperativa === 'DEPORTES Y ACCIÓN SOCIAL') matchedName = 'Deportes';
        else if (doc.areaOperativa === 'CULTURA Y EVENTOS') matchedName = 'Cultura y eventos';
        else if (doc.areaOperativa === 'AMBIENTE Y PROTECCIÓN ANIMAL') matchedName = 'Ambiente y proteccion animal';
        else if (doc.areaOperativa === 'PRENSA, REDES Y COMUNICACIÓN') matchedName = 'Prensa redes y comunicacion';
      }

      if (matchedName && map.has(matchedName)) {
        map.get(matchedName)!.push(doc);
      }
    });

    return map;
  }, [documents]);

  // Filtered folios
  const filteredFolios = useMemo(() => {
    return OFFICE_SHELF_FOLIOS.filter((folio) => {
      if (shelfFilter !== 'TODOS' && !folio.estanteDefault.includes(shelfFilter)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const docsInFolio = docsByFolio.get(folio.name) || [];
        const matchTitle = folio.name.toLowerCase().includes(q);
        const matchDesc = folio.descripcion.toLowerCase().includes(q);
        const matchShelf = folio.estanteDefault.toLowerCase().includes(q);
        const matchDocs = docsInFolio.some(
          (d) => d.titulo.toLowerCase().includes(q) || d.codigoFolio.toLowerCase().includes(q)
        );
        return matchTitle || matchDesc || matchShelf || matchDocs;
      }
      return true;
    });
  }, [shelfFilter, searchQuery, docsByFolio]);

  // Selected folio details
  const activeFolioInfo = OFFICE_SHELF_FOLIOS.find((f) => f.name === selectedFolioName);
  const activeFolioDocs = selectedFolioName ? docsByFolio.get(selectedFolioName) || [] : [];

  return (
    <div className="space-y-6">
      {/* Institutional Banner */}
      <div className="rounded-3xl bg-[#0D472C] text-[#F9F6EC] p-6 shadow-md border-2 border-emerald-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-amber-400 text-gray-950 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                Oficina Central
              </span>
              <span className="text-xs text-emerald-200">Puerto Esperanza</span>
            </div>
            <h2 className="font-archival text-2xl font-black tracking-tight text-white">
              Estantes y Folios de la Oficina
            </h2>
            <p className="text-xs text-emerald-100 max-w-xl mt-1 leading-relaxed">
              Resguardo y digitalización de los <strong>15 Folios Oficiales</strong> organizados en los estantes físicos de la oficina.
            </p>
          </div>

          {currentUser.role !== 'VISITANTE' && (
            <button
              onClick={() => onOpenDigitizeFolio('Actas y reuniones')}
              className="flex items-center justify-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 px-5 py-3 text-xs font-bold shadow-lg transition cursor-pointer self-start sm:self-auto active:scale-95"
            >
              <Camera className="h-4 w-4 text-emerald-950" />
              <span>Subir y Digitalizar Papel</span>
            </button>
          )}
        </div>
      </div>

      {/* IF A FOLIO IS SELECTED: SHOW ITS PAPERS */}
      {selectedFolioName && activeFolioInfo ? (
        <div className="space-y-4 animate-in fade-in">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between gap-3 border-b border-[#0D472C]/20 pb-3">
            <button
              onClick={() => setSelectedFolioName(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0D472C] hover:text-[#165B3A] transition cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-[#0D472C]/20 shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a todos los Estantes</span>
            </button>

            {currentUser.role !== 'VISITANTE' && (
              <button
                onClick={() => onOpenDigitizeFolio(selectedFolioName)}
                className="flex items-center gap-1.5 rounded-xl bg-[#0D472C] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-[#165B3A] transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar Papel a {selectedFolioName}</span>
              </button>
            )}
          </div>

          {/* Active Folio Header Card */}
          <div className="rounded-2xl border-2 border-[#0D472C]/30 bg-[#FFFDF8] p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0D472C] text-white shadow-xs shrink-0">
                  <FolderOpen className="h-6 w-6 text-amber-300" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-archival text-xl font-black text-[#0D472C]">
                      Folio: {activeFolioInfo.name}
                    </h3>
                    <span className="text-[10px] font-bold bg-[#E8F3ED] text-[#0D472C] px-2 py-0.5 rounded border border-[#0D472C]/20">
                      {activeFolioDocs.length} papeles archivados
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {activeFolioInfo.descripcion}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-900">
                    <MapPin className="h-3.5 w-3.5 text-[#0D472C]" />
                    <span>Ubicación física: <strong>{activeFolioInfo.estanteDefault}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List of Papers inside this Folio */}
          {activeFolioDocs.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#0D472C]/20 bg-white p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h4 className="font-archival mt-3 text-base font-bold text-gray-700">
                Este folio físico aún no tiene papeles digitalizados
              </h4>
              <p className="mt-1 text-xs text-gray-500 max-w-md mx-auto">
                Tome los papeles de la carpeta en el estante y súbalos con foto o escaneo digital.
              </p>
              {currentUser.role !== 'VISITANTE' && (
                <button
                  onClick={() => onOpenDigitizeFolio(selectedFolioName)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0D472C] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#165B3A] transition cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span>Digitalizar Primer Papel Ahora</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeFolioDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-[#0D472C]/20 bg-white p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Top tag & Hoja */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[10px] font-bold bg-[#E8F3ED] text-[#0D472C] px-2 py-0.5 rounded border border-[#0D472C]/20">
                        {doc.numeroHoja || doc.codigoFolio}
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {doc.fecha}
                      </span>
                    </div>

                    {/* Paper Photo Thumbnail (if available) */}
                    {doc.fotoUrl ? (
                      <div 
                        onClick={() => setSelectedPaperPreview(doc)}
                        className="relative mb-3 h-36 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer group"
                      >
                        <img
                          src={doc.fotoUrl}
                          alt={doc.titulo}
                          className="h-full w-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                          <Eye className="h-4 w-4 mr-1" /> Ver Hoja Completa
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3 h-20 w-full rounded-xl border border-dashed border-gray-200 bg-[#FAF7F0] flex items-center justify-center text-gray-400 text-xs">
                        <FileText className="h-5 w-5 mr-1 text-[#0D472C]/40" />
                        <span>Documento Manuscrito / Archivo</span>
                      </div>
                    )}

                    <h4 className="font-bold text-sm text-gray-900 leading-snug mb-1">
                      {doc.titulo}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {doc.descripcion}
                    </p>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-gray-500 truncate">
                      Por: {doc.autor}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onPrintFolioLabel(doc)}
                        title="Imprimir Rótulo QR para la Carpeta"
                        className="p-1.5 rounded-lg bg-emerald-50 text-[#0D472C] hover:bg-emerald-100 transition cursor-pointer"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onViewDocDetail(doc)}
                        className="px-2.5 py-1 rounded-lg bg-[#0D472C] text-white hover:bg-[#165B3A] transition font-bold text-[11px] cursor-pointer"
                      >
                        Ficha
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* OVERVIEW OF ALL 15 PHYSICAL FOLIOS ON THE SHELVES */
        <div className="space-y-5">
          {/* Shelf Filters & Search Bar */}
          <div className="rounded-2xl border border-[#0D472C]/20 bg-white p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar entre los 15 folios..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D472C]"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>

            {/* Quick shelf selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-gray-500 shrink-0">Filtrar Estante:</span>
              {['TODOS', 'Estante 1', 'Estante 2', 'Estante 3', 'Estante 4', 'Estante 5'].map((shelf) => (
                <button
                  key={shelf}
                  onClick={() => setShelfFilter(shelf)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                    shelfFilter === shelf
                      ? 'bg-[#0D472C] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {shelf}
                </button>
              ))}
            </div>
          </div>

          {/* THE 15 FOLIOS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFolios.map((folio, idx) => {
              const docs = docsByFolio.get(folio.name) || [];
              const hasDocs = docs.length > 0;

              return (
                <div
                  key={folio.id}
                  className="rounded-2xl border-2 border-[#0D472C]/20 bg-white shadow-xs hover:shadow-md hover:border-[#0D472C] transition p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top shelf & count badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#0D472C] bg-[#E8F3ED] px-2.5 py-0.5 rounded-full border border-[#0D472C]/20">
                        <MapPin className="h-3 w-3" />
                        <span>{folio.estanteDefault}</span>
                      </span>

                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          hasDocs
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {docs.length} papeles
                      </span>
                    </div>

                    {/* Folio Name and Icon */}
                    <div className="flex items-start gap-3 mb-2">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0D472C] text-[#F9F6EC] shadow-xs shrink-0">
                        <Folder className="h-5 w-5 text-amber-300" />
                      </span>
                      <div>
                        <h3 className="font-archival text-base font-black text-[#0D472C] uppercase tracking-wide leading-tight">
                          {folio.name}
                        </h3>
                        <span className="text-[10px] uppercase font-bold text-gray-400">
                          {folio.categoriaTipo === 'OPERATIVO' ? 'Rama Operativa' : 'Rama Administrativa'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mt-2 mb-4 leading-relaxed">
                      {folio.descripcion}
                    </p>
                  </div>

                  {/* Actions for this Folio */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedFolioName(folio.name)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FAF7F0] hover:bg-[#eae6db] text-[#0D472C] text-xs font-bold border border-[#0D472C]/20 transition cursor-pointer"
                    >
                      <span>Abrir Folio</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    {currentUser.role !== 'VISITANTE' && (
                      <button
                        onClick={() => onOpenDigitizeFolio(folio.name)}
                        title={`Subir y digitalizar papel en ${folio.name}`}
                        className="flex items-center gap-1 py-2 px-3 rounded-xl bg-[#0D472C] hover:bg-[#165B3A] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <Camera className="h-3.5 w-3.5 text-amber-300" />
                        <span>Subir</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL PREVIEW MODAL FOR A DIGITIZED PAPER */}
      {selectedPaperPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-5 shadow-2xl border-2 border-[#0D472C] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase bg-[#E8F3ED] text-[#0D472C] px-2 py-0.5 rounded font-mono">
                  {selectedPaperPreview.numeroHoja || selectedPaperPreview.codigoFolio}
                </span>
                <h3 className="font-bold text-base text-gray-900 mt-1">
                  {selectedPaperPreview.titulo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPaperPreview(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedPaperPreview.fotoUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-300 bg-gray-50 mb-4 max-h-[60vh] flex items-center justify-center">
                <img
                  src={selectedPaperPreview.fotoUrl}
                  alt={selectedPaperPreview.titulo}
                  className="w-full object-contain max-h-[58vh]"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-3 bg-[#FAF7F0] p-3 rounded-xl">
              <div><strong>Folio:</strong> {selectedPaperPreview.folioNombre || 'Archivo General'}</div>
              <div><strong>Estante:</strong> {selectedPaperPreview.estanteFisico}</div>
              <div><strong>Fecha:</strong> {selectedPaperPreview.fecha} ({selectedPaperPreview.anio})</div>
              <div><strong>Responsable:</strong> {selectedPaperPreview.autor}</div>
            </div>

            {selectedPaperPreview.descripcion && (
              <p className="text-xs text-gray-600 mb-4">
                <strong>Descripción:</strong> {selectedPaperPreview.descripcion}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => {
                  onPrintFolioLabel(selectedPaperPreview);
                  setSelectedPaperPreview(null);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 px-4 py-2 text-xs font-bold transition cursor-pointer"
              >
                <QrCode className="h-4 w-4" />
                <span>Imprimir Rótulo QR</span>
              </button>
              <button
                onClick={() => setSelectedPaperPreview(null)}
                className="rounded-xl bg-gray-200 hover:bg-gray-300 px-4 py-2 text-xs font-bold text-gray-800 transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
