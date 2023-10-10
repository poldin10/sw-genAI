import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RosterService } from './roster.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css'],
  imports: [CommonModule],
  providers: [DatePipe]
})
export class RosterComponent implements OnInit {
  authors: any[] = []; // Initialize with your author data

  constructor(private rosterService: RosterService, private cd: ChangeDetectorRef, private datePipe: DatePipe, private router: Router) { }

  ngOnInit() {
    this.rosterService.getArticles().subscribe(articles => {
      for (let article of articles.articles) {
        const author = article.author?.username;
        const likesReceived = article.favoritesCount;

        const existingAuthor = this.authors.find(a => a.username === author);

        if (!existingAuthor) {
          this.authors.push({
            username: author,
            articlesAuthored: 1,
            likesReceived: likesReceived,
            dateOfFirstArticle: article.createdAt
          });
        } else {
          existingAuthor.articlesAuthored += 1;
          existingAuthor.likesReceived += likesReceived;
          existingAuthor.dateOfFirstArticle = existingAuthor.dateOfFirstArticle > article.createdAt ? article.createdAt : existingAuthor.dateOfFirstArticle;
        }
      }

      // Sort authors by the number of likes received (descending order)
      this.authors.sort((a, b) => b.likesReceived - a.likesReceived);
      this.cd.detectChanges();
    });
  }

  navigateToProfile(username: string) {
    this.router.navigate(['/profile', username]);
  }
}