import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Todo {
  private tasks: string[] = [];

  // (Deixando os nomes em variáveis fica mais limpo e evita typo)
  private readonly dbName = 'TodoDB';
  private readonly storeName = 'tasks';
  private readonly dbVersion = 1;

  constructor() {
    this.initDB();
  }

  // Inicializa a brincadeira no lugar certo
  private initDB(): void {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        console.log('Object store criada com sucesso!');
      }
    };

    request.onsuccess = (event) => {
      // Só vamos buscar os dados APÓS garantir que o DB abriu direito (assim evitamos erros de "store não encontrada")
      this.retrieveFromIndexedDB();
    };

    request.onerror = (event) => {
      console.error(
        'Deu ruim ao inicializar o IndexedDB:',
        (event.target as IDBOpenDBRequest).error,
      );
    };
  }

  addTask(task: string): void {
    const trimmedTask = task.trim();
    if (trimmedTask) {
      this.tasks.push(trimmedTask);
      console.log('Task added:', trimmedTask);
      this.persistToIndexedDB();
    } else {
      console.warn('Cannot add an empty task.');
    }
  }

  getTasks(): string[] {
    return this.tasks;
  }

  persistToIndexedDB(): void {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        this.tasks.forEach((task) => {
          store.add({ task });
        });
      };

      transaction.oncomplete = () => {
        console.log('Tasks persisted to IndexedDB successfully.');
        db.close();
      };
    };

    request.onerror = (event) => {
      console.error(
        'Erro ao abrir o DB para persistência:',
        (event.target as IDBOpenDBRequest).error,
      );
    };
  }

  retrieveFromIndexedDB(): void {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Validação de segurança (pra garantir que a store realmente existe aqui)
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.close();
        return;
      }

      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        this.tasks = getAllRequest.result.map((item: { task: string }) => item.task);
        console.log('Tasks retrieved from IndexedDB:', this.tasks);
        db.close();
      };

      getAllRequest.onerror = (event) => {
        console.error('Error retrieving tasks:', (event.target as IDBRequest).error);
        db.close();
      };
    };
  }
}
