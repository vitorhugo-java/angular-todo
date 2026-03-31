import { Component, signal, input, ChangeDetectionStrategy, InputSignal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Todo } from './service/todo';
import { TodoList } from "./list/todo-list/todo-list";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('angular-todo');

  task = signal('');

  placeholder = signal('');
  placeHolderText: string = 'Start typing for tasks add your tasks here .........';
  placeHolderTextArray: string[] = this.placeHolderText.split('');
  taskService = inject(Todo);

  setPlaceHolder(newValue: string): void {
    this.placeholder.set(newValue);
  }

  appendPlaceHolder(newValue: string): void {
    this.placeholder.update((current) => current + '' + newValue);
  }

  ngOnInit(): void {
    let index = 0;
    setInterval(() => {
      this.appendPlaceHolder(this.placeHolderTextArray[index]);
      index = (index + 1) % this.placeHolderTextArray.length;
      if (index === 0) {
        this.placeholder.set('');
      }
    }, 50);
  }

  addTask(): void {
    this.taskService.addTask(this.task());
    this.task.set('');
  }
}
