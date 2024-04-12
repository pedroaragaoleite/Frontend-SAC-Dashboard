import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Brand, Project, ProjectProducts } from '../../interfaces/project';

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
export class ProjectsService {

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${url}/campaigns`, httpOptions);
  }

  getProjectByUser(id: number): Observable<Project> {
    console.log(id);

    return this.http.get<Project>(`${url}/campaigns/user/${id}`, httpOptions)
  }

  getProjectProductsById(id: number): Observable<ProjectProducts> {
    return this.http.get<ProjectProducts>(`${url}/campaign_products/${id}`)
  }

  getBrandById(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${url}/brands/${id}`)
  }

  getBrands(): Observable<Brand> {
    return this.http.get<Brand>(`${url}/brands`, httpOptions);
  }

  deleteProject(project: Project): Observable<Project> {
    const id = project.id_campaign;
    return this.http.delete<Project>(`${url}/campaigns/delete/${id}`, httpOptions);
  }

  addProject(project: Project): Observable<Project> {
    console.log(project);

    return this.http.post<Project>(`${url}/campaigns/register`, project, httpOptions);
  }

  updateProject(project: Project, id: number): Observable<Project> {
    return this.http.put<Project>(`${url}/campaigns/update/${id}`, project, httpOptions);
  }
}
