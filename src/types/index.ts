export type OperativeArea = 
  | 'DEPORTES Y ACCIÓN SOCIAL'
  | 'CULTURA Y EVENTOS'
  | 'AMBIENTE Y PROTECCIÓN ANIMAL'
  | 'PRENSA, REDES Y COMUNICACIÓN'
  | 'SALUD Y BIENESTAR'
  | 'NIÑEZ Y ADOLESCENCIA'
  | 'TECNOLOGÍA Y MEDIOS';

export type AdministrativeType =
  | 'ACTAS Y REUNIONES'
  | 'INVENTARIO'
  | 'EVENTOS'
  | 'CARTELES'
  | 'PROYECTOS'
  | 'NOTAS Y RESOLUCIONES'
  | 'PRESUPUESTO, RECAUDACIÓN Y BALANCE'
  | 'INFORME'
  | 'PLANIFICACIÓN'
  | 'REGISTRO';

export type OfficeFolioCategory =
  | 'Actas y reuniones'
  | 'Inventario'
  | 'Eventos'
  | 'Carteles'
  | 'Proyectos'
  | 'Notas y resolucion'
  | 'Presupuesto recaudacion y balance'
  | 'Informe'
  | 'Planificacion'
  | 'Registro'
  | 'Deportes'
  | 'Accion social'
  | 'Cultura y eventos'
  | 'Ambiente y proteccion animal'
  | 'Prensa redes y comunicacion';

export interface OfficeFolioInfo {
  id: string;
  name: OfficeFolioCategory;
  estanteDefault: string;
  color: string;
  icon: string;
  descripcion: string;
  categoriaTipo: 'ADMINISTRATIVO' | 'OPERATIVO';
}

export type UserRole = 
  | 'ADMIN' 
  | 'CARGADOR_DATOS' 
  | 'SOLICITANTE' 
  | 'VISITANTE';

export interface UserProfile {
  id: string;
  username: string; // e.g. "49993070" for Almada Eduardo Thomas
  passwordPin: string; // PIN / password for office access
  name: string;
  role: UserRole;
  assignedArea?: OperativeArea; // Required for CARGADOR_DATOS & SOLICITANTE
  position: string;
  telefono?: string;
  activo: boolean;
  creadoEn: string;
}

export interface ArchiveDocument {
  id: string;
  codigoFolio: string; // e.g. "FOLIO-ACT-2024-001"
  titulo: string;
  folioNombre?: OfficeFolioCategory; // uno de los 15 folios de los estantes
  numeroHoja?: string; // e.g. "Hoja 01", "Folio 12"
  areaOperativa: OperativeArea;
  tipoAdministrativo: AdministrativeType;
  subtipoDetalle?: string; // Sub-item from WhatsApp list
  anio: number;
  estanteFisico: string; // e.g. "Estante 1 - Balda A"
  fecha: string;
  autor: string;
  descripcion: string;
  soporteFisico: 'Original Manuscrito' | 'Planilla Impresa' | 'Expediente Cosido' | 'Carpeta Colgante' | 'Fotografía Papel' | 'Afiche / Cartel';
  visibilidad: 'Público' | 'Uso Interno' | 'Confidencial Coordinación';
  fotoUrl?: string; // Foto escaneada / digitalizada del papel
  chicosVinculados?: string[]; // IDs de fichas
  etiquetas: string[];
  creadoEn: string;
}

export interface KidProfile {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  edad: number;
  genero: string;
  tutorNombre: string;
  tutorParentesco: string;
  tutorTelefono: string;
  direccion: string;
  autorizacionFirmada: boolean;
  folioAutorizacion?: string;
  areasParticipa: OperativeArea[];
  talleresActuales: string[];
  alergiasMedicas: string;
  fechaInscripcion: string;
  asistenciasMes: number;
  estado: 'Activo' | 'En Pausa' | 'Egresado';
  fotoUrl?: string;
  notas: string;
}

export interface InventoryItem {
  id: string;
  codigo: string;
  nombre: string;
  areaOperativa: OperativeArea;
  categoria: string;
  stockTotal: number;
  stockDisponible: number;
  estanteUbicacion: string;
  estadoConservacion: 'Excelente' | 'Bueno' | 'Regular' | 'A Reparar';
  valorEstimado?: number;
  observaciones: string;
}

export interface MaterialLoan {
  id: string;
  itemId: string;
  itemNombre: string;
  areaOperativa: OperativeArea;
  cantidad: number;
  solicitanteNombre: string;
  solicitanteDni: string;
  solicitanteTelefono: string;
  fechaPrestamo: string;
  fechaDevolucionPactada: string;
  fechaDevolucionReal?: string;
  estado: 'En Curso' | 'Devuelto' | 'Atrasado';
  firmaRetiroUrl: string; // data URL base64
  firmaDevolucionUrl?: string; // data URL base64
  observacionesSalida: string;
  observacionesDevolucion?: string;
}

export interface AreaRequest {
  id: string;
  codigo: string;
  areaSolicitante: OperativeArea;
  tipoSolicitud: 'Material de Inventario' | 'Diseño e Impresión Cartel' | 'Partida Presupuestaria' | 'Uso de Espacio / Salón' | 'Equipamiento Técnico';
  solicitanteNombre: string;
  fechaSolicitud: string;
  urgencia: 'Baja' | 'Media' | 'Alta' | 'Urgente';
  descripcion: string;
  cantidadEstimada?: string;
  estado: 'Pendiente' | 'Aprobado' | 'Entregado' | 'Rechazado';
  respuestaAdmin?: string;
  fechaRespuesta?: string;
}

export interface BudgetRecord {
  id: string;
  fecha: string;
  tipo: 'Ingreso' | 'Gasto';
  categoria: 'Partida Institucional Central' | 'Fondo Cooperador Comunitario' | 'Compra Insumos Deporte' | 'Materiales Cultura y Arte' | 'Botiquín e Higiene' | 'Hardware y Conectividad' | 'Refrigerio Talleres' | 'Impresión y Carteles Difusión' | 'Ambiente y Rescate Animal';
  areaOperativa: OperativeArea | 'GENERAL';
  concepto: string;
  monto: number;
  folioComprobante: string;
  estanteFactura: string;
  aprobadoPor: string;
}

export interface OfficeEvent {
  id: string;
  titulo: string;
  areaOperativa: OperativeArea;
  fecha: string;
  hora: string;
  lugar: string;
  descripcion: string;
  responsable: string;
  esPublico: boolean;
  aficheUrl?: string;
  participantesEsperados: number;
}
