import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Song} from "../../model/Song";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Chart} from "../../model/Chart";
import {Score, TachiImport} from "../../model/TachiImport";
import {pairwise, startWith} from "rxjs";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "@danielmoncada/angular-datetime-picker";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
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
    time: new FormControl(new Date()),
    judgements: new FormGroup({
      marvelous: new FormControl(),
      perfect: new FormControl(),
      great: new FormControl(),
      good: new FormControl(),
      ok: new FormControl(),
      miss: new FormControl(),
    })
  });

  constructor(private route: ActivatedRoute) {
    this.songs = this.route.snapshot.data['songs'].sort((a: Song, b: Song) => {
      const titleA = a.title.toUpperCase(); // ignore upper and lowercase
      const titleB = b.title.toUpperCase(); // ignore upper and lowercase
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
    this.group.controls.title.valueChanges.subscribe((change) => {
      if (change) {
        this.onSelectedSong(change)
      }
    });
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
      lamp: "CLEAR",
      score: 0,
      time: new Date()
    });
    this.selectedSong = undefined;
    this.selectedSongCharts = undefined;
  }

  onSelectedSong(selectedSongTitle: string) {
    this.selectedSong = this.songs.filter(song => song.title === selectedSongTitle).pop();
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
      timeAchieved: this.group.controls.time.value!.getTime(),
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
