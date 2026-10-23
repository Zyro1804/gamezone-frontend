import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';

@Service()
export class Auth {

    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiUrl;
    loginUrl = `${this.baseUrl}/login`
    

    login(email:string, password:string){
        const body = {
            email:email,
            password:password
        }
        return this.http.post<any>(this.loginUrl,body)
    }

}
