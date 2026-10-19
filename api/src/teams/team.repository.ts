// L'accès aux données de Team. Hier : TeamRepository (Doctrine).
import { query } from '../db.js';
import { BaseRepository } from '../repository.js';
import type { Team } from './team.schema.js';

class TeamRepository extends BaseRepository<Team> {
  constructor() {
    super('team', ['id', 'name', 'tag', 'country'], 'name');
  }

  /** Toutes les équipes, ou celles d'un pays, triées par nom. */
  findByCountry(country?: string): Promise<Team[]> {
    if (!country) return query<Team>(`${this.select} ORDER BY name`);
    return query<Team>(`${this.select} WHERE country = $1 ORDER BY name`, [country]);
  }
}

export const teams = new TeamRepository();
