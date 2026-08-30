# Guett Gui — Regles & Conventions Next.js (Backoffice)

**Stack** : Next.js 14+ (App Router) / TypeScript 5+ / Tailwind CSS / shadcn/ui
**Statut** : Hors MVP — implementation ulterieure
**Derniere MAJ** : 2026-08-30

---

## Table des matieres

1. Architecture
2. Conventions de nommage
3. Structure des fichiers
4. App Router & Routing
5. Server Components vs Client Components
6. Data Fetching
7. State Management
8. Styling (Tailwind + shadcn/ui)
9. Formulaires & Validation
10. Authentification & Autorisation
11. Securite
12. Performance & Optimisation
13. Gestion des erreurs
14. Tests
15. SEO & Metadata
16. Deploiement
17. Git & CI
18. Registre des fonctionnalites

---

## 1. Architecture

### 1.1 App Router (Next.js 14+)

Le backoffice utilise le App Router de Next.js :

```
app/
  (auth)/           # Groupe de routes auth (layout sans sidebar)
    login/
    forgot-password/
  (dashboard)/      # Groupe de routes dashboard (layout avec sidebar)
    overview/
    teams/
    users/
    flocks/
    finances/
    reports/
    settings/
  api/              # Route Handlers (API interne si besoin)
  layout.tsx        # Root layout
  not-found.tsx     # Page 404
```

### 1.2 Regles de couche

```
Page (Server Component)
  → Fetch data (server-side)
  → Passe les props aux composants

Client Components
  → Interactivite (forms, modals, tables interactives)
  → State local (useState, useReducer)

Server Actions
  → Mutations (create, update, delete)
  → Revalidation de cache
```

### 1.3 Principe : Server-first

- Par defaut, tout est Server Component
- Ajouter `'use client'` uniquement quand necessaire (interactivite, hooks browser)
- Fetch les donnees cote serveur autant que possible
- Mutations via Server Actions

---

## 2. Conventions de nommage

### 2.1 Fichiers

| Type | Convention | Exemple |
|------|-----------|---------|
| Page | `page.tsx` | `app/(dashboard)/teams/page.tsx` |
| Layout | `layout.tsx` | `app/(dashboard)/layout.tsx` |
| Loading | `loading.tsx` | `app/(dashboard)/teams/loading.tsx` |
| Error | `error.tsx` | `app/(dashboard)/teams/error.tsx` |
| Not found | `not-found.tsx` | `app/not-found.tsx` |
| Component | PascalCase | `TeamCard.tsx` |
| Hook | camelCase, prefixe `use` | `useTeamFilters.ts` |
| Utilitaire | camelCase | `formatCurrency.ts` |
| Type | PascalCase | `TeamWithMembers.ts` |
| Server Action | camelCase | `createTeam.ts` |
| API Route | `route.ts` | `app/api/health/route.ts` |
| Test | `<fichier>.test.tsx` | `TeamCard.test.tsx` |

### 2.2 Code TypeScript

| Type | Convention | Exemple |
|------|-----------|---------|
| Component | PascalCase | `TeamMembersTable` |
| Props | PascalCase + Props | `TeamMembersTableProps` |
| Hook | camelCase, `use` prefix | `useTeamMembers` |
| Server Action | camelCase | `deleteTeamMember` |
| Constante | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| CSS class | kebab-case (Tailwind) | `bg-primary text-white` |

### 2.3 Routes URL

```
/login
/overview
/teams
/teams/[teamId]
/teams/[teamId]/members
/teams/[teamId]/flocks
/users
/reports
/settings
```

---

## 3. Structure des fichiers

