import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';

type HelpTab = 'faq' | 'docs' | 'support';

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

interface DocSection {
  icon: string;
  title: string;
  description: string;
  articles: { title: string; time: string }[];
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  imports: [RouterLink, TuiButton, TuiIcon, FormsModule]
})
export class HelpComponent {
  protected activeTab = signal<HelpTab>('faq');
  protected searchQuery = signal('');
  protected submitted = signal(false);
  protected loading = signal(false);

  protected readonly form = signal({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'question'
  });

  protected readonly tabs: { id: HelpTab; label: string; icon: string }[] = [
    { id: 'faq', label: 'FAQ', icon: '@tui.message-circle-question-mark' },
    { id: 'docs', label: 'Qo\'llanma', icon: '@tui.book-open' },
    { id: 'support', label: 'Yordam so\'rash', icon: '@tui.headphones' },
  ];

  protected readonly faqItems = signal<FaqItem[]>([
    {
      question: 'ThechBlogda maqola yozish uchun nima kerak?',
      answer: 'Maqola yozish uchun avval ro\'yxatdan o\'tishingiz kerak. Ro\'yxatdan o\'tgach, "Maqola yozish" tugmasini bosing. Editor ichida sarlavha va matn yozing, rasm qo\'shing va nashr qiling.',
      open: false
    },
    {
      question: 'Maqolalarimni qanday tahrirlash mumkin?',
      answer: '"Maqolalarim" sahifasiga o\'ting va tahrirlashni xohlagan maqolangiz yonidagi menyu tugmasini bosing. "Tahrirlash" ni tanlang — editor ochiladi.',
      open: false
    },
    {
      question: 'Parolimni unutdim, nima qilaman?',
      answer: 'Kirish sahifasida "Parolni tiklash" havolasini bosing. Email manzilingizni kiriting — sizga parol yangilash havolasi yuboriladi. Havola 1 soat amal qiladi.',
      open: false
    },
    {
      question: 'Maqolani nashr qilgach uni o\'chirish mumkinmi?',
      answer: 'Ha, mumkin. "Maqolalarim" sahifasida maqolani qoralamaga qaytarishingiz yoki to\'liq o\'chirishingiz mumkin. O\'chirilgan maqola tiklanmaydi.',
      open: false
    },
    {
      question: 'Maqolada qanday formatlar qo\'llab-quvvatlanadi?',
      answer: 'Editor Markdown asosida ishlaydi. Sarlavhalar (H1, H2), qalin va kursiv matn, ro\'yxatlar, iqtiboslar, kod bloklari va rasmlar qo\'shish mumkin.',
      open: false
    },
    {
      question: 'Profilimga avatar qo\'shish mumkinmi?',
      answer: 'Ha. Sozlamalar → Asosiy profil bo\'limida "O\'zgartirish" tugmasini bosib avatar yuklashingiz mumkin. PNG, JPG formatlar qabul qilinadi.',
      open: false
    },
    {
      question: 'ThechBlog bepulmi?',
      answer: 'Ha, ThechBlog to\'liq bepul. O\'qish ham, maqola yozish ham bepul. Kelajakda premium funksiyalar qo\'shilishi mumkin, lekin asosiy funksiyalar har doim bepul bo\'ladi.',
      open: false
    },
    {
      question: 'Maqolaga teglar qo\'shish mumkinmi?',
      answer: 'Ha. Maqolani nashr qilish sozlamalarida teglar bo\'limiga kalit so\'zlar qo\'shishingiz mumkin. Teglar maqolani topishni osonlashtiradi.',
      open: false
    },
  ]);

  protected readonly docSections: DocSection[] = [
    {
      icon: '@tui.rocket',
      title: 'Boshlash',
      description: 'Platformadan foydalanishni boshlash uchun asosiy qo\'llanma.',
      articles: [
        { title: 'Ro\'yxatdan o\'tish va kirish', time: '2 min' },
        { title: 'Profilni sozlash', time: '3 min' },
        { title: 'Birinchi maqolangizni yozish', time: '5 min' },
      ]
    },
    {
      icon: '@tui.pen-line',
      title: 'Editor',
      description: 'Maqola yozish va formatlash bo\'yicha to\'liq qo\'llanma.',
      articles: [
        { title: 'Editor bilan ishlash asoslari', time: '4 min' },
        { title: 'Rasm va media qo\'shish', time: '3 min' },
        { title: 'Kod bloklari qo\'shish', time: '2 min' },
        { title: 'Maqolani nashr qilish', time: '2 min' },
      ]
    },
    {
      icon: '@tui.user',
      title: 'Profil va hisob',
      description: 'Hisob sozlamalari, xavfsizlik va profil boshqaruvi.',
      articles: [
        { title: 'Profil ma\'lumotlarini tahrirlash', time: '3 min' },
        { title: 'Parolni o\'zgartirish', time: '2 min' },
        { title: 'Ijtimoiy tarmoqlarni ulash', time: '3 min' },
      ]
    },
    {
      icon: '@tui.bar-chart-2',
      title: 'Statistika',
      description: 'Maqolalar ko\'rilishi va o\'quvchilar haqida ma\'lumot.',
      articles: [
        { title: 'Ko\'rishlar va o\'quvchilar', time: '2 min' },
        { title: 'Eng ko\'p o\'qilgan maqolalar', time: '2 min' },
      ]
    },
  ];

  protected readonly ticketTypes = [
    { value: 'question', label: 'Savol' },
    { value: 'bug', label: 'Xatolik' },
    { value: 'feature', label: 'Taklif' },
    { value: 'other', label: 'Boshqa' },
  ];

  toggleFaq(index: number) {
    this.faqItems.update(items =>
      items.map((item, i) => ({
        ...item,
        open: i === index ? !item.open : item.open
      }))
    );
  }

  get filteredFaq() {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.faqItems();
    return this.faqItems().filter(f =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q)
    );
  }

  updateField(field: string, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  async onSubmit() {
    this.loading.set(true);
    await new Promise(r => setTimeout(r, 1500));
    this.loading.set(false);
    this.submitted.set(true);
    this.form.set({ name: '', email: '', subject: '', message: '', type: 'question' });
  }
}