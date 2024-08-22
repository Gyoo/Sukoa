import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Song} from "../../model/Song";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Chart} from "../../model/Chart";
import {Score, TachiImport} from "../../model/TachiImport";
import {pairwise, startWith} from "rxjs";
import {isRomaji, tokenize, toRomaji} from "wanakana";
import {NgxTypeAheadComponent} from "ngx-typeahead";
import {allOrNoneRequiredValidator} from "../../validators/all-or-none.validator";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxTypeAheadComponent,
    NgClass,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {

  songs: Song[];
  charts: Chart[] = [];
  selectedSong: Song | undefined;
  selectedSongCharts: Chart[] | undefined;


  scores: Score[] = [];

  playstyle = new FormControl("SP", Validators.required);

  group = new FormGroup({
    title: new FormControl("", Validators.required),
    difficulty: new FormControl("", Validators.required),
    score: new FormControl(0, {nonNullable: true, validators: Validators.required}),
    lamp: new FormControl("CLEAR", Validators.required),
    flare: new FormControl(),
    time: new FormControl(new Date().toISOString().slice(0, 16), Validators.required),
    judgements: new FormGroup({
      marvelous: new FormControl(),
      perfect: new FormControl(),
      great: new FormControl(),
      good: new FormControl(),
      ok: new FormControl(),
      miss: new FormControl(),
    }, allOrNoneRequiredValidator)
  });

  constructor(private route: ActivatedRoute) {
    this.songs = this.route.snapshot.data['songs'].map((song: Song) => {
      song.romajiTitle = tokenize(song.title).map((token: any) => toRomaji(token, {convertLongVowelMark: true})).join(' ');
      if(!isRomaji(song.title)){
        song.label = song.title + " [" + song.romajiTitle + "]"
      }
      else{
        song.label = song.title;
      }
      return song;
    }).sort((a: Song, b: Song) => {
      const titleA = a.romajiTitle.toUpperCase(); // ignore upper and lowercase
      const titleB = b.romajiTitle.toUpperCase(); // ignore upper and lowercase
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }

      // titles must be equal
      return 0;
    });
    this.charts = this.route.snapshot.data['charts'];
    this.playstyle.valueChanges.pipe(startWith("SP"), pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        console.log(prev, next);
      if(this.group.dirty){
        if(confirm('Warning : changing your playstyle will reset the form')){
          this.reset();
        }
        else{
          this.playstyle.setValue(prev, {emitEvent: false});
        }
      }
    })
  }

  reset(){
    this.group.reset({
      title: "",
      lamp: "CLEAR",
      score: 0,
      time: new Date().toISOString().slice(0, 16)
    });
    this.selectedSong = undefined;
    this.selectedSongCharts = undefined;
  }

  onSelectedSong(selectedSong: Song) {
    this.selectedSong = selectedSong;
    if(this.selectedSong) {
      this.selectedSongCharts = this.charts.filter(chart => chart.songID === this.selectedSong?.id && chart.playtype === this.playstyle.value).sort((a, b) => +a.level - +b.level);
    }
  }

  getSongTitle(inGameID: string){
    return this.songs.filter(song => "" + song.id === inGameID).pop()?.title;
  }

  getChartLevel(inGameID: string, difficulty: string){
    return this.charts.filter(chart => "" + chart.songID === inGameID && chart.difficulty === difficulty).pop()?.level;
  }

  addScore() {
    let score: Score = {
      lamp: this.group.controls.lamp.value!,
      timeAchieved: new Date(this.group.controls.time.value!).getTime(),
      matchType: "inGameID",
      identifier: "" + this.selectedSong?.id!,
      difficulty: this.group.controls.difficulty.value!,
      score: this.group.controls.score.value!
    }
    if (this.group.controls.judgements.dirty) {
      score.judgements = {
        GOOD: this.group.controls.judgements.controls.good.value!,
        GREAT: this.group.controls.judgements.controls.great.value!,
        MARVELOUS: this.group.controls.judgements.controls.marvelous.value!,
        MISS: this.group.controls.judgements.controls.miss.value!,
        OK: this.group.controls.judgements.controls.ok.value!,
        PERFECT: this.group.controls.judgements.controls.perfect.value!
      }
    }
    if (this.group.controls.flare.value) {
      score.optional = {
        flare: this.group.controls.flare.value
      }
    }
    this.scores.push(score);
    this.reset();
  }

  generate() {
    const importFile: TachiImport = {
      meta: {
        game: "ddr",
        service: "sukoa",
        version: "",
        playtype: this.playstyle.value!
      },
      scores: this.scores
    };
    let file = new Blob([JSON.stringify(importFile)], {type: 'application/json'});
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "sukoa.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
