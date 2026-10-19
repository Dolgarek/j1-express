// Les routes de Team. Hier : TeamController.
import { Router } from 'express';
import { HttpError } from '../errors.js';
import { parseId } from '../middlewares/params.js';
import { validateQuery } from '../middlewares/validate.js';
import { teams } from './team.repository.js';
import { TeamQuerySchema, type TeamQuery } from './team.schema.js';

export const teamRouter = Router();

// GET /api/teams[?country=FR]
teamRouter.get('/', validateQuery(TeamQuerySchema), async (_req, res) => {
  const { country } = res.locals.query as TeamQuery;
  res.json(await teams.findByCountry(country));
});

// GET /api/teams/:id
teamRouter.get('/:id', async (req, res) => {
  const team = await teams.findOne(parseId(req.params.id, 'Team'));
  if (!team) throw new HttpError(404, 'Team not found');
  res.json(team);
});
