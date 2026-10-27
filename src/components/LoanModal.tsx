import React, { useState } from 'react';
import { X, PackageCheck, AlertCircle, PenTool, Check } from 'lucide-react';
import { InventoryItem, MaterialLoan, OperativeArea, UserProfile } from '../types';
import { OPERATIVE_AREAS } from '../data/mockData';
import { SignatureModal } from './SignatureModal';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  currentUser: UserProfile;
  onSubmitLoan: (loan: MaterialLoan) => void;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  inventory,
  currentUser,
  onSubmitLoan,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(inventory[0]?.id || '');
  const [cantidad, setCantidad] = useState<number>(1);
  const [solicitanteNombre, setSolicitanteNombre] = useState<string>(currentUser.name);
  const [solicitanteDni, setSolicitanteDni] = useState<string>('');
  const [solicitanteTelefono, setSolicitanteTelefono] = useState<string>('');
  const [areaOperativa, setAreaOperativa] = useState<OperativeArea>(
    currentUser.assignedArea || 'DEPORTES Y ACCIÓN SOCIAL'
  );
  const [fechaDevolucionPactada, setFechaDevolucionPactada] = useState<string>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [observacionesSalida, setObservacionesSalida] = useState<string>('');
  const [firmaUrl, setFirmaUrl] = useState<string>('');
  const [isSignModalOpen, setIsSignModalOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const currentItem = inventory.find((i) => i.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) {
      setErrorMsg('Debe seleccionar un material del inventario.');
      return;
    }
    if (cantidad <= 0 || cantidad > currentItem.stockDisponible) {
      setErrorMsg(`Cantidad inválida. Stock disponible: ${currentItem.stockDisponible}`);
      return;
    }
    if (!solicitanteNombre.trim()) {
      setErrorMsg('Indique el nombre de la persona responsable del préstamo.');
      return;
    }
    if (!firmaUrl) {
      setErrorMsg('OBLIGATORIO: Debe asentar la firma digital del solicitante.');
      return;
    }

    const newLoan: MaterialLoan = {
      id: 'loan-' + Date.now(),
      itemId: currentItem.id,
      itemNombre: currentItem.nombre,
      areaOperativa,
      cantidad,
      solicitanteNombre: solicitanteNombre.trim(),
      solicitanteDni: solicitanteDni.trim() || 'S/D',
      solicitanteTelefono: solicitanteTelefono.trim() || 'S/D',
      fechaPrestamo: new Date().toISOString().split('T')[0],
      fechaDevolucionPactada,
      estado: 'En Curso',
      firmaRetiroUrl: firmaUrl,
      observacionesSalida: observacionesSalida.trim(),
    };

    onSubmitLoan(newLoan);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="w-full max-w-xl rounded-2xl bg-[#FFFDF8] border-2 border-[#0D472C] shadow-2xl p-6 my-8">
          <div className="flex items-center justify-between border-b border-[#0D472C]/20 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D472C] text-[#F9F6EC]">
                <PackageCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-archival text-lg font-bold text-[#0D472C]">
                  Acta de Préstamo de Material
                </h3>
                <p className="text-xs text-[#162B1F]/70">
                  Control de stock e inventario con firma de puño digital
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Seleccionar Material de Inventario *
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => {
                  setSelectedItemId(e.target.value);
                  setCantidad(1);
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0D472C]"
                required
              >
                {inventory.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    disabled={item.stockDisponible <= 0}
                  >
                    {item.codigo} - {item.nombre} (Disponibles: {item.stockDisponible} de {item.stockTotal})
                  </option>
                ))}
              </select>
              {currentItem && (
                <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded">
                  <span>📍 Ubicación: {currentItem.estanteUbicacion}</span>
                  <span className="font-bold text-[#0D472C]">
                    Área: {currentItem.areaOperativa}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Cantidad a prestar *
                </label>
                <input
                  type="number"
                  min={1}
                  max={currentItem ? currentItem.stockDisponible : 1}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D472C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Área Destino / Taller *
                </label>
                <select
                  value={areaOperativa}
                  onChange={(e) => setAreaOperativa(e.target.value as OperativeArea)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0D472C]"
                >
                  {OPERATIVE_AREAS.map((a) => (
                    <option key={a.key} value={a.key}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nombre Solicitante / Profe *
                </label>
                <input
                  type="text"
                  value={solicitanteNombre}
                  onChange={(e) => setSolicitanteNombre(e.target.value)}
                  placeholder="Prof. Juan Pérez"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D472C]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  DNI del Solicitante
                </label>
                <input
                  type="text"
                  value={solicitanteDni}
                  onChange={(e) => setSolicitanteDni(e.target.value)}
                  placeholder="34.123.456"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D472C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Fecha Devolución Pactada
                </label>
                <input
                  type="date"
                  value={fechaDevolucionPactada}
                  onChange={(e) => setFechaDevolucionPactada(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D472C]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Destino / Actividad del Préstamo
              </label>
              <input
                type="text"
                value={observacionesSalida}
                onChange={(e) => setObservacionesSalida(e.target.value)}
                placeholder="Ej: Torneo de fútbol en cancha de tierra / Muestra en plaza central"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D472C]"
              />
            </div>

            {/* Digital Signature Box */}
            <div className="rounded-xl border border-[#0D472C]/40 bg-[#FAF7F0] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0D472C] flex items-center gap-1.5">
                  <PenTool className="h-4 w-4" />
                  FIRMA DIGITAL DE RECEPCIÓN Y CONFORMIDAD *
                </span>
                <button
                  type="button"
                  onClick={() => setIsSignModalOpen(true)}
                  className="rounded bg-[#0D472C] px-3 py-1 text-xs font-bold text-white hover:bg-[#165B3A] transition cursor-pointer"
                >
                  {firmaUrl ? 'Cambiar / Re-firmar' : 'Firmar en Pantalla'}
                </button>
              </div>

              {firmaUrl ? (
                <div className="flex items-center gap-4 bg-white p-2.5 rounded-lg border border-[#0D472C]/30">
                  <img
                    src={firmaUrl}
                    alt="Firma Digital"
                    className="h-14 max-w-[200px] object-contain border border-gray-200 rounded p-1 bg-[#FFFDF8]"
                  />
                  <div className="text-xs text-gray-700">
                    <p className="font-bold text-[#0D472C]">✓ Firma asentada correctamente</p>
                    <p className="text-[11px] text-gray-500">
                      Responsable: {solicitanteNombre || 'Sin nombre'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-amber-800 italic bg-amber-50 p-2.5 rounded border border-amber-200">
                  Presione "Firmar en Pantalla" para asentar la firma obligatoria antes de autorizar la salida del material.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#0D472C]/20">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#0D472C] px-5 py-2 text-xs font-bold text-[#F9F6EC] hover:bg-[#165B3A] shadow-md transition cursor-pointer"
              >
                <Check className="h-4 w-4" />
                Registrar Préstamo Oficial
              </button>
            </div>
          </form>
        </div>
      </div>

      <SignatureModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSave={(url) => {
          setFirmaUrl(url);
          setErrorMsg('');
        }}
        title="Firma Digital de Préstamo de Material"
        subtitle="Constancia de resguardo y compromiso de devolución"
        signerName={solicitanteNombre || 'Solicitante'}
      />
    </>
  );
};
