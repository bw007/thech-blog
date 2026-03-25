import { Injectable, signal } from "@angular/core";
import { Article } from "@core/models/article.model";

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
  private mockArticles: Article[] = [
    {
      id: '1',
      title: 'The Future of Web Development with AI',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Full content goes here...'
              }
            ]
          }
        ]
      },
      author_id: 'Alex Johnson',
      created_at: '2026-03-20T10:00:00Z',
      reading_time: 5,
      cover_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      tags: ['AI', 'Web Dev', 'Future'],
      slug: null,
      status: 'draft',
      views_count: 0,
      likes_count: 0,
      published_at: null,
      updated_at: ''
    },
    {
      id: '2',
      title: 'Mastering Tailwind CSS for Modern UIs',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Full content goes here...'
              }
            ]
          }
        ]
      },
      author_id: 'Sarah Drasner',
      created_at: '2026-03-18T14:30:00Z',
      reading_time: 8,
      cover_image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=800&q=80',
      tags: ['CSS', 'Design', 'Tailwind'],
      slug: null,
      status: 'draft',
      views_count: 0,
      likes_count: 0,
      published_at: null,
      updated_at: ''
    },
    {
      id: '3',
      title: 'Angular Signals Explained',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Full content goes here...'
              }
            ]
          }
        ]
      },
      author_id: 'John Doe',
      created_at: '2026-03-15T09:15:00Z',
      reading_time: 6,
      cover_image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=800&q=80',
      tags: ['Angular', 'State Management'],
      slug: null,
      status: 'draft',
      views_count: 0,
      likes_count: 0,
      published_at: null,
      updated_at: ''
    }
  ];

  articles = signal<Article[]>(this.mockArticles);

  getLatestArticles() {
    return this.articles.asReadonly();
  }

  getArticleById(id: string) {
    return this.articles().find(article => article.id === id);
  }
}