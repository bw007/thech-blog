import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [
    RouterLink,
    TuiButton,
    TuiIcon,
    FormsModule
  ]
})
export class AboutComponent {
  protected readonly form = signal<ContactForm>({
    name: '',
    email: '',
    message: ''
  });

  protected readonly submitted = signal(false);
  protected readonly loading = signal(false);

  protected readonly stats = [
    { value: '1K+', label: 'Foydalanuvchilar' },
    { value: '100+', label: 'Maqolalar' },
    { value: '20+', label: 'Mualliflar' },
    { value: '5K+', label: 'Oylik o\'quvchilar' },
  ];

  protected readonly timeline = [
    { year: '2026', title: 'Loyiha boshlandi', desc: 'Dastlabki 4 ta maqola bilan loyiha ishga tushdi' },
    { year: '2026', title: 'Mualliflar qo\'shildi', desc: 'Loyihamizga 10+ professional muallif qo\'shildi' },
    { year: '2026', title: 'Yangi funksiyalar', desc: 'Editor, comments va community features ishga tushdi' },
    { year: 'Hozir', title: 'O\'sishda', desc: '5,000+ oylik o\'quvchi bilan rivojlanmoqda' }
  ]

  protected readonly values = [
    {
      icon: '@tui.pen-line',
      title: 'Sifatli kontent',
      description: 'Har bir maqola tekshiriladi va sifat standartlarimizga javob berishi kerak.'
    },
    {
      icon: '@tui.users',
      title: 'Hamjamiyat',
      description: 'Biz o\'zaro hurmat va bilim almashishga asoslangan muhit yarataymiz.'
    },
    {
      icon: '@tui.globe',
      title: 'Ochiqlik',
      description: 'Barcha kontent O\'zbek tilida, o\'zbek o\'quvchilar uchun yaratiladi.'
    },
    {
      icon: '@tui.zap',
      title: 'Innovatsiya',
      description: 'Eng yangi texnologiyalar va tendensiyalar haqida birinchi bo\'lib yozamiz.'
    }
  ];

  protected readonly contacts = [
    {
      icon: '@tui.mail',
      label: 'Email',
      value: 'hello@thechblog.uz',
      href: 'mailto:hello@thechblog.uz'
    },
    {
      icon: '@tui.send',
      label: 'Telegram',
      value: '@thechblog',
      href: 'https://t.me/thechblog'
    },
    {
      icon: '@tui.github',
      label: 'GitHub',
      value: 'github.com/thechblog',
      href: 'https://github.com/thechblog'
    }
  ];

  updateField(field: keyof ContactForm, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  async onSubmit() {
    const { name, email, message } = this.form();
    if (!name || !email || !message) return;

    this.loading.set(true);
    await new Promise(r => setTimeout(r, 1500));
    this.loading.set(false);
    this.submitted.set(true);
    this.form.set({ name: '', email: '', message: '' });
  }
}