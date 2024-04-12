import { Injectable } from '@angular/core';
import { Todo } from '../../interfaces/todo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { response } from 'express';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true,
};

const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${url}/todos`, httpOptions)

  }

  getTodoByUser(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${url}/todos/${id}`, httpOptions);
  }

  deleteTodo(task: any): Observable<any> {
    const id = task.id_todo;
    return this.http.delete<any>(`${url}/todos/delete/${id}`, httpOptions);
  }

  updateTodo(todo: Todo, id: number): Observable<Todo> {
    console.log(id);

    return this.http.put<Todo>(`${url}/todos/update/${id}`, todo, httpOptions);
  }

  addTodo(todo: Todo): Observable<Todo> {
    console.log(todo);

    return this.http.post<Todo>(`${url}/todos/register`, todo, httpOptions);
  }

}
