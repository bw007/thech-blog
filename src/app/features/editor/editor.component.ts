import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';

import { Editor } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { FileHandler } from '@tiptap/extension-file-handler';
import { Image } from '@tiptap/extension-image';

import {
  TiptapEditorDirective,
  TiptapBubbleMenuDirective,
  TiptapFloatingMenuDirective
} from 'ngx-tiptap';

import { ThemeService } from '@core/services/theme.service';
import { EditorService } from '@core/services/editor.service';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Article } from '@core/models/article.model';
import { Location } from '@angular/common';
import { Figcaption, Figure } from './extensions/figure.extension';
import { NoMultipleSpaces } from './extensions/no-multiple-spaces.extension';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  imports: [
    FormsModule,
    RouterLink,
    TuiTextfield,
    TuiButton,
    TuiIcon,
    TuiHint,
    TiptapEditorDirective,
    TiptapFloatingMenuDirective,
    TiptapBubbleMenuDirective
  ]
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private theme = inject(ThemeService);
  private editorService = inject(EditorService);
  protected readonly darkMode = this.theme.darkMode;

  private titleInput = viewChild<ElementRef<HTMLTextAreaElement>>('titleInput');
  private readonly linkInput = viewChild<ElementRef<HTMLInputElement>>('linkInput');

  private saveSubject = new Subject<void>();
  protected readonly articleId = signal<string | null>(null);

  protected title = signal('');
  protected link = signal('');
  protected isLink = signal(false);

  protected readonly imageUploading = signal(false);
  protected readonly saving = signal(false);
  protected readonly uploadingImages = signal<Set<string>>(new Set());
  private isInitializing = signal(true);

  protected content = signal<Record<string, any>>({
    type: 'doc',
    content: [{ type: 'paragraph' }]
  });

  protected readonly editorReady = signal(false);
  protected editor = new Editor({
    extensions: [
      StarterKit,
      NoMultipleSpaces,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'figcaption') return 'Rasm tavsifi...';
          return 'Yozishni boshlang...';
        },
        includeChildren: true,
      }),
      Image,
      Figure,
      Figcaption,
      FileHandler.configure({
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        onDrop: (editor: Editor, files: File[], pos: number) => {
          files.forEach(file => this.insertImage(file))
        },
        onPaste: (editor: Editor, files: File[]) => {
          files.forEach(file => this.insertImage(file))
        }
      })
    ],
    editorProps: {
      attributes: {
        class: 'text-sm md:text-base leading-relaxed focus:outline-none min-h-[60vh] pb-32'
      }
    },
    onCreate: ({ editor }) => {
      const article = this.route.snapshot.data['article'] as Article | null;
      if (article?.content) {
        editor.commands.setContent(article.content);
      };
      this.editorReady.set(true);
      this.isInitializing.set(false);
    },
    onUpdate: ({ editor }) => {
      if (this.isInitializing()) return;
      if (this.imageUploading()) return;
      if (!editor.isEmpty || this.title()) {
        this.saveSubject.next();
      }
    }
  });

  constructor() {
    const article = this.route.snapshot.data['article'] as Article | null;
    if (article) {
      this.articleId.set(article.id);
      this.title.set(article.title);
    };

    this.saveSubject.pipe(
      debounceTime(3000),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      if (!this.articleId()) {
        this.createDraft();
      } else {        
        this.autoSave();
      }
    });
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.titleInput()?.nativeElement.focus();
    }, 0);
  };

  protected shouldShowBubbleMenu = ({ editor, state }: any) => {
    const { selection } = state;
    const { empty } = selection;
    
    if (empty) return false;
    if (editor.isActive('image')) return false;
    
    return true;
  };

  // Primary methods
  onTitleChange() {
    this.saveSubject.next();
  }

  async createDraft() {
    this.saving.set(true);
    const article = await this.editorService.createDraft(this.title(), this.editor.getJSON());
    if (article) {
      // this.router.navigate(['/editor', article.id, 'edit'], { replaceUrl: true });
      this.location.replaceState(`/editor/${article.id}/edit`);
      this.articleId.set(article.id);
    }
    this.saving.set(false);
  };

  async autoSave() {
    if (!this.articleId()) return;
    this.saving.set(true);
    await this.editorService.updateArticle(
      this.articleId()!,
      this.title(),
      this.editor.getJSON()
    );
    this.saving.set(false);
  }

  // Image methods
  async insertImage(file: File) {
    const tempId = crypto.randomUUID();
    this.uploadingImages.update(set => new Set(set).add(tempId));
    this.imageUploading.set(true);

    try {
      const permanentUrl = await this.editorService.uploadImage(file);
      await this.preloadImage(permanentUrl);
      
      this.editor.chain().focus()
        .insertContent({
          type: 'figure',
          content: [
            { type: 'image', attrs: { src: permanentUrl } },
            { type: 'figcaption', content: [] }
          ]
        })
        .run();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      this.uploadingImages.update(set => {
        const next = new Set(set);
        next.delete(tempId);
        return next;
      });

      if (this.uploadingImages().size === 0) {
        this.imageUploading.set(false);
        if (!this.articleId()) {
          this.createDraft();
        } else {
          this.autoSave();
        }
      }
    }
  };

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = url;
    });
  }

  // Secondary methods
  onTitleEnter(event: Event) {
    event.preventDefault();
    this.editor.commands.focus('end');
  };

  onImageSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    this.insertImage(file);
    (target as HTMLInputElement).value = '';
  };

  openLink() {
    if (this.editor.isActive('link')) {
      this.editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    this.isLink.set(true);
    setTimeout(() => {
      this.linkInput()?.nativeElement.focus();
    }, 0);
  };

  setLink() {
    if (this.link()) {
      this.editor.chain().focus().setLink({ href: this.link() }).run();
    } else {
      this.editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    this.editor.commands.blur();
    this.isLink.set(false);
    this.link.set('');
  };

  themeToggle() {
    this.theme.themeToggle();
  };

  ngOnDestroy() {
    this.editor.destroy();
  };
}
