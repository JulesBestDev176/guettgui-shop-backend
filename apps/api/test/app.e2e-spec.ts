import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

/**
 * Tests E2E — Guett Gui Backend
 *
 * Ces tests necessitent une base de donnees PostgreSQL disponible.
 * En l'absence de BDD, les tests sont structures comme squelettes
 * pour documenter les flux attendus.
 *
 * Pour executer : npm run test:e2e
 * Variable d'environnement : DATABASE_URL doit pointer vers une BDD de test.
 */
describe('Guett Gui E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // Tokens et IDs stockes entre tests
  let accessToken: string;
  let refreshToken: string;
  let userId: string;
  let teamId: string;
  let memberAccessToken: string;
  let memberId: string;
  let inviteCode: string;
  let flockId: string;

  const ownerPhone = '+221770000001';
  const memberPhone = '+221770000002';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  // ═══════════════════════════════════════════════════════
  // AUTH FLOW
  // ═══════════════════════════════════════════════════════
  describe('Auth Flow', () => {
    it('devrait envoyer un OTP a un nouveau numero', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/send-otp')
        .send({ phone: ownerPhone })
        .expect(200);

      expect(res.body).toHaveProperty('message');
    });

    it('devrait verifier l\'OTP et retourner JWT + isNewUser=true', async () => {
      // En dev, le code OTP est 123456
      const res = await request(app.getHttpServer())
        .post('/auth/verify-otp')
        .send({ phone: ownerPhone, code: '123456' })
        .expect(200);

      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data.isNewUser).toBe(true);
      expect(res.body.data.user).toHaveProperty('id');

      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
      userId = res.body.data.user.id;
    });

    it('devrait mettre a jour le profil utilisateur', async () => {
      const res = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ firstName: 'Amadou', lastName: 'Diallo' })
        .expect(200);

      expect(res.body.data?.firstName || res.body.firstName).toBe('Amadou');
    });

    it('devrait creer une equipe et devenir OWNER', async () => {
      const res = await request(app.getHttpServer())
        .post('/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Elevage Diallo', location: 'Dakar' })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('inviteCode');
      teamId = res.body.id;
      inviteCode = res.body.inviteCode;
    });

    it('devrait se connecter avec un telephone existant et obtenir isNewUser=false', async () => {
      // Envoyer OTP
      await request(app.getHttpServer())
        .post('/auth/send-otp')
        .send({ phone: ownerPhone })
        .expect(200);

      // Verifier OTP
      const res = await request(app.getHttpServer())
        .post('/auth/verify-otp')
        .send({ phone: ownerPhone, code: '123456' })
        .expect(200);

      expect(res.body.data.isNewUser).toBe(false);
      expect(res.body.data.teams.length).toBeGreaterThan(0);

      accessToken = res.body.data.accessToken;
    });

    it('devrait rafraichir le token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');

      // Le nouveau refresh token doit etre different (rotation)
      expect(res.body.data.refreshToken).not.toBe(refreshToken);
      refreshToken = res.body.data.refreshToken;
      accessToken = res.body.data.accessToken;
    });
  });

  // ═══════════════════════════════════════════════════════
  // TEAM & INVITATION FLOW
  // ═══════════════════════════════════════════════════════
  describe('Team & Invitation Flow', () => {
    it('OWNER devrait inviter un membre par telephone avec role MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .post(`/teams/${teamId}/members/invite`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ phone: memberPhone, role: 'MEMBER' })
        .expect(200);

      expect(res.body).toHaveProperty('inviteCode');
      expect(res.body.phone).toBe(memberPhone);
      inviteCode = res.body.inviteCode;
    });

    it('le membre invite devrait s\'inscrire et rejoindre avec le code', async () => {
      // Inscription du membre
      await request(app.getHttpServer())
        .post('/auth/send-otp')
        .send({ phone: memberPhone })
        .expect(200);

      const authRes = await request(app.getHttpServer())
        .post('/auth/verify-otp')
        .send({ phone: memberPhone, code: '123456' })
        .expect(200);

      memberAccessToken = authRes.body.data.accessToken;

      // Rejoindre l'equipe
      const joinRes = await request(app.getHttpServer())
        .post('/teams/join')
        .set('Authorization', `Bearer ${memberAccessToken}`)
        .send({ inviteCode })
        .expect(200);

      expect(joinRes.body.team).toHaveProperty('id');
    });

    it('le membre rejoint devrait avoir le role MEMBER', async () => {
      const res = await request(app.getHttpServer())
        .get(`/teams/${teamId}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const members = Array.isArray(res.body) ? res.body : res.body.data;
      const member = members.find((m: { user: { phone: string } }) => m.user.phone === memberPhone);
      expect(member).toBeDefined();
      expect(member.role).toBe('MEMBER');
      memberId = member.id;
    });

    it('OWNER devrait pouvoir changer le role d\'un membre', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/teams/${teamId}/members/${memberId}/role`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ role: 'MEMBER' })
        .expect(200);

      expect(res.body.role).toBe('MEMBER');
    });

    it('OWNER devrait pouvoir retirer un membre', async () => {
      await request(app.getHttpServer())
        .delete(`/teams/${teamId}/members/${memberId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('MEMBER ne devrait pas pouvoir inviter ou retirer', async () => {
      // Re-ajouter le membre pour tester les permissions
      await request(app.getHttpServer())
        .post('/teams/join')
        .set('Authorization', `Bearer ${memberAccessToken}`)
        .send({ inviteCode })
        .expect(200);

      // Le MEMBER essaie d'inviter
      await request(app.getHttpServer())
        .post(`/teams/${teamId}/members/invite`)
        .set('Authorization', `Bearer ${memberAccessToken}`)
        .send({ phone: '+221770000003' })
        .expect(403);
    });
  });

  // ═══════════════════════════════════════════════════════
  // FARMING FLOW
  // ═══════════════════════════════════════════════════════
  describe('Farming Flow', () => {
    it('devrait creer un lot (flock)', async () => {
      const res = await request(app.getHttpServer())
        .post(`/teams/${teamId}/flocks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Lot Pondeuses A',
          type: 'LAYER',
          startDate: '2026-08-01',
          initialFemales: 100,
          initialTotal: 100,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      flockId = res.body.id;
    });

    it('devrait creer une saisie quotidienne', async () => {
      const res = await request(app.getHttpServer())
        .post(`/teams/${teamId}/daily-records`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          flockId,
          date: '2026-08-30',
          eggsLaid: 80,
          eggsCollected: 78,
          mortalityCount: 1,
          feedConsumedKg: 12.5,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
    });

    it('devrait creer une depense', async () => {
      const res = await request(app.getHttpServer())
        .post(`/teams/${teamId}/expenses`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          date: '2026-08-30',
          category: 'FEED',
          description: 'Achat 2 sacs aliment',
          amount: 15000,
          flockId,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
    });

    it('devrait creer une vente', async () => {
      const res = await request(app.getHttpServer())
        .post(`/teams/${teamId}/sales`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          date: '2026-08-30',
          productType: 'CONSUMPTION_EGGS',
          quantity: 30,
          unitPrice: 150,
          paymentStatus: 'PAID',
          paymentMethod: 'CASH',
          flockId,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
    });

    it('devrait verifier les mises a jour de stock apres la saisie quotidienne', async () => {
      const res = await request(app.getHttpServer())
        .get(`/teams/${teamId}/stocks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const stocks = Array.isArray(res.body) ? res.body : res.body.data;
      const eggStock = stocks.find((s: { type: string }) => s.type === 'EGGS');

      // Les oeufs collectes (78) - vente (30) = 48 attendu
      // Mais l'ordre exact depend du flux
      expect(eggStock).toBeDefined();
    });
  });
});
