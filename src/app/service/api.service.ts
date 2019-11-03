import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../model/users';


@Injectable({ providedIn: 'root' })

export class Api {
    httpOptions:any;
    token:any;
    userid:any;

    constructor(private http: HttpClient) {
        let data = JSON.parse(localStorage.getItem('currentUser-truckish'));
        this.token = data['token'];
        
        
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' : 'application/json',
                'x-access-token' : this.token
            })     
        }
     }
     
      addData(data):Observable<any>{
        let option = {
          headers: new HttpHeaders({
              'x-access-token' : this.token
          })
        }
        return this.http.post<any>(environment.url + "api/addData",data,option);
      }
      getData(userid):Observable<any>{
        return this.http.post<any>(environment.url + "api/getstoires",{ 'userid' : userid},this.httpOptions);
      }
      delete (id,imgname): Observable<any> {
        return this.http.post<any>(environment.url + "api/deltestories", {'id':id,'imgname':imgname},this.httpOptions);
      }
} 