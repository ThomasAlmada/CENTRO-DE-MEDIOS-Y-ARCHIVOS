import { UserProfile, OfficeFolioCategory, ArchiveDocument, OperativeArea } from '../types';

/**
 * Role-Based Access Control (RBAC) & Segregation of Duties for the Office
 * "NO TODOS VEN TODO, solo el admin y secretarios o encargados de la oficina nomas,
 * y no todos pueden ver todo también, el de prensa solo ve y hace lo que está habilitado
 * para su área y así sucesivamente. Y si es de rol visitante, no esté en alguna área."
 */

export const isSecretarioOrAdmin = (user?: UserProfile | null): boolean => {
  if (!user) return false;
  return user.role === 'ADMIN' || user.role === 'SECRETARIO';
};

export const getAllowedFoliosForUser = (user: UserProfile): OfficeFolioCategory[] => {
  // 1. Admin and Secretarios see all 15 folios without restriction
  if (isSecretarioOrAdmin(user)) {
    return [
      'Actas y reuniones',
      'Inventario',
      'Eventos',
      'Carteles',
      'Proyectos',
      'Notas y resolucion',
      'Presupuesto recaudacion y balance',
      'Informe',
      'Planificacion',
      'Registro',
      'Deportes',
      'Accion social',
      'Cultura y eventos',
      'Ambiente y proteccion animal',
      'Prensa redes y comunicacion',
    ];
  }

  // 2. Visitante: Public folios only (talleres, eventos, carteles de difusión)
  if (user.role === 'VISITANTE') {
    return [
      'Carteles',
      'Eventos',
      'Cultura y eventos',
      'Deportes',
    ];
  }

  // 3. Cargador de Datos & Solicitante: STRICT SEGREGATION BY OPERATIVE AREA
  const area = user.assignedArea;

  switch (area) {
    case 'PRENSA, REDES Y COMUNICACIÓN':
      return [
        'Prensa redes y comunicacion',
        'Carteles',
        'Eventos',
        'Informe',
        'Planificacion',
      ];

    case 'DEPORTES Y ACCIÓN SOCIAL':
      return [
        'Deportes',
        'Accion social',
        'Eventos',
        'Inventario',
        'Informe',
      ];

    case 'CULTURA Y EVENTOS':
      return [
        'Cultura y eventos',
        'Eventos',
        'Carteles',
        'Proyectos',
        'Informe',
      ];

    case 'AMBIENTE Y PROTECCIÓN ANIMAL':
      return [
        'Ambiente y proteccion animal',
        'Proyectos',
        'Eventos',
        'Informe',
      ];

    case 'SALUD Y BIENESTAR':
      return [
        'Eventos',
        'Informe',
        'Proyectos',
        'Inventario',
      ];

    case 'NIÑEZ Y ADOLESCENCIA':
      return [
        'Deportes',
        'Cultura y eventos',
        'Eventos',
        'Informe',
        'Proyectos',
      ];

    case 'TECNOLOGÍA Y MEDIOS':
      return [
        'Prensa redes y comunicacion',
        'Inventario',
        'Proyectos',
        'Informe',
      ];

    default:
      return ['Informe', 'Eventos', 'Carteles'];
  }
};

export const canUserAccessFolio = (user: UserProfile, folioName: OfficeFolioCategory): boolean => {
  const allowed = getAllowedFoliosForUser(user);
  return allowed.includes(folioName);
};

export const canUserUploadToFolio = (user: UserProfile, folioName: OfficeFolioCategory): boolean => {
  // Visitante cannot upload anything
  if (user.role === 'VISITANTE') return false;

  // Admin & Secretario can upload to all 15 folios
  if (isSecretarioOrAdmin(user)) return true;

  // Solicitante role is for requesting items, not archiving official shelf papers
  if (user.role === 'SOLICITANTE') return false;

  // Cargador de datos: only allowed to upload to their area-authorized folios
  return canUserAccessFolio(user, folioName);
};

export const canUserViewDocument = (user: UserProfile, doc: ArchiveDocument): boolean => {
  // Admin & Secretario can view everything
  if (isSecretarioOrAdmin(user)) return true;

  // Visitante only sees public documents
  if (user.role === 'VISITANTE') {
    return doc.visibilidad === 'Público';
  }

  // Cargador / Solicitante: can see public docs OR docs strictly belonging to their area
  if (doc.visibilidad === 'Público') return true;

  return doc.areaOperativa === user.assignedArea;
};

export const canUserEditDocument = (user: UserProfile, doc: ArchiveDocument): boolean => {
  if (isSecretarioOrAdmin(user)) return true;
  if (user.role === 'CARGADOR_DATOS' && doc.areaOperativa === user.assignedArea) {
    return true;
  }
  return false;
};

export const canUserDeleteDocument = (user: UserProfile): boolean => {
  return user.role === 'ADMIN';
};

export const canUserAccessTab = (user: UserProfile, tabId: string): boolean => {
  // 1. Home is accessible to all
  if (tabId === 'home') return true;

  // 2. Strict Admin only tabs
  if (tabId === 'users' || tabId === 'budget') {
    return user.role === 'ADMIN';
  }

  // 3. Visitante restrictions: public read only
  if (user.role === 'VISITANTE') {
    return ['home', 'shelves', 'calendar', 'documents', 'inscriptions', 'notices'].includes(tabId);
  }

  // 4. Area operators & solicitantes
  if (tabId === 'my_area') {
    return Boolean(user.assignedArea || user.role === 'ADMIN');
  }

  return true;
};

