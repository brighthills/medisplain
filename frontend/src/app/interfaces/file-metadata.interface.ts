import { AISummary } from './aisummary.interface';

export interface FileMetadata {
  filename: string;
  originalFilename: string;
  userEmail: string;
  userId: string;
  uploadTimestamp: string;      
  createdAt: string;           
  status: 'pending' | 'processing' | 'done' | 'error';
  aiSummary: string | AISummary; 
}