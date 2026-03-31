import { TestBed } from '@angular/core/testing';

import { Todo } from './todo';

describe('Todo', () => {
  let service: Todo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Todo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a task and retrieve it', () => {
    const task = 'Test Task';
    service.addTask(task);
    const tasks = service.getTasks();
    expect(tasks).toContain(task);
  });

  it('should not add an empty task', () => {
    service.addTask('   '); // Adding a task with only whitespace
    const tasks = service.getTasks();
    expect(tasks.length).toBe(0); // No tasks should be added
  });
});
