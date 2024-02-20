import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
      'Accept': 'application/json',
  }),
}

@Injectable({
  providedIn: 'root'
})

export class RequestService {

  constructor(private http:HttpClient) { }

  get(path:string, endpoint:string) {
    return this.http.get(path + endpoint, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  getp(path:string, endpoint:string) {
    return this.http.get(path + endpoint, { ...httpOptions, reportProgress: true, observe: 'events' }).pipe(
      catchError(this.handleError),
    );
  }

  post(path:string, endpoint:string, element:any) {
    return this.http.post(path + endpoint, element, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  put(path:string, endpoint:string, element:any) {
    return this.http.put(path + endpoint + '/', element, httpOptions).pipe(
      catchError(this.handleError),
    ); // + element:any.Id
  }
  put2(path:string, endpoint:string, element:any) {
    return this.http.put(path + endpoint + '/' + element.Id, element, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  delete(path:string, endpoint:string, element:any) {
    return this.http.delete(path + endpoint + '/' + element.Id, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  delete2(path:string, endpoint:string) {
    return this.http.delete(path + endpoint, httpOptions).pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError({
      status: error.status,
      message: 'Something bad happened; please try again later.',
    });
  };
}