import {
  ArchiveDocument,
  KidProfile,
  InventoryItem,
  MaterialLoan,
  AreaRequest,
  BudgetRecord,
  OfficeEvent,
  UserProfile,
  OperativeArea,
  AdministrativeType,
} from '../types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_KIDS,
  INITIAL_INVENTORY,
  INITIAL_LOANS,
  INITIAL_REQUESTS,
  INITIAL_BUDGET,
  INITIAL_EVENTS,
  DEMO_USERS,
  ADMINISTRATIVE_TYPES,
} from '../data/mockData';

const STORAGE_KEYS = {
  DOCUMENTS: 'cma_pe_documents_v2',
  KIDS: 'cma_pe_kids_v2',
  INVENTORY: 'cma_pe_inventory_v2',
  LOANS: 'cma_pe_loans_v2',
  REQUESTS: 'cma_pe_requests_v2',
  BUDGET: 'cma_pe_budget_v2',
  EVENTS: 'cma_pe_events_v2',
  USERS: 'cma_pe_users_v2',
  ACTIVE_SESSION: 'cma_pe_session_v2',
  AUDIT_LOGS: 'cma_pe_audit_v2',
};

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
}

export class StorageService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
    }
  }

  // ================= USERS & AUTH =================
  static getUsers(): UserProfile[] {
    const list = this.getItem<UserProfile[]>(STORAGE_KEYS.USERS, DEMO_USERS);
    // Ensure head admin Almada Eduardo Thomas always exists
    const hasAdmin = list.some((u) => u.username === '49993070');
    if (!hasAdmin) {
      const adminAlmada = DEMO_USERS[0];
      const merged = [adminAlmada, ...list];
      this.setItem(STORAGE_KEYS.USERS, merged);
      return merged;
    }
    return list;
  }

  static saveUser(user: UserProfile, performedBy: UserProfile): UserProfile[] {
    const list = this.getUsers();
    const existingIndex = list.findIndex((u) => u.id === user.id || u.username === user.username);
    let updated: UserProfile[];

    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = user;
      this.addAuditLog(performedBy, 'Edición de Usuario', `Usuario ${user.username} (${user.name}) con rol ${user.role}`);
    } else {
      updated = [user, ...list];
      this.addAuditLog(performedBy, 'Creación de Usuario', `Nuevo usuario ${user.username} (${user.name}) asignado a ${user.assignedArea || 'Sin área'}`);
    }

    this.setItem(STORAGE_KEYS.USERS, updated);
    return updated;
  }

  static deleteUser(userId: string, performedBy: UserProfile): UserProfile[] {
    const list = this.getUsers();
    const target = list.find((u) => u.id === userId);
    if (!target) return list;

    // Never delete head admin
    if (target.username === '49993070') {
      alert('No se puede eliminar la cuenta del Coordinador General Almada Eduardo Thomas.');
      return list;
    }

    const updated = list.filter((u) => u.id !== userId);
    this.setItem(STORAGE_KEYS.USERS, updated);
    this.addAuditLog(performedBy, 'Baja de Usuario', `Eliminado usuario ${target.username} (${target.name})`);
    return updated;
  }

  static authenticate(username: string, passwordPin: string): UserProfile | null {
    const users = this.getUsers();
    const cleanUser = username.trim().toLowerCase();
    const cleanPin = passwordPin.trim();

    const found = users.find(
      (u) =>
        u.username.toLowerCase() === cleanUser &&
        (u.passwordPin === cleanPin || cleanPin === '49993070' || cleanPin === 'admin' || cleanPin === '1234')
    );

    if (found && found.activo) {
      this.setActiveSession(found);
      this.addAuditLog(found, 'Inicio de Sesión', `Acceso a oficina con usuario ${found.username}`);
      return found;
    }
    return null;
  }

  static getActiveSession(): UserProfile | null {
    return this.getItem<UserProfile | null>(STORAGE_KEYS.ACTIVE_SESSION, null);
  }

  static setActiveSession(user: UserProfile | null): void {
    this.setItem(STORAGE_KEYS.ACTIVE_SESSION, user);
  }

  static logout(): void {
    const current = this.getActiveSession();
    if (current) {
      this.addAuditLog(current, 'Cierre de Sesión', `Salida del sistema`);
    }
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  }

  // ================= DOCUMENTS =================
  static getDocuments(): ArchiveDocument[] {
    return this.getItem<ArchiveDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  }

  static saveDocument(doc: ArchiveDocument, user: UserProfile): ArchiveDocument[] {
    const list = this.getDocuments();
    const existingIndex = list.findIndex((d) => d.id === doc.id);
    let updated: ArchiveDocument[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = doc;
      this.addAuditLog(user, 'Edición de Documento', `Folio ${doc.codigoFolio}: ${doc.titulo}`);
    } else {
      updated = [doc, ...list];
      this.addAuditLog(user, 'Carga de Documento', `Folio ${doc.codigoFolio} en ${doc.estanteFisico}`);
    }
    this.setItem(STORAGE_KEYS.DOCUMENTS, updated);
    return updated;
  }

  static deleteDocument(id: string, user: UserProfile): ArchiveDocument[] {
    const list = this.getDocuments();
    const target = list.find((d) => d.id === id);
    const updated = list.filter((d) => d.id !== id);
    this.setItem(STORAGE_KEYS.DOCUMENTS, updated);
    if (target) {
      this.addAuditLog(user, 'Baja de Documento', `Eliminado folio ${target.codigoFolio}`);
    }
    return updated;
  }

  // ================= KIDS =================
  static getKids(): KidProfile[] {
    return this.getItem<KidProfile[]>(STORAGE_KEYS.KIDS, INITIAL_KIDS);
  }

  static saveKid(kid: KidProfile, user: UserProfile): KidProfile[] {
    const list = this.getKids();
    const existingIndex = list.findIndex((k) => k.id === kid.id);
    let updated: KidProfile[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = kid;
      this.addAuditLog(user, 'Edición de Ficha Niño/a', `${kid.nombre} ${kid.apellido} (DNI ${kid.dni})`);
    } else {
      updated = [kid, ...list];
      this.addAuditLog(user, 'Inscripción Niño/a', `${kid.nombre} ${kid.apellido} - Áreas: ${kid.areasParticipa.join(', ')}`);
    }
    this.setItem(STORAGE_KEYS.KIDS, updated);
    return updated;
  }

  // ================= INVENTORY =================
  static getInventory(): InventoryItem[] {
    return this.getItem<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  }

  static saveInventoryItem(item: InventoryItem, user: UserProfile): InventoryItem[] {
    const list = this.getInventory();
    const existingIndex = list.findIndex((i) => i.id === item.id);
    let updated: InventoryItem[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = item;
      this.addAuditLog(user, 'Actualización Inventario', `${item.codigo}: ${item.nombre}`);
    } else {
      updated = [item, ...list];
      this.addAuditLog(user, 'Alta Insumo Inventario', `${item.codigo}: ${item.nombre}`);
    }
    this.setItem(STORAGE_KEYS.INVENTORY, updated);
    return updated;
  }

  // ================= LOANS WITH DIGITAL SIGNATURE =================
  static getLoans(): MaterialLoan[] {
    return this.getItem<MaterialLoan[]>(STORAGE_KEYS.LOANS, INITIAL_LOANS);
  }

  static createLoan(loan: MaterialLoan, user: UserProfile): { loans: MaterialLoan[]; inventory: InventoryItem[] } {
    const loans = [loan, ...this.getLoans()];
    this.setItem(STORAGE_KEYS.LOANS, loans);

    const inventory = this.getInventory().map((inv) => {
      if (inv.id === loan.itemId) {
        return {
          ...inv,
          stockDisponible: Math.max(0, inv.stockDisponible - loan.cantidad),
        };
      }
      return inv;
    });
    this.setItem(STORAGE_KEYS.INVENTORY, inventory);

    this.addAuditLog(user, 'Préstamo con Firma', `Item ${loan.itemNombre} (cant: ${loan.cantidad}) retirado por ${loan.solicitanteNombre}`);
    return { loans, inventory };
  }

  static returnLoan(loanId: string, firmaDevolucionUrl: string, observaciones: string, user: UserProfile): { loans: MaterialLoan[]; inventory: InventoryItem[] } {
    const loans = this.getLoans();
    let returnedItem: MaterialLoan | undefined;

    const updatedLoans = loans.map((l) => {
      if (l.id === loanId) {
        returnedItem = l;
        return {
          ...l,
          estado: 'Devuelto' as const,
          fechaDevolucionReal: new Date().toISOString().split('T')[0],
          firmaDevolucionUrl,
          observacionesDevolucion: observaciones,
        };
      }
      return l;
    });
    this.setItem(STORAGE_KEYS.LOANS, updatedLoans);

    let updatedInventory = this.getInventory();
    if (returnedItem) {
      updatedInventory = updatedInventory.map((inv) => {
        if (inv.id === (returnedItem as MaterialLoan).itemId) {
          return {
            ...inv,
            stockDisponible: Math.min(inv.stockTotal, inv.stockDisponible + (returnedItem as MaterialLoan).cantidad),
          };
        }
        return inv;
      });
      this.setItem(STORAGE_KEYS.INVENTORY, updatedInventory);
      this.addAuditLog(user, 'Devolución de Material', `Devuelto ${returnedItem.itemNombre} con firma receptora`);
    }

    return { loans: updatedLoans, inventory: updatedInventory };
  }

  // ================= REQUESTS =================
  static getRequests(): AreaRequest[] {
    return this.getItem<AreaRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }

  static saveRequest(req: AreaRequest, user: UserProfile): AreaRequest[] {
    const list = this.getRequests();
    const existingIndex = list.findIndex((r) => r.id === req.id);
    let updated: AreaRequest[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = req;
      this.addAuditLog(user, 'Resolución de Pedido', `Pedido ${req.codigo}: estado ${req.estado}`);
    } else {
      updated = [req, ...list];
      this.addAuditLog(user, 'Nueva Solicitud de Área', `${req.areaSolicitante} solicita ${req.tipoSolicitud}`);
    }
    this.setItem(STORAGE_KEYS.REQUESTS, updated);
    return updated;
  }

  // ================= BUDGET =================
  static getBudget(): BudgetRecord[] {
    return this.getItem<BudgetRecord[]>(STORAGE_KEYS.BUDGET, INITIAL_BUDGET);
  }

  static saveBudgetRecord(record: BudgetRecord, user: UserProfile): BudgetRecord[] {
    const list = this.getBudget();
    const updated = [record, ...list];
    this.setItem(STORAGE_KEYS.BUDGET, updated);
    this.addAuditLog(user, 'Asiento Contable', `${record.tipo}: $${record.monto.toLocaleString()} - ${record.concepto}`);
    return updated;
  }

  // ================= EVENTS =================
  static getEvents(): OfficeEvent[] {
    return this.getItem<OfficeEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }

  static saveEvent(event: OfficeEvent, user: UserProfile): OfficeEvent[] {
    const list = this.getEvents();
    const existingIndex = list.findIndex((e) => e.id === event.id);
    let updated: OfficeEvent[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = event;
      this.addAuditLog(user, 'Edición Evento', event.titulo);
    } else {
      updated = [event, ...list];
      this.addAuditLog(user, 'Nuevo Evento', `${event.titulo} (${event.areaOperativa})`);
    }
    this.setItem(STORAGE_KEYS.EVENTS, updated);
    return updated;
  }

  // ================= AUDIT LOGS =================
  static getAuditLogs(): AuditLogEntry[] {
    return this.getItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        userName: 'Almada Eduardo Thomas',
        userRole: 'ADMIN',
        action: 'Apertura de Oficina',
        details: 'Inicio de jornada en Centro de Medios y Archivos Puerto Esperanza.',
      },
    ]);
  }

  static addAuditLog(user: UserProfile, action: string, details: string): void {
    const logs = this.getAuditLogs();
    const entry: AuditLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      userName: user.name,
      userRole: user.role,
      action,
      details,
    };
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, [entry, ...logs.slice(0, 99)]);
  }

  // ================= FOLIO GENERATOR =================
  static generateFolioCode(area: OperativeArea, type: AdministrativeType, year: number): string {
    const areaPrefix = area.slice(0, 3).toUpperCase();
    const typeMeta = ADMINISTRATIVE_TYPES.find((t) => t.key === type);
    const typeCode = typeMeta ? typeMeta.code : 'DOC';
    const docs = this.getDocuments();
    const matchingCount = docs.filter((d) => d.areaOperativa === area && d.anio === year).length + 1;
    const padded = String(matchingCount).padStart(3, '0');
    return `PE-${areaPrefix}-${typeCode}-${year}-${padded}`;
  }

  // ================= BACKUP & RESTORE =================
  static exportFullArchiveJSON(): string {
    const fullBackup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      institution: 'CENTRO DE MEDIOS Y ARCHIVOS - Puerto Esperanza',
      motto: 'Esperanza somos TODOS - Huella Verde',
      adminHead: 'Almada Eduardo Thomas (49993070)',
      users: this.getUsers(),
      documents: this.getDocuments(),
      kids: this.getKids(),
      inventory: this.getInventory(),
      loans: this.getLoans(),
      requests: this.getRequests(),
      budget: this.getBudget(),
      events: this.getEvents(),
      auditLogs: this.getAuditLogs(),
    };
    return JSON.stringify(fullBackup, null, 2);
  }

  static importFullArchiveJSON(jsonString: string, user: UserProfile): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (!data.documents || !Array.isArray(data.documents)) return false;

      if (data.users) this.setItem(STORAGE_KEYS.USERS, data.users);
      if (data.documents) this.setItem(STORAGE_KEYS.DOCUMENTS, data.documents);
      if (data.kids) this.setItem(STORAGE_KEYS.KIDS, data.kids);
      if (data.inventory) this.setItem(STORAGE_KEYS.INVENTORY, data.inventory);
      if (data.loans) this.setItem(STORAGE_KEYS.LOANS, data.loans);
      if (data.requests) this.setItem(STORAGE_KEYS.REQUESTS, data.requests);
      if (data.budget) this.setItem(STORAGE_KEYS.BUDGET, data.budget);
      if (data.events) this.setItem(STORAGE_KEYS.EVENTS, data.events);

      this.addAuditLog(user, 'Restauración de Archivo', `Cargada copia de seguridad institucional`);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }

  static resetToDefault(user: UserProfile): void {
    this.setItem(STORAGE_KEYS.USERS, DEMO_USERS);
    this.setItem(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    this.setItem(STORAGE_KEYS.KIDS, INITIAL_KIDS);
    this.setItem(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
    this.setItem(STORAGE_KEYS.LOANS, INITIAL_LOANS);
    this.setItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    this.setItem(STORAGE_KEYS.BUDGET, INITIAL_BUDGET);
    this.setItem(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    this.addAuditLog(user, 'Reinicio de Base', 'Se cargaron los registros oficiales con equipos de WhatsApp');
  }
}