```
backoffice/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── overview/
│   │   │   └── page.tsx
│   │   ├── teams/
│   │   │   ├── page.tsx                    # Liste des equipes
│   │   │   ├── [teamId]/
│   │   │   │   ├── page.tsx                # Detail equipe
│   │   │   │   ├── members/page.tsx
│   │   │   │   ├── flocks/page.tsx
│   │   │   │   └── finances/page.tsx
│   │   │   └── loading.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx                      # Sidebar + header
│   ├── api/
│   │   └── health/route.ts
│   ├── layout.tsx                          # Root layout (providers, fonts)
│   ├── globals.css                         # Tailwind directives
│   └── not-found.tsx
│
├── components/
│   ├── ui/                                 # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── data-table.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── breadcrumb.tsx
│   │   └── user-nav.tsx
│   ├── teams/                              # Composants specifiques
│   │   ├── team-card.tsx
│   │   ├── team-form.tsx
│   │   ├── team-members-table.tsx
│   │   └── team-stats.tsx
│   ├── flocks/
│   ├── finances/
│   └── shared/
│       ├── data-table-toolbar.tsx
│       ├── date-range-picker.tsx
│       ├── stat-card.tsx
│       └── empty-state.tsx
│
├── lib/
│   ├── api/                                # Client API (fetch vers le backend NestJS)
│   │   ├── client.ts                       # Fetch wrapper avec auth
│   │   ├── teams.ts                        # API calls teams
│   │   ├── flocks.ts
│   │   └── ...
│   ├── actions/                            # Server Actions
│   │   ├── team-actions.ts
│   │   ├── user-actions.ts
│   │   └── ...
│   ├── hooks/                              # Custom hooks client
│   │   ├── use-debounce.ts
│   │   └── use-pagination.ts
│   ├── types/                              # Types partages
│   │   ├── team.ts
│   │   ├── flock.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── formatters.ts                   # XOF, dates, pourcentages
│   │   ├── validators.ts
│   │   └── cn.ts                           # clsx + tailwind-merge
│   ├── constants.ts
│   └── auth.ts                             # Session + middleware auth
│
├── public/
│   ├── images/
│   └── icons/
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
├── middleware.ts                            # Auth middleware (redirect si pas connecte)
└── .env.example
```

---

## 4. App Router & Routing

### 4.1 Regles

- Utiliser les groupes de routes `(auth)` et `(dashboard)` pour les layouts differents
- `loading.tsx` dans chaque dossier de page pour les Suspense boundaries
- `error.tsx` dans les pages critiques
- Layouts imbriques pour la sidebar + header
- Pas de `useRouter` pour la navigation — utiliser `<Link>` et `redirect()`

### 4.2 Layouts

```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
```

### 4.3 Pages

```tsx
// app/(dashboard)/teams/page.tsx — Server Component par defaut
import { getTeams } from '@/lib/api/teams';

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <div>
      <h1 className="text-2xl font-bold">Equipes</h1>
      <TeamsTable data={teams} />
    </div>
  );
}
```

---

## 5. Server Components vs Client Components

### 5.1 Regles de decision

| Besoin | Type |
|--------|------|
| Fetch de donnees | Server Component |
| Affichage statique | Server Component |
| `useState`, `useEffect` | Client Component (`'use client'`) |
| Event handlers (`onClick`, `onChange`) | Client Component |
| Hooks browser (`usePathname`, `useSearchParams`) | Client Component |
| Formulaires interactifs | Client Component |
| Modals, dropdowns, tooltips | Client Component |

### 5.2 Pattern de composition

```tsx
// Page = Server Component (fetch data)
export default async function FlockPage({ params }: { params: { id: string } }) {
  const flock = await getFlock(params.id);
  return <FlockDetail flock={flock} />; // Client component recoit les props
}

// Client Component = interactivite
'use client';
export function FlockDetail({ flock }: { flock: Flock }) {
  const [isEditing, setIsEditing] = useState(false);
  // ...
}
```

### 5.3 Interdits

- PAS de `async` dans un Client Component
- PAS de `fetch` dans un Client Component si le Server Component peut le faire
- PAS de `'use client'` sur les pages — garder les pages comme Server Components

---

## 6. Data Fetching

### 6.1 Client API

```typescript
// lib/api/client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getServerSession(); // ou cookies()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, await res.json());
  }

  return res.json();
}
```

### 6.2 Regles

- Fetch dans les Server Components (pas de `useEffect` + `useState` pour les donnees)
- `revalidatePath()` / `revalidateTag()` apres les mutations
- Cache par defaut (`force-cache`), `no-store` pour les donnees temps reel
- Gerer les erreurs avec `error.tsx` ou `try/catch`

---

## 7. State Management

### 7.1 Regles

- State serveur : fetch dans les Server Components (pas de state management lib)
- State formulaire : `react-hook-form` + `zod`
- State UI local : `useState` / `useReducer`
- State URL : `useSearchParams` pour les filtres, pagination, tri
- PAS de Redux, Zustand, Jotai — pas necessaire avec le App Router

### 7.2 Filtres via URL

```tsx
'use client';

export function TeamsToolbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  // ...
}
```

---

## 8. Styling (Tailwind + shadcn/ui)

### 8.1 Regles

- Utiliser shadcn/ui comme base de composants (installe via CLI)
- Tailwind pour tout le styling — PAS de CSS modules, styled-components, etc.
- Utiliser `cn()` pour les classes conditionnelles :
  ```tsx
  import { cn } from '@/lib/utils/cn';
  <div className={cn('p-4 rounded-lg', isActive && 'bg-primary text-white')} />
  ```
- Couleurs du theme dans `tailwind.config.ts` (pas de valeurs hardcodees)
- Responsive : mobile-first (`sm:`, `md:`, `lg:`)

### 8.2 Theme

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2E7D32', dark: '#1B5E20', light: '#E8F5E9' },
        accent: { DEFAULT: '#8D6E63', dark: '#5D4037', light: '#EFEBE9' },
        // ... couleurs du design system Guett Gui
      },
    },
  },
};
```

### 8.3 Conventions classes

- Ordre : layout → sizing → spacing → typography → colors → effects
- `className="flex items-center gap-2 p-4 text-sm text-gray-700 bg-white rounded-lg shadow-sm"`
- Max 1 ligne de classes — sinon extraire en composant

---

## 9. Formulaires & Validation

### 9.1 Stack

- `react-hook-form` pour la gestion de formulaire
- `zod` pour la validation (schema partage avec le backend si possible)
- `@hookform/resolvers/zod` pour connecter les deux

### 9.2 Pattern

```tsx
'use client';

const teamSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  location: z.string().optional(),
  targetLayingRate: z.number().min(0).max(100).default(70),
});

type TeamFormValues = z.infer<typeof teamSchema>;

export function TeamForm({ team }: { team?: Team }) {
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: team || { name: '', targetLayingRate: 70 },
  });

  async function onSubmit(values: TeamFormValues) {
    await createTeamAction(values); // Server Action
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ... */}
      </form>
    </Form>
  );
}
```

---

## 10. Authentification & Autorisation

### 10.1 Regles

- Auth admin separee de l'auth mobile (le backoffice a ses propres credentials)
- Session cookie HTTP-only (pas de JWT cote client)
- Middleware Next.js pour la protection des routes
- Role admin requis pour acceder au backoffice

### 10.2 Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next|images|icons|favicon.ico).*)'],
};
```

---

## 11. Securite

### 11.1 Regles

