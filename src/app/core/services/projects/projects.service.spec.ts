import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectsService } from './projects.service';
import { Project } from '../../interfaces/project';


describe('ProjectsService', () => {
  let service: ProjectsService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectsService]
    });
    
    service = TestBed.inject(ProjectsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable of Projects on getProjects success', (done) => {
    const mockProjects: Project[] = [
      { id_campaign: 1, title: '2024 Campaign', description: 'Campaing 2024 summer', start_date: new Date() , end_date: new Date(), status: "active", user_id: 1}
    ]

     
    service.getProjects().subscribe(projects => {
      expect(projects).toEqual(mockProjects);
      done();
    });
  
    const req = httpMock.expectOne(`http://localhost:3000/api/campaigns`); // Adjust this URL to match your getUsers() endpoint
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });  
  
});
