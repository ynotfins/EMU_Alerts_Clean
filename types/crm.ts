export type CaseStatus = 'new' | 'assigned' | 'responding' | 'on-scene' | 'in-progress' | 'resolved' | 'closed';

export interface CaseDoc {
  id: string;
  alertRef: { source:'alerts'|'incidents'; id:string };
  status: CaseStatus;
  priority: 'low'|'medium'|'high'|'critical';
  assignedTo?: string; // uid
  homeowner?: { name?: string; phone?: string; email?: string }; // supervisor owns truth
  customer?: { name?: string; phone?: string; email?: string };  // optional
  createdAt: string; // ISO or serverTimestamp
  updatedAt: string;
}

export interface CaseTask { 
  id:string; 
  title:string; 
  done:boolean; 
  assigneeUid?:string; 
  createdAt:any; 
}

export interface CaseNote { 
  id:string; 
  authorUid:string; 
  authorRole:'employee'|'supervisor'|'customer'; 
  text:string; 
  createdAt:any; 
}

export interface CaseFile { 
  id:string; 
  url:string; 
  name:string; 
  uploadedBy:string; 
  createdAt:any; 
}

export interface EmployeeInputs {
  [employeeUid: string]: {
    etaMins?: number;
    onSceneReport?: string;
    contactAttempted?: boolean;
    secondaryPhone?: string;
    updatedAt: any;
  };
}

export interface TimelineEvent {
  id: string;
  type: 'status' | 'media' | 'chat' | 'homeowner' | 'case-status' | 'response';
  payload: any;
  createdAt: any;
}