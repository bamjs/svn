import { Component, TemplateRef } from '@angular/core';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-toast-message',
  templateUrl: './toast-message.component.html',
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
  styleUrls: ['./toast-message.component.css']
})
export class ToastMessageComponent {
	constructor(public toastService: ToastService) {}

	isTemplate(toast) {
		return toast.textOrTpl instanceof TemplateRef;
	}
}
