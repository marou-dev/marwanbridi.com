#!/usr/bin/env python3
"""Une carte de partage par essai, rendue depuis son titre.

Pourquoi un script et pas une dépendance de build : pas de nouveau paquet dans
la chaîne Astro, sortie déterministe et versionnée, re-jouable à la demande.
  python3 scripts/generate_og_cards.py          # tous les essais
  python3 scripts/generate_og_cards.py <slug>   # un seul
"""
import pathlib, re, subprocess, sys, html
from PIL import ImageFont

RACINE = pathlib.Path(__file__).resolve().parent.parent
ESSAIS = RACINE / "src/content/thinking"
SORTIE = RACINE / "public/og"
INTER  = subprocess.run(["fc-match", "-f", "%{file}", "Inter:weight=bold"],
                        capture_output=True, text=True).stdout.strip()

ACCENT, FOND, ENCRE, ESTOMPE = "#9c4a2e", "#faf8f6", "#1a1a1a", "#5a5550"
LARGEUR_TEXTE = 1000          # px disponibles pour le titre
MOIS = "janvier février mars avril mai juin juillet août septembre octobre novembre décembre".split()
MOIS_EN = "January February March April May June July August September October November December".split()


def frontmatter(p):
    t = p.read_text()
    bloc = t.split("---")[1]
    d = {}
    for cle in ("title", "date", "draft", "lang"):
        m = re.search(rf"^{cle}:\s*(.+)$", bloc, re.M)
        if m:
            d[cle] = m.group(1).strip().strip('"')
    m = re.search(r"^tags:\s*\[(.+)\]$", bloc, re.M)
    d["tags"] = [x.strip() for x in m.group(1).split(",")] if m else []
    return d


def decouper(titre, taille):
    """Découpe le titre en lignes avec les VRAIES métriques de la police."""
    f = ImageFont.truetype(INTER, taille)
    lignes, courante = [], ""
    for mot in titre.split():
        essai = f"{courante} {mot}".strip()
        if f.getlength(essai) <= LARGEUR_TEXTE or not courante:
            courante = essai
        else:
            lignes.append(courante); courante = mot
    if courante:
        lignes.append(courante)
    return lignes


def carte(meta, slug):
    titre = meta["title"]
    # on rétrécit jusqu'à tenir en 3 lignes — jamais de titre tronqué
    for taille in (58, 52, 46, 40):
        lignes = decouper(titre, taille)
        if len(lignes) <= 3:
            break
    interligne = int(taille * 1.22)
    haut = 250 - (len(lignes) - 1) * interligne // 2       # bloc centré verticalement

    en = meta.get("lang") == "en"
    an, mo, jo = meta["date"].split("-")
    pied = (f"{MOIS_EN[int(mo)-1]} {int(jo)}, {an}" if en
            else f"{int(jo)} {MOIS[int(mo)-1]} {an}")
    if meta["tags"]:
        pied += "   ·   " + "   ·   ".join(meta["tags"][:3])

    tspans = "".join(
        f'<tspan x="110" dy="{0 if i == 0 else interligne}">{html.escape(l)}</tspan>'
        for i, l in enumerate(lignes))
    hauteur_barre = len(lignes) * interligne + 16

    return f'''<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="{FOND}"/>
  <pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e8e4e0" stroke-width="0.5"/>
  </pattern>
  <rect width="1200" height="630" fill="url(#g)" opacity="0.4"/>
  <rect x="0" y="0" width="1200" height="4" fill="{ACCENT}"/>
  <rect x="80" y="{haut - taille}" width="4" height="{hauteur_barre}" fill="{ACCENT}" rx="2"/>
  <text font-family="Inter, sans-serif" font-weight="600" font-size="{taille}" fill="{ENCRE}" letter-spacing="-1" y="{haut}">{tspans}</text>
  <text x="110" y="{haut + len(lignes) * interligne + 34}" font-family="Inter, sans-serif" font-weight="400" font-size="22" fill="{ESTOMPE}">{html.escape(pied)}</text>
  <text x="110" y="552" font-family="Inter, sans-serif" font-weight="500" font-size="24" fill="{ENCRE}">Marwan Bridi<tspan dx="14" fill="{ACCENT}">·</tspan><tspan dx="14" font-weight="300" fill="{ESTOMPE}">{"Civil engineer, Geneva" if en else "Ingénieur civil, Genève"}</tspan></text>
  <line x1="900" y1="545" x2="1120" y2="545" stroke="{ACCENT}" stroke-width="1" opacity="0.3"/>
  <circle cx="1120" cy="545" r="3" fill="{ACCENT}" opacity="0.3"/>
  <rect x="0" y="626" width="1200" height="4" fill="{ACCENT}"/>
</svg>'''


def main():
    cible = sys.argv[1] if len(sys.argv) > 1 else None
    SORTIE.mkdir(parents=True, exist_ok=True)
    faits = 0
    for p in sorted(ESSAIS.glob("*.md")):
        slug = p.stem
        if cible and slug != cible:
            continue
        meta = frontmatter(p)
        if meta.get("draft") == "true":
            print(f"  — {slug}: brouillon, ignoré"); continue
        svg = SORTIE / f"{slug}.svg"
        svg.write_text(carte(meta, slug))
        subprocess.run(["rsvg-convert", "-w", "1200", "-h", "630",
                        str(svg), "-o", str(SORTIE / f"{slug}.png")], check=True)
        svg.unlink()                                  # le PNG est le livrable
        print(f"  ✅ {slug}.png")
        faits += 1
    print(f"\n  {faits} carte(s)")


if __name__ == "__main__":
    main()
