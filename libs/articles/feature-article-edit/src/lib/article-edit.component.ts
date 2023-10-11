import { DynamicFormComponent, Field, formsActions, ListErrorsComponent, ngrxFormsQuery } from '@realworld/core/forms';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { articleActions, articleEditActions, articleQuery } from '@realworld/articles/data-access';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'cdt-article-edit',
  standalone: true,
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  imports: [DynamicFormComponent, ListErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleEditComponent implements OnInit, OnDestroy {
  newStructure: Field[] = [
    {
      type: 'INPUT',
      name: 'title',
      placeholder: 'Article Title',
      validator: [Validators.required],
    },
    {
      type: 'INPUT',
      name: 'description',
      placeholder: "What's this article about?",
      validator: [Validators.required],
    },
    {
      type: 'TEXTAREA',
      name: 'body',
      placeholder: 'Write your article (in markdown)',
      validator: [Validators.required],
    },
    {
      type: 'INPUT',
      name: 'tagList',
      placeholder: 'Enter Tags',
      validator: [],
    }
  ];

  structure$ = this.store.select(ngrxFormsQuery.selectStructure);
  data$ = this.store.select(ngrxFormsQuery.selectData);

  constructor(private readonly store: Store, 
    private readonly route: ActivatedRoute, 
    // private wsService: WebSocketService
    ) {}

  ngOnInit() {
    const articleSlug = this.extractSlugFromUrl(window.location.href);

     if (articleSlug && articleSlug != 'editor') {
       // Add the coAuthors field for editing
       this.newStructure.push({
         type: 'INPUT',
         name: 'coAuthors',
         placeholder: 'Enter Co Authors',
         validator: [],
       });
     }

    this.store.dispatch(formsActions.setStructure( {structure : this.newStructure }));

    this.store
      .select(articleQuery.selectData)
      .pipe(untilDestroyed(this))
      .subscribe((article) => this.store.dispatch(formsActions.setData({ data: article })));

      // this.wsService.connect();
  }

  updateForm(changes: any) {
    this.store.dispatch(formsActions.updateData({ data: changes }));
  }

  submit() {
    this.store.dispatch(articleEditActions.publishArticle());
  }

  ngOnDestroy() {
    this.store.dispatch(formsActions.initializeForm());
  }

  private extractSlugFromUrl(fullUrl: string): string | null {
    // Split the URL by the '/' character and extract the last part
    const parts = fullUrl.split('/');
    return parts[parts.length - 1] || null;
  }

  // lockArticle(articleId: string) {
  //   const username = 'current-user'; // Replace with actual username
  //   this.wsService.lockArticle(articleId, username);
  // }

  // unlockArticle(articleId: string) {
  //   this.wsService.unlockArticle(articleId);
  // }
}
