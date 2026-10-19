// L'accès aux données de Player. Le CRUD vient de BaseRepository ; la vue avec l'équipe imbriquée
// est une requête écrite à la main (LEFT JOIN + json_build_object).
import { query } from '../db.js';
import { BaseRepository } from '../repository.js';
import type { Player, PlayerSummary, PlayerView } from './player.schema.js';

// La « vue » d'un joueur : sans birth_date, avec son équipe réduite à { id, name, tag } (ou null)
const VIEW = `
  SELECT p.id, p.nickname, p.country, p.role, p.rating,
         CASE WHEN t.id IS NULL THEN NULL
              ELSE json_build_object('id', t.id, 'name', t.name, 'tag', t.tag) END AS team
    FROM player p
    LEFT JOIN team t ON t.id = p.team_id`;

class PlayerRepository extends BaseRepository<Player> {
  constructor() {
    super('player', ['id', 'nickname', 'country', 'role', 'rating', 'birth_date AS "birthDate"', 'team_id AS "teamId"'], 'nickname');
  }

  /** La vue d'un joueur, ou null. */
  async findView(id: number): Promise<PlayerView | null> {
    const [row] = await query<PlayerView>(`${VIEW} WHERE p.id = $1`, [id]);
    return row ?? null;
  }

  /** Toutes les vues, triées par pseudo. */
  findViews(): Promise<PlayerView[]> {
    return query<PlayerView>(`${VIEW} ORDER BY p.nickname`);
  }

  /** Les joueurs d'une équipe, pour GET /api/teams/:id. */
  findByTeam(teamId: number): Promise<PlayerSummary[]> {
    return query<PlayerSummary>(
      `SELECT id, nickname, role, rating FROM player WHERE team_id = $1 ORDER BY nickname`,
      [teamId],
    );
  }
}

export const players = new PlayerRepository();
