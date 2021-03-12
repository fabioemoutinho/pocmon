import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinates, Direction, Tiles } from './map.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}

  getMap(): Observable<Tiles> {
    return this.http.get<Tiles>('/assets/data/map.json');
  }

  move(
    direction: Direction,
    fromCoordinates: Coordinates,
    tiles: Tiles
  ): Coordinates {
    const toCoordinates = this.getCoordinates(direction, fromCoordinates);

    if (
      !this.withinBounds(toCoordinates, tiles) ||
      !this.walkable(toCoordinates, tiles)
    ) {
      return fromCoordinates;
    }

    return toCoordinates;
  }

  canBattle(stepsToBattle: number, currentTile?: number): boolean {
    return currentTile === 2 && stepsToBattle === 0;
  }

  decrementStepsToBattle(stepsToBattle: number, currentTile?: number): boolean {
    return currentTile === 2 && stepsToBattle > 0;
  }

  canResetStepsToBattleAfterMove(
    currentTile?: number,
    previousTile?: number
  ): boolean {
    return currentTile !== undefined && currentTile < 2 && previousTile === 2;
  }

  resetStepsToBattle(): number {
    return Math.floor(Math.random() * 20) + 1;
  }

  private getCoordinates(
    direction: Direction,
    { x, y }: Coordinates
  ): Coordinates {
    if (direction === 'LEFT') {
      return { x: x - 1, y };
    }
    if (direction === 'RIGHT') {
      return { x: x + 1, y };
    }
    if (direction === 'UP') {
      return { x, y: y - 1 };
    }
    return { x, y: y + 1 };
  }

  private withinBounds({ x, y }: Coordinates, tiles: Tiles): boolean {
    return tiles[y] !== undefined && tiles[y][x] !== undefined;
  }

  private walkable({ x, y }: Coordinates, tiles: Tiles): boolean {
    return tiles[y][x] > 0;
  }
}
