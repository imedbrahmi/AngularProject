import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Document {
  id: string;
  type: 'cv' | 'portfolio';
  title: string;
  createdAt: Date;
  updatedAt: Date;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private documents = new BehaviorSubject<Document[]>([]);
  private readonly STORAGE_KEY = 'user_documents';

  constructor() {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convertir les dates string en objets Date
        const documents = parsed.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt)
        }));
        this.documents.next(documents);
      } catch (error) {
        console.error('Erreur lors du chargement des documents:', error);
        this.documents.next([]);
      }
    }
  }

  private saveDocuments(documents: Document[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
      this.documents.next(documents);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des documents:', error);
    }
  }

  getDocuments(): Observable<Document[]> {
    return this.documents.asObservable();
  }

  getDocumentsByType(type: 'cv' | 'portfolio'): Document[] {
    return this.documents.value.filter(doc => doc.type === type);
  }

  addDocument(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Document {
    const newDocument: Document = {
      ...document,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentDocuments = this.documents.value;
    this.saveDocuments([...currentDocuments, newDocument]);
    return newDocument;
  }

  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const currentDocuments = this.documents.value;
    const index = currentDocuments.findIndex(doc => doc.id === id);
    
    if (index === -1) return null;

    const updatedDocument = {
      ...currentDocuments[index],
      ...updates,
      updatedAt: new Date()
    };

    currentDocuments[index] = updatedDocument;
    this.saveDocuments(currentDocuments);
    return updatedDocument;
  }

  deleteDocument(id: string): boolean {
    const currentDocuments = this.documents.value;
    const filteredDocuments = currentDocuments.filter(doc => doc.id !== id);
    
    if (filteredDocuments.length === currentDocuments.length) {
      return false;
    }

    this.saveDocuments(filteredDocuments);
    return true;
  }

  getDocumentById(id: string): Document | null {
    return this.documents.value.find(doc => doc.id === id) || null;
  }
} 