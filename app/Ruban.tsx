/** Grand ruban rose décoratif en fond de page. */
export function RubanFond({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 560" aria-hidden="true">
      <path
        fill="currentColor"
        d="M200 20c-62 0-108 48-108 110 0 58 34 118 76 180L36 520l74 30 124-176 124 176 74-30-132-210c42-62 76-122 76-180 0-62-46-110-108-110zm0 70c24 0 40 18 40 42 0 32-18 70-40 104-22-34-40-72-40-104 0-24 16-42 40-42z"
      />
    </svg>
  );
}
