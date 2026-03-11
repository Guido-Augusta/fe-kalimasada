interface HafalanLabelsProps {
  kualitas?: string;
  keterangan?: string;
  checked?: boolean;
  showKualitas?: boolean;
  showHafalLabel?: boolean;
}

const kualitasStyles: Record<string, string> = {
  Kurang: 'bg-red-100 text-red-700',
  Cukup: 'bg-yellow-100 text-yellow-700',
  Baik: 'bg-lime-100 text-lime-700',
  SangatBaik: 'bg-emerald-100 text-emerald-700',
};

export function HafalanLabels({
  kualitas,
  keterangan,
  checked,
  showKualitas = true,
  showHafalLabel = true,
}: HafalanLabelsProps) {
  const displayKualitas = kualitas || '';
  const displayKeterangan = keterangan || '';

  if (displayKeterangan) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {displayKualitas && showKualitas && (
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              kualitasStyles[displayKualitas] ||
              'bg-emerald-100 text-emerald-700'
            }`}
          >
            {displayKualitas}
          </span>
        )}
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            displayKeterangan === 'Lanjut'
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          {displayKeterangan}
        </span>
        {displayKeterangan === 'Lanjut' && showHafalLabel && (
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
            Hafal
          </span>
        )}
      </div>
    );
  }

  if (checked !== undefined) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {checked ? (
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
            Hafal
          </span>
        ) : (
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
            Belum Hafal
          </span>
        )}
      </div>
    );
  }

  return null;
}

// Status badge styles mapping
const statusStyles: Record<string, string> = {
  TambahHafalan: 'bg-green-100 text-green-700',
  Murajaah: 'bg-yellow-100 text-yellow-700',
  Tahsin: 'bg-blue-100 text-blue-700',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
        statusStyles[status] || 'bg-gray-100 text-gray-700'
      } ${className}`}
    >
      {status}
    </span>
  );
}
