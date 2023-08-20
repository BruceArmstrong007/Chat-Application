import { Component, OnInit, inject, WritableSignal, signal, Signal, computed } from '@angular/core';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { SearchCardComponent } from './search-card/search-card.component';
import { ContactRef, UserState, UserStateI } from '../../state/user.state';
import { ContactService } from '../../services/contact.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, SearchCardComponent, NgIf, NgFor]
})
export class SearchPage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly userState = inject(UserState);
  private readonly contactService = inject(ContactService);
  readonly fetchedUsers: WritableSignal<Partial<UserStateI>[]> = signal([]);
  private readonly actionSheetCtrl: ActionSheetController = inject(ActionSheetController);
  readonly selectedUsers!: Signal<Partial<UserStateI>[]>;


  constructor() {
  // This is selected users that depend on fetched data and user profile and this changes
  // if either one of those signal changes
    this.selectedUsers = computed(() => {
      const userInfo = this.userState.user();
      const fetchedUsers = this.fetchedUsers();
      if(fetchedUsers.length > 0){
        return fetchedUsers.map((user:any) => {
          const existInContact = userInfo?.contacts?.find((contact:ContactRef) => contact?.user?._id === user?._id);
          const existInSentInvite = userInfo?.sentInvites?.find((contact:ContactRef) => contact?.user?._id === user?._id);
          const existInReceivedInvite = userInfo?.receivedInvites?.find((contact:ContactRef) => contact?.user?._id === user?._id);
          if(existInContact){
            return {
              ...user,
              status: 'friends'
            }
          }
          if(existInSentInvite){
            return {
              ...user,
              status: 'sent'
            }
          }
          if(existInReceivedInvite){
            return {
              ...user,
              status: 'received'
            }
          }
          return {...user};
        })
      }
      return [];
    });
   }

  ngOnInit() {

  }

  search(event:any){
    const value = event?.target?.value;
    if(value == ''){
      this.fetchedUsers.set([]);
      return;
    }
    this.userService.search(value).subscribe((res)=>{
      this.fetchedUsers.set(res);
    });
  }

  clear(){
    this.fetchedUsers.set([]);
  }

  async btnClick(event:any){
    switch(event.type){
      case 'invite':
        this.inviteUser(event?.username);
        break;
      case 'remove':
        this.removeUser(event?.username);
        break;
      case 'cancel':
        this.cancelInvite(event?.username);
        break;
      case 'accept':
        this.acceptInvite(event?.username);
        break;
      case 'decline':
        this.declineInvite(event?.username);
        break;
      default:
    }

  }


  async inviteUser(username: string){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Invite User',
      buttons: [
        {
          text: 'Add',
          data: {
            action: 'add',
          },
          handler:() => {
            this.contactService.sendInvite(username).subscribe((res)=>{
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    });
    await actionSheet.present();
  }

  async removeUser(username: string){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Remove User',
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          data: {
            action: 'remove-user',
          },
          handler:() =>  {
            this.contactService.removeContact(username).subscribe((res) => {})
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    });
    await actionSheet.present();
  }

  async cancelInvite(username: string){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Cancel Invite',
      buttons: [
        {
          text: 'Cancel',
          role: 'destructive',
          data: {
            action: 'cancel-invite',
          },
          handler:() =>  {
            this.contactService.cancelInvite(username).subscribe((res) => {})
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    });
    await actionSheet.present();
  }

  async acceptInvite(username: string){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Accept Invite',
      buttons: [
        {
          text: 'Accept',
          data: {
            action: 'accept-invite',
          },
          handler:() =>  {
            this.contactService.acceptInvite(username).subscribe((res) => {})
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    });
    await actionSheet.present();
  }

  async declineInvite(username: string){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Decline Invite',
      buttons: [
        {
          text: 'Decline',
          role: 'destructive',
          data: {
            action: 'decline-invite',
          },
          handler:() =>  {
            this.contactService.declineInvite(username).subscribe((res) => {})
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    });
    await actionSheet.present();
  }



  open(event:any){

  }

}
