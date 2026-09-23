import { createHash, timingSafeEqual } from 'node:crypto';
import ExcelJS from 'exceljs';
import { listerPronostics } from '@/lib/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function motDePasseValide(saisi: string): boolean {
  const attendu = process.env.ADMIN_PASSWORD;
  if (!attendu) return false;
  const a = createHash('sha256').update(saisi).digest();
  const b = createHash('sha256').update(attendu).digest();
  return timingSafeEqual(a, b);
}

const dateParis = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Europe/Paris',
});

export async function POST(req: Request) {
  const form = await req.formData();
  if (!motDePasseValide(String(form.get('motDePasse') ?? ''))) {
    return Response.redirect(new URL('/admin?erreur=1', req.url), 303);
  }

  const pronostics = await listerPronostics();

  const classeur = new ExcelJS.Workbook();
  const feuille = classeur.addWorksheet('Pronostics');
  feuille.columns = [
    { header: 'Envoyé le', key: 'envoyeLe', width: 18 },
    { header: 'Nom', key: 'nom', width: 24 },
    { header: 'Prénom', key: 'prenom', width: 24 },
    { header: 'BU', key: 'bu', width: 20 },
    { header: 'Pronostic (€)', key: 'montant', width: 16, style: { numFmt: '#,##0 "€"' } },
  ];
  for (const p of pronostics) {
    feuille.addRow({ ...p, envoyeLe: dateParis.format(new Date(p.envoyeLe)) });
  }
  feuille.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  feuille.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC2255C' } };
  feuille.views = [{ state: 'frozen', ySplit: 1 }];
  feuille.autoFilter = { from: 'A1', to: 'E1' };

  const fichier = await classeur.xlsx.writeBuffer();
  const jour = new Date().toISOString().slice(0, 10);

  return new Response(fichier as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="pronostics-octobre-rose-${jour}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  });
}
