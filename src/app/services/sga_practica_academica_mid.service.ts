import { Injectable } from "@angular/core";
import { RequestManager } from "../managers/requestManager";

@Injectable({
    providedIn: 'root'
})
export class SgaPracticaAcademicaMidService{
    constructor(private requestManager: RequestManager) {
    }
    get(endPoint: string) {
        this.requestManager.setPath('SGA_PRACTICA_ACADEMICA_MID')
        return this.requestManager.get(endPoint);
    }
    post(endPoint: string, body: any) {
        this.requestManager.setPath('SGA_PRACTICA_ACADEMICA_MID')
        return this.requestManager.post(endPoint, body);
    }
    put(endPoint: string, body: any) {
        this.requestManager.setPath('SGA_PRACTICA_ACADEMICA_MID')
        return this.requestManager.put(endPoint, body);
    }
    delete(endPoint: string, elementId: string) {
        this.requestManager.setPath('SGA_PRACTICA_ACADEMICA_MID')
        return this.requestManager.delete(endPoint, elementId);
    }
}