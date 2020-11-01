import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('carousel')
  private carousel: ElementRef;
  private sub: Subscription;
  private sub2: Subscription;
  
  // quand je ne le mets pas, en démarrant le serveur cela fait une erreur quand tu fais l'appel à l'API
  // en mettant ceci je passe par un proxi$y pour que cela fonctionne 
  private corsFix: string = "https://cors-anywhere.herokuapp.com/";
  private imageUrl: string = "http://62.210.247.201:9000/test";

  public images: Item[];

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    // lors de l'initialisation
    // appel api pour récuperer les images
    this.httpClient.get(this.corsFix + this.imageUrl).subscribe((resultat: Item[]) => {
      this.prepareImages(resultat);
    });
  }

  ngAfterViewInit(): void {
    // après l'initialisation de la vue, on modifie le style toute les millisecondes
    let pourcentage: number = 0;
    this.sub = interval(10)
      .subscribe(() => { pourcentage = pourcentage - 0.1; this.carousel.nativeElement.style.marginRight = pourcentage + "%" });

    //au bout d'une minute, on revient au départ
    this.sub2 = interval(60000).subscribe(() => {
      pourcentage = 0;
    });
  }

  // méthode qui prépare un random en fonction du poid de l'image
  private prepareImages(resultat: Item[]): void {
    if (resultat) {
      const weightArray: Item[] = [];
      resultat.forEach(item => {
        for (let i = 0; i < item.weight; i++) {
          weightArray.push(item);
        }
      });
      this.images = [];
      for (let i = 0; i < 100; i++) {
        this.images.push(weightArray[Math.floor(Math.random() * weightArray.length)]);
      }
    }
  }

  ngOnDestroy(): void {
    // désinscrit les observables
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }
}

export interface Item {
  name: string;
  image: string;
  weight: number;
}