import React, { useState } from 'react';
import { X, DollarSign, Check, AlertCircle, MapPin } from 'lucide-react';
import { BudgetRecord, OperativeArea, UserProfile } from '../types';
import { OPERATIVE_AREAS } from '../data/mockData';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSubmit: (record: BudgetRecord) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmit,
}) => {
  const [tipo, setTipo] = useState<'Ingreso' | 'Gasto'>('Gasto');
  const [monto, setMonto] = useState<number>(50000);
  const [areaOperativa, setAreaOperativa] = useState<OperativeArea | 'GENERAL'>('DEPORTES Y ACCIÓN SOCIAL');
  const [categoria, setCategoria] = useState<BudgetRecord['categoria']>('Partida Institucional Central');
  const [concepto, setConcepto] = useState('');
  const [folioComprobante, setFolioComprobante] = useState('');
  const [estanteFactura, setEstanteFactura] = useState('Caja Facturas 2024 - Sobre 10');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monto <= 0) {
      setErrorMsg('El monto debe ser superior a cero.');
      return;
    }
    if (!concepto.trim()) {
      setErrorMsg('Debe indicar el concepto o detalle del movimiento.');
      return;
    }
    if (!folioComprobante.trim()) {
      setErrorMsg('OBLIGATORIO: Debe ingresar el folio o número de factura físico.');
      return;
    }
    if (!estanteFactura.trim()) {
      setErrorMsg('OBLIGATORIO: Debe indicar el estante/caja física donde se archiva el comprobante.');
      return;
    }

    const record: BudgetRecord = {
      id: 'bud-' + Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      tipo,
      categoria,
      areaOperativa,
      concepto: concepto.trim(),
      monto,
      folioComprobante: folioComprobante.trim(),
      estanteFactura: estanteFactura.trim(),
      aprobadoPor: currentUser.name,
    };

    onSubmit(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-[#FFFDF8] border-2 border-[#0D472C] shadow-2xl p-6 my-8">
        <div className="flex items-center justify-between border-b border-[#0D472C]/20 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D472C] text-[#F9F6EC]">
              <DollarSign className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-archival text-lg font-bold text-[#0D472C]">
                Asiento Contable de Balance y Presupuesto
              </h3>
              <p className="text-xs text-[#162B1F]/70">
                Resguardo con comprobante y estantería física
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tipo de Asiento *
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as 'Ingreso' | 'Gasto')}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-[#0D472C] focus:ring-2 focus:ring-[#0D472C]"
              >
                <option value="Gasto">Egreso / Gasto</option>
                <option value="Ingreso">Ingreso / Recaudación / Partida</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Monto en Pesos ($ ARS) *
              </label>
              <input
                type="number"
                min={1}
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:ring-2 focus:ring-[#0D472C]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Área Imputada *
              </label>
              <select
                value={areaOperativa}
                onChange={(e) => setAreaOperativa(e.target.value as OperativeArea | 'GENERAL')}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#0D472C]"
              >
                <option value="GENERAL">GENERAL / TODAS LAS ÁREAS</option>
                {OPERATIVE_AREAS.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as BudgetRecord['categoria'])}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-[#0D472C]"
              >
                <option value="Partida Institucional Central">Partida Institucional Central</option>
                <option value="Fondo Cooperador Comunitario">Fondo Cooperador Comunitario</option>
                <option value="Compra Insumos Deporte">Compra Insumos Deporte</option>
                <option value="Materiales Cultura y Arte">Materiales Cultura y Arte</option>
                <option value="Botiquín e Higiene">Botiquín e Higiene</option>
                <option value="Hardware y Conectividad">Hardware y Conectividad</option>
                <option value="Refrigerio Talleres">Refrigerio Talleres</option>
                <option value="Impresión y Carteles Difusión">Impresión y Carteles Difusión</option>
                <option value="Ambiente y Rescate Animal">Ambiente y Rescate Animal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Concepto / Detalle de la factura o recibo *
            </label>
            <input
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Factura B por 15 pelotas de básquet y 2 silbatos"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-[#0D472C]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#E8F3ED] p-3 rounded-xl border border-[#0D472C]/30">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Folio / N° Factura Físico *
              </label>
              <input
                type="text"
                value={folioComprobante}
                onChange={(e) => setFolioComprobante(e.target.value)}
                placeholder="FAC-B-0004-001298"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-mono font-bold text-[#0D472C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-[#0D472C]" />
                Estante / Caja Física *
              </label>
              <input
                type="text"
                value={estanteFactura}
                onChange={(e) => setEstanteFactura(e.target.value)}
                placeholder="Caja Facturas 2024 - Sobre 10"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs"
                required
              />
            </div>
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
              Asentar en Balance Oficial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
