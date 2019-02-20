import { Component } from '@angular/core';
import { AlertController, ToastController, ActionSheetController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  tasks: any[] = [];
  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController) {
    
    // Consultando no dblocal as tasks
    let tasksJson = localStorage.getItem('tasksDb');
    if(tasksJson != null){
      this.tasks = JSON.parse(tasksJson);
    }
  }

  async showAdd() {

    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer?',
      inputs: [
        {
          name: 'taskToDo',
          type: 'text',
          placeholder: 'Digite aqui a tarefa...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel')
          }
        }, {
          text: 'Adicionar',
          handler: (form) => {
            console.log(form);
            this.add(form.taskToDo);
          }
        }
      ]
    });
    await alert.present();
  }

  async add(taskTodo: string) {
    if (taskTodo.trim().length < 1) {
      const toast = await this.toastCtrl.create({
        message: 'Informe o que deseja fazer',
        duration: 2000,
        position: 'top'
      });
      toast.present();
      return;
    }

    let task = { name: taskTodo, done: false }
    this.tasks.push(task);
    this.updateLocalStorage();

  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "O que deseja fazer?",
      buttons: [{
        text: task.done ? 'Desmarcar' : 'Marcar',
        icon: task.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          task.done = !task.done;
          this.updateLocalStorage();
        }
      }
        , {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log("Clique cancelado");
          }
      }]
    });
    await actionSheet.present();
  }

  // documentação: https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/LocalStorage
  updateLocalStorage(){
    localStorage.setItem('tasksDb', JSON.stringify(this.tasks));  
    //alert( "Tarefa = " + localStorage.getItem("name"));
  }
  
  async delete(slidingTask: IonItemSliding, task: any){
    // Atualizando o array de tasks com todas as tasks que não sejam a selecionada, ou seja retirando do array a task selecionada e atualizando o array.
    this.tasks = this.tasks.filter(taskArray => task != taskArray);
    this.updateLocalStorage();
    slidingTask.close();
  }


}