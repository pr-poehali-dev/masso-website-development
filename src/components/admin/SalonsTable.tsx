import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getSalonStatusLabel,
  getSalonStatusColor,
  formatDate,
} from '@/lib/admin-api';

interface Salon {
  id: number;
  name: string;
  city: string | null;
  owner_name: string | null;
  phone: string | null;
  email: string | null;
  tariff: string;
  status: string;
  specialist_count: number;
  created_at: string;
}

interface SalonsTableProps {
  salons: Salon[];
  loading: boolean;
  total: number;
  page: number;
  pages: number;
  onRowClick: (id: number) => void;
  onPageChange: (page: number) => void;
}

const SalonsTable = ({
  salons,
  loading,
  total,
  page,
  pages,
  onRowClick,
  onPageChange,
}: SalonsTableProps) => (
  <>
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
    >
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Icon
            name="Loader2"
            size={24}
            className="animate-spin"
            style={{ color: '#0da2e7' }}
          />
        </div>
      ) : salons.length === 0 ? (
        <div className="text-center py-16">
          <Icon name="Building2" size={40} className="mx-auto" style={{ color: '#d1d5db' }} />
          <p className="text-sm mt-3" style={{ color: '#9ca3af' }}>
            Салоны не найдены
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow style={{ borderColor: '#e5e7eb' }}>
              <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>ID</TableHead>
              <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Название</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Город</TableHead>
              <TableHead className="text-xs font-semibold hidden lg:table-cell" style={{ color: '#6b7280' }}>Владелец</TableHead>
              <TableHead className="text-xs font-semibold hidden lg:table-cell" style={{ color: '#6b7280' }}>Телефон</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Спец-ты</TableHead>
              <TableHead className="text-xs font-semibold hidden lg:table-cell" style={{ color: '#6b7280' }}>Тариф</TableHead>
              <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Статус</TableHead>
              <TableHead className="text-xs font-semibold hidden md:table-cell" style={{ color: '#6b7280' }}>Дата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salons.map((salon) => (
              <TableRow
                key={salon.id}
                className="cursor-pointer transition-colors"
                style={{ borderColor: '#f3f4f6' }}
                onClick={() => onRowClick(salon.id)}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}
              >
                <TableCell className="text-sm font-mono" style={{ color: '#6b7280' }}>
                  {salon.id}
                </TableCell>
                <TableCell className="text-sm font-medium" style={{ color: '#111827' }}>
                  {salon.name}
                </TableCell>
                <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>
                  {salon.city || '-'}
                </TableCell>
                <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>
                  {salon.owner_name || '-'}
                </TableCell>
                <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>
                  {salon.phone || '-'}
                </TableCell>
                <TableCell className="text-sm hidden md:table-cell" style={{ color: '#6b7280' }}>
                  {salon.specialist_count}
                </TableCell>
                <TableCell className="text-sm hidden lg:table-cell" style={{ color: '#6b7280' }}>
                  {salon.tariff}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border inline-block ${getSalonStatusColor(salon.status)}`}
                  >
                    {getSalonStatusLabel(salon.status)}
                  </span>
                </TableCell>
                <TableCell className="text-sm hidden md:table-cell" style={{ color: '#9ca3af' }}>
                  {formatDate(salon.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      )}
    </div>

    {pages > 1 && (
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Всего: {total}
        </p>
        <div className="flex items-center gap-1 flex-wrap gap-y-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg transition-colors disabled:opacity-30"
            style={{ color: '#374151' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '')}
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
            let pageNum: number;
            if (pages <= 7) {
              pageNum = i + 1;
            } else if (page <= 4) {
              pageNum = i + 1;
            } else if (page >= pages - 3) {
              pageNum = pages - 6 + i;
            } else {
              pageNum = page - 3 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: page === pageNum ? '#0da2e7' : 'transparent',
                  color: page === pageNum ? '#ffffff' : '#374151',
                }}
                onMouseEnter={(e) => {
                  if (page !== pageNum) e.currentTarget.style.background = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  if (page !== pageNum) e.currentTarget.style.background = 'transparent';
                }}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(Math.min(pages, page + 1))}
            disabled={page >= pages}
            className="p-2 rounded-lg transition-colors disabled:opacity-30"
            style={{ color: '#374151' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '')}
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
    )}
  </>
);

export default SalonsTable;