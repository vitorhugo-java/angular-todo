import { Component, inject } from '@angular/core';
import { Todo } from '../../service/todo';

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  todoService = inject(Todo);

  get items(): string[] {
    return this.todoService.getTasks();
  }

  removeItem(index: number): void {
    const tasks = this.todoService.getTasks();
    if (index >= 0 && index < tasks.length) {
      tasks.splice(index, 1);
      console.log('Task removed at index:', index);
    } else {
      console.warn('Invalid index for task removal:', index);
    }
  }
}
