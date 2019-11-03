import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../service/api.service';

import { environment } from '../../environments/environment';
import {  AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  addForm: FormGroup;
  submitted = false;
  id:string;
  stories = [];
  fileToUpload: File = null;
  status:boolean = false;
  serverurl = environment.url;
  tmparr = [];
  fullname:string;
  constructor(private spinner : NgxSpinnerService, private formBuilder: FormBuilder,private auth : Api,private authentic:AuthenticationService ) {
    let tmpdata = JSON.parse(localStorage.getItem('currentUser-truckish'));
    this.fullname = tmpdata['result']['name'];
    this.id = tmpdata['result']['id'];

   }
  ngOnInit() {
    this.spinner.hide();
    this.addForm = this.formBuilder.group({
      name : ['', Validators.required],
      desc : ['', Validators.required],
      image : ['', Validators.required],
      address : ['', Validators.required],
    });
    this.getStories();
  }
  get f() { return this.addForm.controls; }

  onSubmit(){
    this.submitted = true;

    if (this.addForm.invalid) {
      return;
    }
  this.spinner.show();
  
  
  const storeisData = { 
    'name' : this.f.name.value,
    'description' : this.f.desc.value,
    'address' : this.f.address.value,
    'imgname' : this.fileToUpload.name,
    'userid': this.id
  }
  const formData: FormData = new FormData();
  formData.append('imgdata', this.fileToUpload);
  formData.append('data', JSON.stringify(storeisData)); 
  this.auth.addData(formData).subscribe(data=>{ if(data['success'] === 'true'){ this.getStories();  this.addForm.reset(); this.status = false; this.spinner.hide(); }else { this.spinner.hide(); console.log('something wrong') } } ,error=>{ console.log(error); this.spinner.hide(); });
}  

getStories(){
  this.auth.getData(this.id).subscribe(data=>{ if(data['success'] === 'true')
  { this.tmparr = data['result']; this.spinner.hide(); this.stories = data['result']; }else{
     this.spinner.hide();console.log('something wrong') }},error=>{ console.log(error); this.spinner.hide(); });
}

handleFileInput(files: FileList) {
  this.fileToUpload = files.item(0);
}
openadd(){ 
  this.status = true;
}
close(){
  this.status = false;
}
delrow(val,name){
  this.spinner.show();
  this.auth.delete(val,name).subscribe(data=>{ if(data['success'] === 'true') {  this.spinner.hide(); this.getStories(); } else { this.spinner.hide(); console.log('something went wrong in delete'); }}, error => { console.log('error'); })
}
onSearchChange(val){
  if(val.length > 0 ){
    this.stories = this.tmparr;
    const result = this.stories.filter(s => s.name.includes(val));
    this.stories = result;
  }else{
    this.stories = this.tmparr;
  }
}
logout(){
  this.authentic.logout();
}

}
