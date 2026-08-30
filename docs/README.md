# Guett Gui — Documentation

## Structure

```
docs/
├── PLAN.md                          # Plan d'implementation MVP (checkboxes)
├── README.md                        # Ce fichier (index)
│
├── specs/                           # Specifications fonctionnelles & techniques
│   ├── 00_CAHIER_DES_CHARGES.pdf    # Cahier des charges original (PDF)
│   ├── 01_PRD.md                    # Product Requirements Document
│   ├── 02_ARCHITECTURE.md           # Architecture technique (Flutter + NestJS)
│   ├── 03_DATABASE.md               # Schema BDD (Prisma/PostgreSQL)
│   └── 04_DESIGN_SYSTEM.md         # Design system, couleurs, composants UI
│
├── rules/                           # Regles de dev & registre des fonctionnalites
│   ├── FLUTTER_RULES.md             # Conventions Flutter/Dart + registre features mobile
│   ├── NESTJS_RULES.md              # Conventions NestJS/TypeScript + registre features backend
│   └── NEXTJS_RULES.md              # Conventions Next.js + registre features backoffice
│
├── design/                          # Maquettes & inspirations visuelles
│   └── inspiration_dahiraconnect.jpeg
│
└── references/                      # Documents de travail / sources externes
    └── Plan_projet_elevage_Goliath_equipe.docx
```

## Projets

| Dossier | Stack | Description |
|---------|-------|-------------|
| `mobile/` | Flutter + Dart | App mobile Android/iOS |
| `backend/` | NestJS + Prisma + PostgreSQL | API REST + WebSocket |
| `backoffice/` | Next.js + Tailwind + shadcn/ui | Admin web (hors MVP) |

## Workflow obligatoire

### Avant de coder une fonctionnalite

1. Lire le fichier rules correspondant (`FLUTTER_RULES.md`, `NESTJS_RULES.md`, ou `NEXTJS_RULES.md`)
2. Verifier le **registre des fonctionnalites** (section 15/17/18) pour eviter les doublons
3. Verifier si un widget/service/utilitaire existant peut etre reutilise

### Apres avoir code une fonctionnalite

1. Mettre a jour le **registre des fonctionnalites** dans le fichier rules correspondant
2. Cocher la case dans `PLAN.md`
