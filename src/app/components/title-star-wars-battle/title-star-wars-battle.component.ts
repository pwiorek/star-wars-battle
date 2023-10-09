import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title-star-wars-battle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-star-wars-battle.component.html',
  styleUrls: ['./title-star-wars-battle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleStarWarsBattleComponent {}
