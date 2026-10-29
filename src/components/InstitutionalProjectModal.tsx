import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  Key, 
  Camera, 
  FolderArchive, 
  Printer, 
  Download, 
  X,
  Calendar,
  Layers,
  MapPin,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface InstitutionalProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstitutionalProjectModal: React.FC<InstitutionalProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'DOCUMENTO' | 'EQUIPO' | 'SECTORES' | 'SEGURIDAD'>('DOCUMENTO');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-5 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#FFFDF8] border-2 border-[#0D472C] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Top Header with Seal and Actions */}
        <div className="bg-[#0D472C] text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b-2 border-emerald-950">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Building2 className="h-6 w-6 text-[#0D472C]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-gray-950 px-2 py-0.5 rounded uppercase">
                  Proyecto Institucional Oficial
                </span>
                <span className="text-xs text-emerald-200">Puerto Esperanza • Octubre de 2026</span>
              </div>
              <h2 className="font-archival text-lg sm:text-2xl font-black text-[#F9F6EC] leading-tight">
                CENTRO DE MEDIOS Y ARCHIVOS
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Creación, Acondicionamiento y Puesta en Funcionamiento de la Oficina
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border border-emerald-700"
              title="Imprimir documento del proyecto"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-xl hover:bg-emerald-900 transition cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside the Modal */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-gray-200 bg-emerald-50/40 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('DOCUMENTO')}
            className={`pb-3 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'DOCUMENTO'
                ? 'border-[#0D472C] text-[#0D472C]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Fundamentación y Objetivos</span>
          </button>
          <button
            onClick={() => setActiveTab('EQUIPO')}
            className={`pb-3 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'EQUIPO'
                ? 'border-[#0D472C] text-[#0D472C]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Equipo Responsable (4)</span>
          </button>
          <button
            onClick={() => setActiveTab('SECTORES')}
            className={`pb-3 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'SECTORES'
                ? 'border-[#0D472C] text-[#0D472C]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Sectores de Trabajo</span>
          </button>
          <button
            onClick={() => setActiveTab('SEGURIDAD')}
            className={`pb-3 px-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'SEGURIDAD'
                ? 'border-[#0D472C] text-[#0D472C]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Seguridad, Llaves y Custodia</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-800 leading-relaxed max-h-[70vh]">
          
          {/* TAB 1: DOCUMENTO COMPLETO */}
          {activeTab === 'DOCUMENTO' && (
            <div className="space-y-6">
              {/* Header Details Card */}
              <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Presentado por:</span>
                  <strong className="text-gray-900">Almada Eduardo Thomas</strong>
                  <span className="text-[11px] text-gray-600 block">Junto al equipo fundador</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Equipo de Trabajo:</span>
                  <span className="font-semibold text-gray-800">Pablo González, Renzo Vázquez y Demian</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Observación Inicial:</span>
                  <span className="font-mono font-bold text-[#0D472C]">19 de octubre de 2026</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Destinatarios:</span>
                  <span className="text-gray-700">Autoridades y miembros a cargo de la sede</span>
                </div>
              </div>

              {/* 1. Presentación */}
              <section className="space-y-2">
                <h3 className="font-archival text-sm font-black text-[#0D472C] uppercase tracking-wide border-b border-gray-200 pb-1">
                  1. Presentación del Proyecto
                </h3>
                <p>
                  Por medio del presente documento, nos dirigimos respetuosamente a las autoridades y responsables de la sede con el propósito de solicitar la autorización para la utilización, acondicionamiento y puesta en funcionamiento de una habitación actualmente destinada al almacenamiento de distintos elementos, con el objetivo de transformarla en una oficina institucional denominada <strong>CENTRO DE MEDIOS Y ARCHIVOS</strong>.
                </p>
                <p>
                  La propuesta combina dos modalidades de trabajo: la <strong>conservación física de documentos y elementos</strong> mediante un sistema de archivo e inventario en estanterías rotuladas, y la <strong>digitalización de la información</strong> a través de este sistema web desarrollado por Almada Eduardo Thomas.
                </p>
              </section>

              {/* 2. Antecedentes y Fundamentación */}
              <section className="space-y-2">
                <h3 className="font-archival text-sm font-black text-[#0D472C] uppercase tracking-wide border-b border-gray-200 pb-1">
                  2. Antecedentes y Fundamentación (19 de Octubre de 2026)
                </h3>
                <p>
                  El día <strong>19 de octubre de 2026</strong>, a partir de una observación de la sede desde una perspectiva organizativa y administrativa, comenzamos a identificar distintas posibilidades para mejorar el aprovechamiento de los espacios disponibles.
                </p>
                <p>
                  Se identificó una habitación que actualmente contiene diversos objetos que requieren clasificación, acordando el destino de cada elemento antes de comenzar cualquier modificación.
                </p>
                <p>
                  Actualmente, distintas tareas requieren acceder a documentos, tarjetas de memoria, cámaras, micrófonos, cables y otros materiales que no siempre se encuentran en un lugar fijo, obligando en ocasiones a trasladarse a domicilios particulares. La oficina centraliza el almacenamiento, préstamo con firma digital, devolución y registro inmediato.
                </p>
              </section>

              {/* 4 & 5. Objetivo General y 15 Objetivos Específicos */}
              <section className="space-y-3">
                <h3 className="font-archival text-sm font-black text-[#0D472C] uppercase tracking-wide border-b border-gray-200 pb-1">
                  4. Objetivo General y 5. Objetivos Específicos (15 Acciones)
                </h3>
                <p className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
                  <strong>Objetivo General:</strong> Crear, acondicionar y poner en funcionamiento una oficina institucional denominada Centro de Medios y Archivos, destinada a centralizar la documentación, registrar las actividades, organizar los archivos físicos y digitales, administrar los recursos de uso común y garantizar condiciones adecuadas de conservación, seguridad y control.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    "1. Organizar y clasificar la documentación producida por las distintas áreas.",
                    "2. Crear un archivo físico que conserve originales, copias e informes.",
                    "3. Desarrollar un sistema digital de registro y consulta mediante sitio web.",
                    "4. Mantener inventario de cámaras, micrófonos, cables, tarjetas y herramientas.",
                    "5. Registrar ingresos, egresos, préstamos, devoluciones y movimientos.",
                    "6. Establecer un lugar seguro para conservar equipos de valor y de importancia.",
                    "7. Crear un sistema de identificación y clasificación de documentos y materiales.",
                    "8. Registrar eventos, actividades, reuniones, proyectos, pedidos y resoluciones.",
                    "9. Facilitar elaboración y conservación de actas, informes y balances.",
                    "10. Mejorar la coordinación inter-área mediante procedimientos de consulta.",
                    "11. Aprovechar materiales de la sede para construir muebles, escritorios y estantes.",
                    "12. Reducir la dispersión de recursos y la falta de un lugar fijo de almacenamiento.",
                    "13. Promover hábitos de orden, cuidado, responsabilidad y conservación común.",
                    "14. Garantizar que documentos y equipos no queden expuestos a pérdidas o extravíos.",
                    "15. Establecer un sistema de trabajo que se mantenga y mejore en el tiempo."
                  ].map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-gray-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-gray-800">{obj}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: EQUIPO RESPONSABLE */}
          {activeTab === 'EQUIPO' && (
            <div className="space-y-4">
              <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-200/80">
                <h3 className="font-archival text-sm font-bold text-gray-900 mb-1">
                  6. Integrantes y Responsables del Proyecto
                </h3>
                <p className="text-gray-600">
                  La organización inicial del Centro de Medios y Archivos está a cargo de un equipo reducido de cuatro personas, garantizando una estructura de trabajo ordenada y sin dispersión de responsabilidades.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl border-2 border-[#0D472C] bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-amber-400 text-gray-950 px-2 py-0.5 rounded uppercase">
                      Coordinación & Desarrollo Web
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Almada Eduardo Thomas</h4>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Desarrollador de la plataforma web institucional, diseño de la estructura digital, custodia general y administración de la oficina.
                  </p>
                  <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">
                    D.N.I. 49993070 • Rol: ADMIN
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-emerald-100 text-[#0D472C] px-2 py-0.5 rounded uppercase">
                      Equipo Fundador
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Pablo González</h4>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Responsable de acondicionamiento físico, armado de estantes con materiales de la sede, registro e inventario patrimonial.
                  </p>
                  <span className="font-mono text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded mt-2 inline-block">
                    Usuario: pablo.gonzalez • Rol: CARGADOR_DATOS
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-emerald-100 text-[#0D472C] px-2 py-0.5 rounded uppercase">
                      Equipo Fundador
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Renzo Vázquez</h4>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Responsable de producción técnica, equipos audiovisuales, cámaras, micrófonos, cables y control de condiciones de devolución.
                  </p>
                  <span className="font-mono text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded mt-2 inline-block">
                    Usuario: renzo.vazquez • Rol: CARGADOR_DATOS
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-emerald-100 text-[#0D472C] px-2 py-0.5 rounded uppercase">
                      Equipo Fundador
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Demian</h4>
                  <p className="text-gray-500 text-[11px] mt-1">
                    Responsable de clasificación y archivo documental físico, resguardo seguro de elementos de valor y custodia de llaves.
                  </p>
                  <span className="font-mono text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded mt-2 inline-block">
                    Usuario: demian • Rol: CARGADOR_DATOS
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-950">
                <span className="font-bold block mb-1">Previsión Institucional:</span>
                La cantidad inicial es de cuatro integrantes, con la posibilidad de incorporar una quinta persona si las necesidades operativas lo justifican y las autoridades lo autorizan.
              </div>
            </div>
          )}

          {/* TAB 3: SECTORES DE TRABAJO */}
          {activeTab === 'SECTORES' && (
            <div className="space-y-4">
              <h3 className="font-archival text-sm font-bold text-[#0D472C] uppercase">
                7. Sectores de Trabajo del Centro de Medios y Archivos
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-emerald-700" />
                    <span>7.1. Área de Documentación Institucional</span>
                  </h4>
                  <p className="text-gray-600 text-[11px]">
                    Actas de reuniones, resoluciones institucionales, notas y comunicaciones formales, pedidos, informes de gestión, proyectos presentados, planificaciones de actividades, autorizaciones y constancias administrativas.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-amber-700" />
                    <span>7.2. Área de Eventos y Actividades</span>
                  </h4>
                  <p className="text-gray-600 text-[11px]">
                    Cronogramas, objetivos y planificación, responsables y áreas participantes, solicitudes, listas de materiales utilizados, informes posteriores, fotografías y comprobantes.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2 mb-1">
                    <Camera className="h-4 w-4 text-blue-700" />
                    <span>7.3. Área de Medios y Producción Audiovisual</span>
                  </h4>
                  <p className="text-gray-600 text-[11px]">
                    Cámaras fotográficas, micrófonos, tarjetas de memoria, cables de conexión, baterías y cargadores, trípodes y soportes, accesorios de iluminación, equipos de audio y video. Cada retiro detalla quién retira, actividad, fecha y condiciones al regresar.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2 mb-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-800" />
                    <span>7.4. Área de Administración y Contabilidad</span>
                  </h4>
                  <p className="text-gray-600 text-[11px]">
                    Presupuestos, comprobantes de gastos, facturas y recibos, rendiciones de cuentas, balances y registros de ingresos y egresos, sin sustituir las funciones de tesorería ni autoridades de fondos.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
                  <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2 mb-1">
                    <FolderArchive className="h-4 w-4 text-purple-700" />
                    <span>7.5. Área de Archivo Digital</span>
                  </h4>
                  <p className="text-gray-600 text-[11px]">
                    Sitio web interactivo desarrollado por Almada Eduardo Thomas con permisos diferenciados, copias de seguridad automáticas, sincronización en tiempo real y resguardo estricto de la privacidad de la información institucional.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEGURIDAD, LLAVES Y CUSTODIA */}
          {activeTab === 'SEGURIDAD' && (
            <div className="space-y-4">
              <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-200/80">
                <h3 className="font-archival text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Key className="h-4 w-4 text-amber-600" />
                  <span>10. Seguridad y Resguardo de los Elementos</span>
                </h3>
                <p className="text-gray-600">
                  La seguridad del espacio constituye uno de los aspectos centrales de la propuesta para resguardar documentación relevante, equipos de comunicación y materiales de valor.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  "1. Revisar el estado de la puerta, marco, ventanas y puntos de acceso.",
                  "2. Solicitar autorización para cambiar o mejorar la cerradura de la puerta.",
                  "3. Establecer un sistema de custodia de llaves con responsables identificados.",
                  "4. Incorporar muebles o cajas de madera con cerraduras y candados para guardar objetos específicos.",
                  "5. Disponer de estantes y compartimentos diferenciados según el tipo de material.",
                  "6. Guardar los equipos electrónicos en lugares protegidos de la humedad, polvo y golpes.",
                  "7. Mantener un inventario actualizado de los elementos de mayor valor.",
                  "8. Registrar los retiros y las devoluciones de equipos con firmas digitales.",
                  "9. Evitar que documentos reservados permanezcan expuestos al alcance de personas no autorizadas."
                ].map((medida, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200">
                    <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="font-medium text-gray-800">{medida}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-800">
                <h4 className="font-bold text-amber-300 text-xs mb-1 uppercase tracking-wider">
                  Distinción de Titularidad Obligatoria (Sección 9)
                </h4>
                <p className="text-[11px] text-emerald-100 leading-relaxed">
                  El inventario distingue expresamente entre:
                  <br />• <strong>Propiedad Institucional:</strong> Bienes que pertenecen a la organización.
                  <br />• <strong>Material Prestado por Integrante:</strong> Equipos aportados para actividades con su dueño identificado.
                  <br />• <strong>Custodia Temporal:</strong> Elementos en tránsito. Ningún elemento se considera propiedad institucional únicamente por estar en la oficina.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#FAF7F0] p-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-[11px] text-gray-500">
            Centro de Medios y Archivos • Documento Oficial Registrado • Octubre 2026
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0D472C] hover:bg-[#165B3A] text-white font-bold transition cursor-pointer shadow-xs"
          >
            Cerrar Proyecto
          </button>
        </div>

      </div>
    </div>
  );
};
