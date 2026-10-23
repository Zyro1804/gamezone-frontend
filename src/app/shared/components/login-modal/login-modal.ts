import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../core/services/auth';

@Component({
  imports: [DialogModule, ButtonModule, FormsModule],
  selector: 'app-login-modal',
  styleUrl: './login-modal.css',
  templateUrl: './login-modal.html',
})
export class LoginModal {
  visible = input(false);
  visibleChange = output<boolean>();
  cargando = signal(false);
  private readonly loginService = inject(Auth)

  correo = '';
  password = '';

  cerrarModal() {
    this.visibleChange.emit(false);
  }

  async iniciarSesion() {
    try{
      const resp = await firstValueFrom(this.loginService.login( this.correo, this.password))
      console.log('Correo:', this.correo);
       console.log('Respuesta:', resp);
      console.log('Correo:', this.password);
      this.cargando.set(true)
    }catch(err:any){
      this.cargando.set(false)
    }
    
  }
}