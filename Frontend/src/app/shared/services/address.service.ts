import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateAddress, GetAddress, UpdateAddress } from '../../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = "/api/address"
  constructor(private http: HttpClient) { }

  createAddress(address:string, title:string, setAsDefault:boolean){
    return this.http.post<CreateAddress>(`${this.apiUrl}/add`, {address, title, setAsDefault})
  }
  getAllAddress(){
    return this.http.get<GetAddress>(`${this.apiUrl}/get-all`)
  }
  updateAddress(addressId: number, address?:string, title?:string, setAsDefault?:string){
    return this.http.patch<UpdateAddress>(`${this.apiUrl}/update/${addressId}`, {address, title, setAsDefault})
  }
  deleteAddress(addressId: number){
    return this.http.delete<Omit<CreateAddress, 'address'>>(`${this.apiUrl}/delete/${addressId}`)
  }
}
