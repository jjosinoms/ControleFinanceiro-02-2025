import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false
})
export class LoginComponent {

 //atributo

 mensagemErroLogin = false;
 nomeAdmin : any;
 senhaAdmin : any;
 tokenAdmin : string = "1FBkCoIhETkx9L6gKv6VHPCS7374A";
 emailAdmin : any;
 dadosAdmin : any;

 // construtor para injecao de dependencia
 constructor(
   private HttpClient: HttpClient, //inicializacao automatica
   public router: Router
   ){
 }
// objeto para capturar o formulário
formVerificarLogin = new FormGroup({
  email: new FormControl('',
    [Validators.required, Validators.email]),
  senha: new FormControl('', 
    [Validators.required, Validators.minLength(1), Validators.maxLength(25)]),

})

// onjeto para executar as validações
get form(): any{
  return this.formVerificarLogin.controls;
}

// funcao para capturar um SUBMIT do formulario

onSubmit() : void{
  
  this.HttpClient.get('https://apicontrolefinanceiro.jonz.com.br/admin')
  .subscribe(/*capturar retorno da api*/ {
    next: (data) => { //resposta de sucesso da API
      if(data){ 
        //console.log(data);   
        this.dadosAdmin = data
        //localStorage.setItem("dados-admin", JSON.stringify(data));
        this.verificaSeExisteUsuario(this.dadosAdmin);

     }
     
    },    
    error: (e)=> { //resposta de erro da API
      console.log(e.error)
    }
  })

}

verificaSeExisteUsuario(dados: any): void {
  // Verifica se os dados existem
  if (dados != null) {
    // Obtém o email e a senha do formulário
    this.emailAdmin = this.formVerificarLogin.value.email;
    this.senhaAdmin = this.formVerificarLogin.value.senha;

    //console.log(dados[1]);

    // Itera sobre a lista de dados para verificar o email e a senha
    let usuarioEncontrado = false;
    for (let usuario of dados) {
      //console.log(usuario);
      if (this.emailAdmin === usuario.email && this.senhaAdmin === usuario.senha) {
        // Define que o usuário foi encontrado
        usuarioEncontrado = true;
        
        // Armazena o token no localStorage
        localStorage.setItem("token-admin", this.tokenAdmin);
        localStorage.setItem("loginFeitoComSucesso", "true");

        // Navega para a rota 'dashboard'
        this.router.navigate(['app']);
        break;
      }
    }

    // Se o loop terminar sem encontrar o usuário, exibe mensagem de erro
    if (!usuarioEncontrado) {
      this.mensagemErroLogin = true;
      this.formVerificarLogin.reset();
      localStorage.removeItem("dados-admin");
      setTimeout(() => {
        this.mensagemErroLogin = false;
      }, 5000);
    }
  } else {
    console.error('Dados inválidos.');
  }
}



}