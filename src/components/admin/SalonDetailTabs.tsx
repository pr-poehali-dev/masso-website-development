import React from 'react';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getTrainingStatusLabel,
  getTrainingStatusColor,
  getAccessStatusLabel,
  getAccessStatusColor,
  formatDate,
  formatDateTime,
} from '@/lib/admin-api';

interface Specialist {
  id: number;
  name: string;
  email: string | null;
  experience_years: number;
  training_status: string;
  attestation_status: string;
  created_at: string;
}

interface Comment {
  id: number;
  text: string;
  author_name: string | null;
  created_at: string;
}

interface Access {
  id: number;
  specialist_id: number | null;
  email: string;
  status: string;
  issued_at: string;
  activated_at: string | null;
}

interface SpecialistsTabProps {
  specialists: Specialist[];
}

export const SpecialistsTab = ({ specialists }: SpecialistsTabProps) => (
  <div
    className="rounded-xl border mt-4 overflow-hidden"
    style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
  >
    {specialists.length === 0 ? (
      <div className="text-center py-12">
        <Icon name="Users" size={32} className="mx-auto" style={{ color: '#d1d5db' }} />
        <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
          Нет специалистов
        </p>
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: '#e5e7eb' }}>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>ID</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Имя</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Email</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Стаж</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Обучение</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Аттестация</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specialists.map((spec) => (
            <TableRow key={spec.id} style={{ borderColor: '#f3f4f6' }}>
              <TableCell className="text-sm font-mono" style={{ color: '#6b7280' }}>{spec.id}</TableCell>
              <TableCell className="text-sm font-medium" style={{ color: '#111827' }}>{spec.name}</TableCell>
              <TableCell className="text-sm" style={{ color: '#6b7280' }}>{spec.email || '-'}</TableCell>
              <TableCell className="text-sm" style={{ color: '#6b7280' }}>{spec.experience_years} лет</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getTrainingStatusColor(spec.training_status)}`}>
                  {getTrainingStatusLabel(spec.training_status)}
                </span>
              </TableCell>
              <TableCell className="text-sm" style={{ color: '#6b7280' }}>{spec.attestation_status}</TableCell>
              <TableCell className="text-sm" style={{ color: '#9ca3af' }}>{formatDate(spec.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </div>
);

interface AccessTabProps {
  accessList: Access[];
}

export const AccessTab = ({ accessList }: AccessTabProps) => (
  <div
    className="rounded-xl border mt-4 overflow-hidden"
    style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
  >
    {accessList.length === 0 ? (
      <div className="text-center py-12">
        <Icon name="KeyRound" size={32} className="mx-auto" style={{ color: '#d1d5db' }} />
        <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>
          Нет выданных доступов
        </p>
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: '#e5e7eb' }}>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>ID</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Email</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Статус</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Выдан</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Активирован</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accessList.map((acc) => (
            <TableRow key={acc.id} style={{ borderColor: '#f3f4f6' }}>
              <TableCell className="text-sm font-mono" style={{ color: '#6b7280' }}>{acc.id}</TableCell>
              <TableCell className="text-sm" style={{ color: '#111827' }}>{acc.email}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getAccessStatusColor(acc.status)}`}>
                  {getAccessStatusLabel(acc.status)}
                </span>
              </TableCell>
              <TableCell className="text-sm" style={{ color: '#9ca3af' }}>{formatDateTime(acc.issued_at)}</TableCell>
              <TableCell className="text-sm" style={{ color: '#9ca3af' }}>{acc.activated_at ? formatDateTime(acc.activated_at) : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </div>
);

interface RatingTabProps {
  rating: number;
  salonId: number;
  specialists: Specialist[];
  techniques: string | null;
  onRatingUpdate: (newRating: number) => void;
}

export const RatingTab = ({ rating, salonId, specialists, techniques, onRatingUpdate }: RatingTabProps) => {
  const [recalculating, setRecalculating] = React.useState(false);
  const [localRating, setLocalRating] = React.useState(Number(rating));

  const total = specialists.length;
  const trained = specialists.filter(s => s.training_status === 'completed' || s.training_status === 'certified').length;
  const attested = specialists.filter(s => s.attestation_status === 'passed').length;
  const techList = techniques ? techniques.split(',').filter(t => t.trim()) : [];
  const techCount = techList.length;

  const trainedPct = total > 0 ? Math.round(trained / total * 100) : 0;
  const attestedPct = total > 0 ? Math.round(attested / total * 100) : 0;
  const techScore = Math.min(techCount * 20, 100);
  const calcRating100 = (trainedPct + attestedPct + techScore) / 3;
  const calcRating5 = Math.min(Math.round(calcRating100 / 20 * 10) / 10, 5);

  const handleRecalc = async () => {
    setRecalculating(true);
    try {
      const url = 'https://functions.poehali.dev/bb33a14d-b393-405a-8e17-000edbb97fb6';
      const res = await fetch(`${url}?section=rating&salon_id=${salonId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.rating !== undefined) {
        setLocalRating(Number(data.rating));
        onRatingUpdate(Number(data.rating));
      }
    } catch {
      // ignore
    }
    setRecalculating(false);
  };

  const displayRating = localRating || calcRating5;

  return (
    <div
      className="rounded-xl border p-6 mt-4"
      style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
    >
      <div className="text-center pb-6 border-b" style={{ borderColor: '#f3f4f6' }}>
        <div
          className="text-5xl font-bold font-sans mb-2"
          style={{ color: '#0da2e7' }}
        >
          {displayRating}
        </div>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          из 5.0
        </p>
        <div className="flex items-center justify-center gap-1 mt-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Icon
              key={i}
              name="Star"
              size={24}
              style={{ color: i < Math.round(displayRating) ? '#f59e0b' : '#e5e7eb' }}
            />
          ))}
        </div>
        <button
          onClick={handleRecalc}
          disabled={recalculating}
          className="mt-4 h-8 px-4 rounded-lg text-xs font-medium border disabled:opacity-50"
          style={{ color: '#0da2e7', borderColor: '#0da2e7' }}
        >
          {recalculating ? 'Пересчёт...' : 'Пересчитать рейтинг'}
        </button>
      </div>

      <div className="pt-5">
        <h4 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Из чего складывается рейтинг</h4>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="rounded-lg p-4 text-center" style={{ background: '#f0fdf4' }}>
            <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>{trainedPct}%</p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Обучены</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>{trained} из {total}</p>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ background: '#f5f3ff' }}>
            <p className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{attestedPct}%</p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Аттестованы</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>{attested} из {total}</p>
          </div>
          <div className="rounded-lg p-4 text-center" style={{ background: '#eff6ff' }}>
            <p className="text-2xl font-bold" style={{ color: '#0da2e7' }}>{techCount}</p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Техники</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>балл: {techScore}/100</p>
          </div>
        </div>

        <div className="rounded-lg p-4" style={{ background: '#f9fafb' }}>
          <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>Формула расчёта:</p>
          <p className="text-sm font-mono" style={{ color: '#374151' }}>
            ({trainedPct}% + {attestedPct}% + {techScore}) / 3 = <span className="font-bold" style={{ color: '#0da2e7' }}>{calcRating100.toFixed(1)}</span> из 100 → <span className="font-bold" style={{ color: '#0da2e7' }}>{calcRating5}</span> из 5
          </p>
        </div>

        {techList.length > 0 && (
          <div className="mt-4">
            <p className="text-xs mb-2" style={{ color: '#6b7280' }}>Техники салона:</p>
            <div className="flex flex-wrap gap-1.5">
              {techList.map((t, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-md" style={{ background: '#eff6ff', color: '#0da2e7' }}>
                  {t.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {total === 0 && (
          <p className="text-xs mt-4" style={{ color: '#f59e0b' }}>
            У салона нет специалистов — рейтинг будет 0 до их добавления
          </p>
        )}
      </div>
    </div>
  );
};

interface CommentsTabProps {
  comments: Comment[];
  newComment: string;
  addingComment: boolean;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
}

export const CommentsTab = ({
  comments,
  newComment,
  addingComment,
  onNewCommentChange,
  onAddComment,
}: CommentsTabProps) => (
  <div
    className="rounded-xl border p-6 mt-4"
    style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
  >
    <div className="mb-5 pb-5 border-b" style={{ borderColor: '#f3f4f6' }}>
      <Label className="text-sm mb-2 block" style={{ color: '#6b7280' }}>
        Добавить комментарий
      </Label>
      <div className="flex gap-2">
        <textarea
          value={newComment}
          onChange={(e) => onNewCommentChange(e.target.value)}
          placeholder="Текст комментария..."
          rows={2}
          className="flex-1 rounded-md border px-3 py-2 text-sm"
          style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
        />
        <button
          onClick={onAddComment}
          disabled={addingComment || !newComment.trim()}
          className="self-end h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style={{ background: '#0da2e7' }}
        >
          Отправить
        </button>
      </div>
    </div>

    {comments.length === 0 ? (
      <p className="text-sm text-center py-6" style={{ color: '#9ca3af' }}>
        Нет комментариев
      </p>
    ) : (
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="pb-4 border-b last:border-0 last:pb-0"
            style={{ borderColor: '#f3f4f6' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium" style={{ color: '#111827' }}>
                {comment.author_name || 'Система'}
              </span>
              <span className="text-xs" style={{ color: '#9ca3af' }}>
                {formatDateTime(comment.created_at)}
              </span>
            </div>
            <p className="text-sm" style={{ color: '#374151' }}>
              {comment.text}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);