- CSRF : Next.js gere automatiquement avec les Server Actions
- XSS : React echappe automatiquement — ne JAMAIS utiliser `dangerouslySetInnerHTML`
- Auth : cookies HTTP-only, Secure, SameSite=Strict
- Variables d'environnement :
  - `NEXT_PUBLIC_*` = expose au client (uniquement l'URL API)
  - Sans prefixe = serveur uniquement (secrets, tokens)
- Rate limiting : via le backend NestJS (pas dans Next.js)
- Headers securite : `next.config.ts` → `headers()`

### 11.2 Server Actions

```typescript
'use server';

export async function deleteTeam(teamId: string) {
  // 1. Verifier la session
  const session = await getSession();
  if (!session?.isAdmin) throw new Error('Non autorise');

  // 2. Valider l'input
  const parsed = z.string().cuid().safeParse(teamId);
  if (!parsed.success) throw new Error('ID invalide');

  // 3. Executer l'action
  await apiFetch(`/teams/${parsed.data}`, { method: 'DELETE' });

  // 4. Revalider
  revalidatePath('/teams');
}
```

---

## 12. Performance & Optimisation

### 12.1 Images

- `next/image` pour toutes les images (optimisation automatique)
- Definir `width` et `height` ou utiliser `fill` avec `sizes`
- Formats modernes (WebP, AVIF) automatiquement servis

### 12.2 Fonts

- `next/font` pour le chargement (pas de FOUT)
- Self-hosted, pas de Google Fonts externe

### 12.3 Bundle

- Dynamic imports pour les composants lourds (graphiques, editeurs)
  ```tsx
  const Chart = dynamic(() => import('@/components/chart'), { ssr: false });
  ```
- Analyser le bundle : `@next/bundle-analyzer`

### 12.4 Cache

- `fetch` avec `revalidate` pour le cache ISR
- `unstable_cache` pour les donnees serveur frequentes
- `revalidatePath` / `revalidateTag` apres les mutations

---

## 13. Gestion des erreurs

### 13.1 Regles

- `error.tsx` dans chaque dossier de page (Error Boundary automatique)
- `not-found.tsx` pour les 404
- `loading.tsx` pour les Suspense
- Try/catch dans les Server Actions avec messages utilisateur clairs
- Toast notifications pour les erreurs non-bloquantes (sonner / react-hot-toast)

### 13.2 Pattern error boundary

```tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-xl font-semibold">Une erreur est survenue</h2>
      <p className="text-gray-600">{error.message}</p>
      <Button onClick={reset}>Reessayer</Button>
    </div>
  );
}
```

---

## 14. Tests

### 14.1 Stack

- `vitest` pour les tests unitaires
- `@testing-library/react` pour les tests de composants
- `playwright` pour les tests e2e (si necessaire)

### 14.2 Regles

- Tester les Server Actions (validation + appel API)
- Tester les composants interactifs (formulaires, tables, modals)
- Tester les utilitaires (formatters, validators)
- Nommage : `should <expected> when <condition>`

---

## 15. SEO & Metadata

### 15.1 Regles

- Le backoffice est prive — pas de SEO necessaire
- `robots.txt` : `Disallow: /`
- Metadata de base (titre de page) via `generateMetadata`

```tsx
export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Equipe ${params.teamId} | Guett Gui Admin`,
  };
}
```

---

## 16. Deploiement

### 16.1 Build

- `next build` en mode standalone (`output: 'standalone'` dans `next.config.ts`)
- Docker multi-stage pour le deploiement

### 16.2 Variables d'environnement

```env
# Serveur uniquement
API_URL=http://api:3000/v1
SESSION_SECRET=xxx
ADMIN_EMAIL=admin@guettgui.com

# Client
NEXT_PUBLIC_API_URL=https://api.guettgui.com/v1
```

---

## 17. Git & CI

### 17.1 Commits

- Meme convention que les autres projets
- Format : `type(backoffice): description`
- Scope : `backoffice` pour differencier du mobile et du backend

### 17.2 Pre-commit

- `eslint --fix`
- `prettier --write`
- `tsc --noEmit`

---

## 18. Registre des fonctionnalites

> **OBLIGATOIRE** : Avant de coder une fonctionnalite, verifier ici si elle existe deja.
> Apres implementation, ajouter une entree.

### Pages implementees

| Page | Route | Fichier | Description |
|------|-------|---------|-------------|
| | | | |

### Composants partages

| Composant | Fichier | Description |
|-----------|---------|-------------|
| | | |

### Server Actions

| Action | Fichier | Description |
|--------|---------|-------------|
| | | |

### Hooks custom

| Hook | Fichier | Description |
|------|---------|-------------|
| | | |

### API Client functions

| Fonction | Fichier | Endpoint backend | Description |
|----------|---------|-----------------|-------------|
| | | | |

---

*Ce document est vivant. Chaque nouveau developpement doit mettre a jour le registre des fonctionnalites.*
*Note : Le backoffice est hors MVP. Ce document est prepare pour une implementation future.*
