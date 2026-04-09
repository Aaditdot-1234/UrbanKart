import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateAddress, GetAddress, UpdateAddress } from '../../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = "http://localhost:3000/address"
  constructor(private http: HttpClient) { }

  createAddress(address:string, title:string, setAsDefault:string){
    return this.http.post<CreateAddress>(`${this.apiUrl}/add`, {address, title, setAsDefault})
  }
  getAllAddress(){
    return this.http.get<GetAddress>(`${this.apiUrl}/add`)
  }
  updateAddress(address?:string, title?:string, setAsDefault?:string){
    return this.http.patch<UpdateAddress>(`${this.apiUrl}/add`, {address, title, setAsDefault})
  }
  deleteAddress(){
    return this.http.delete<Omit<CreateAddress, 'address'>>(`${this.apiUrl}/add`)
  }
}
