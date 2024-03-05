import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { HttpErrorManager } from "./errorManager";
import { environment } from "../../environments/environment";
import { throwError } from "rxjs";

/**
 * This class manage the http connections with internal REST services. Use the response format {
 *  Code: 'xxxxx',
 *  Body: 'Some Data' (this element is returned if the request is success)
 *  ...
 * }
 */
@Injectable({
  providedIn: "root",
})
export class RequestManager {
  private path!: string;
  public httpOptions: any;
  constructor(private http: HttpClient, private errManager: HttpErrorManager) {
    const acces_token = window.localStorage.getItem("access_token");
    if (acces_token !== null) {
      this.httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${acces_token}`,
        }),
      };
    }
  }

  /**
   * Use for set the source path of the service (service's name must be present at src/environment/environment.ts)
   * @param service: string
   */
  public setPath(service: string) {
    const keys = service.split(".");
    let value: any = environment;

    for (const key of keys) {
      value = value[key];
    }

    this.path = value;
  }

  /**
   * Perform a GET http request
   * @param endpoint service's end-point
   * @param params (an Key, Value object with que query params for the request)
   * @returns Observable<any>
   */
  get(endpoint: any) {
    return this.http.get<any>(`${this.path}${endpoint}`, this.httpOptions).pipe(
      map((res) => {
        const responseBody = res as { Body?: any };
        return responseBody?.Body ?? res;
      }),
      catchError((err: any) => {
        this.errManager.handleError.bind(err);
        return throwError(err);
      })
    );
  }

  /**
   * Perform a POST http request
   * @param endpoint service's end-point
   * @param element data to send as JSON
   * @returns Observable<any>
   */
  post(endpoint: any, element: any) {
    return this.http
      .post<any>(`${this.path}${endpoint}`, element, this.httpOptions)
      .pipe(catchError(this.errManager.handleError));
  }

  /**
   * Perform a POST http request
   * @param endpoint service's end-point
   * @param element data to send as JSON
   * @returns Observable<any>
   */
  post_file(endpoint: any, element: any) {
    return this.http
      .post<any>(`${this.path}${endpoint}`, element, {
        headers: new HttpHeaders({
          "Content-Type": "multipart/form-data",
        }),
      })
      .pipe(catchError(this.errManager.handleError));
  }

  /**
   * Perform a PUT http request
   * @param endpoint service's end-point
   * @param element data to send as JSON, With the id to UPDATE
   * @returns Observable<any>
   */
  put(endpoint: any, element: { Id: any }) {
    const path = element.Id
      ? `${this.path}${endpoint}/${element.Id}`
      : `${this.path}${endpoint}`;
    return this.http
      .put<any>(path, element, this.httpOptions)
      .pipe(catchError(this.errManager.handleError));
  }

  /**
   * Perform a DELETE http request
   * @param endpoint service's end-point
   * @param id element's id for remove
   * @returns Observable<any>
   */
  delete(endpoint: any, id: any) {
    return this.http
      .delete<any>(`${this.path}${endpoint}/${id}`, this.httpOptions)
      .pipe(catchError(this.errManager.handleError));
  }
}
