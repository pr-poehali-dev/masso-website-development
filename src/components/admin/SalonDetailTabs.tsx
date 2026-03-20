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
      <div className="overflow-x-auto">
      <Table className="min-w-[550px]">
        <TableHeader>
          <TableRow style={{ borderColor: '#e5e7eb' }}>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>ID</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Имя</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Email</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Стаж</TableHead>
            <TableHead className="text-xs font-semibold" style={{ color: '#6b7280' }}>Обучение</TableHead>
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
              <TableCell className="text-sm" style={{ color: '#9ca3af' }}>{formatDate(spec.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
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
      <div className="overflow-x-auto">
      <Table className="min-w-[500px]">
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
      </div>
    )}
  </div>
);

interface RatingTabProps {
  rating: number;
  salonId: number;
  specialists: Specialist[];
  techniques: string | null;
  inspectionDate: string | null;
  onRatingUpdate: (newRating: number) => void;
  onInspectionDateSave: (date: string) => void;
}

export const RatingTab = ({ rating, salonId, specialists, techniques, inspectionDate, onRatingUpdate, onInspectionDateSave }: RatingTabProps) => {
  const [recalculating, setRecalculating] = React.useState(false);
  const [localRating, setLocalRating] = React.useState(Number(rating));
  const [editingDate, setEditingDate] = React.useState(false);
  const [dateInput, setDateInput] = React.useState(inspectionDate ? inspectionDate.slice(0, 10) : '');
  const [savingDate, setSavingDate] = React.useState(false);

  const total = specialists.length;
  const offlineTrained = specialists.filter(s => ['offline_trained', 'in_progress', 'completed', 'certified'].includes(s.training_status)).length;
  const trained = specialists.filter(s => ['completed', 'certified'].includes(s.training_status)).length;

  const offlinePct = total > 0 ? Math.round(offlineTrained / total * 100) : 0;
  const trainedPct = total > 0 ? Math.round(trained / total * 100) : 0;
  const calcRating5 = Math.min(Math.round((offlinePct / 100 * 4.0 + trainedPct / 100 * 1.0) * 10) / 10, 5);

  const techList = techniques ? techniques.split(',').filter(t => t.trim()) : [];

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
    } catch { /* ignore */ }
    setRecalculating(false);
  };

  const handleSaveDate = async () => {
    setSavingDate(true);
    try {
      const res = await fetch('https://functions.poehali.dev/ce43779d-d06c-464a-bd6d-4e57e0ebc300', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: salonId, inspection_date: dateInput || null }),
      });
      const data = await res.json();
      if (data.salon) {
        onInspectionDateSave(dateInput);
        setEditingDate(false);
      }
    } catch { /* ignore */ }
    setSavingDate(false);
  };

  const nextInspection = inspectionDate ? new Date(new Date(inspectionDate).setFullYear(new Date(inspectionDate).getFullYear() + 1)) : null;
  const daysLeft = nextInspection ? Math.ceil((nextInspection.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const inspectionStatus = daysLeft === null ? 'none' : daysLeft < 0 ? 'overdue' : daysLeft <= 60 ? 'soon' : 'ok';

  const displayRating = localRating || calcRating5;

  return (
    <div className="space-y-4 mt-4">
      <div className="rounded-xl border p-4 sm:p-6" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="text-center pb-6 border-b" style={{ borderColor: '#f3f4f6' }}>
          <div className="text-5xl font-bold font-sans mb-2" style={{ color: '#0da2e7' }}>{displayRating}</div>
          <p className="text-sm" style={{ color: '#6b7280' }}>из 5.0</p>
          <div className="flex items-center justify-center gap-1 mt-3">
            {Array.from({ length: 5 }, (_, i) => (
              <Icon key={i} name="Star" size={24} style={{ color: i < Math.round(displayRating) ? '#f59e0b' : '#e5e7eb' }} />
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
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-lg p-4 text-center border-2" style={{ background: '#fffbeb', borderColor: '#f59e0b' }}>
              <p className="text-2xl font-bold" style={{ color: '#d97706' }}>{offlinePct}%</p>
              <p className="text-xs mt-1 font-semibold" style={{ color: '#92400e' }}>Офлайн обучены</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#b45309' }}>{offlineTrained} из {total}</p>
              <p className="text-[10px] mt-1 font-medium" style={{ color: '#d97706' }}>100% → 4.0 ★</p>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ background: '#f0fdf4' }}>
              <p className="text-2xl font-bold" style={{ color: '#22c55e' }}>{trainedPct}%</p>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Онлайн обучены</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>{trained} из {total}</p>
              <p className="text-[10px] mt-1 font-medium" style={{ color: '#22c55e' }}>100% → +1.0 ★</p>
            </div>
          </div>

          {techList.length > 0 && (
            <div className="mb-4">
              <p className="text-xs mb-2" style={{ color: '#6b7280' }}>Техники салона:</p>
              <div className="flex flex-wrap gap-1.5">
                {techList.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md" style={{ background: '#eff6ff', color: '#0da2e7' }}>{t.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {total === 0 && (
            <p className="text-xs" style={{ color: '#f59e0b' }}>У салона нет специалистов — рейтинг будет 0 до их добавления</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border p-6" style={{ background: '#ffffff', borderColor: '#e5e7eb' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="ClipboardCheck" size={18} style={{ color: '#6b7280' }} />
            <h4 className="text-sm font-semibold" style={{ color: '#111827' }}>Проверка персонала</h4>
          </div>
          {!editingDate && (
            <div className="flex items-center gap-2">
              {inspectionDate && (
                <button
                  onClick={async () => {
                    setSavingDate(true);
                    try {
                      const res = await fetch('https://functions.poehali.dev/ce43779d-d06c-464a-bd6d-4e57e0ebc300', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: salonId, inspection_date: null }),
                      });
                      const data = await res.json();
                      if (data.salon) onInspectionDateSave('');
                    } catch { /* ignore */ }
                    setSavingDate(false);
                  }}
                  disabled={savingDate}
                  className="text-xs px-3 h-7 rounded-lg border disabled:opacity-50"
                  style={{ color: '#dc2626', borderColor: '#dc2626' }}
                >
                  Убрать
                </button>
              )}
              <button
                onClick={() => setEditingDate(true)}
                className="text-xs px-3 h-7 rounded-lg border"
                style={{ color: '#0da2e7', borderColor: '#0da2e7' }}
              >
                {inspectionDate ? 'Изменить дату' : 'Указать дату'}
              </button>
            </div>
          )}
        </div>

        {inspectionDate ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: '#6b7280' }}>Последняя проверка:</p>
              <p className="text-sm font-medium" style={{ color: '#111827' }}>
                {new Date(inspectionDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: '#6b7280' }}>Следующая проверка:</p>
              <p className="text-sm font-medium" style={{ color: '#111827' }}>
                {nextInspection?.toLocaleDateString('ru-RU')}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: '#6b7280' }}>Статус:</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                background: inspectionStatus === 'ok' ? '#f0fdf4' : inspectionStatus === 'soon' ? '#fffbeb' : '#fef2f2',
                color: inspectionStatus === 'ok' ? '#16a34a' : inspectionStatus === 'soon' ? '#d97706' : '#dc2626',
              }}>
                {inspectionStatus === 'ok' ? `Через ${daysLeft} дней` : inspectionStatus === 'soon' ? `Скоро — через ${daysLeft} дн.` : 'Просрочена'}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#9ca3af' }}>Дата проверки не указана</p>
        )}

        {editingDate && (
          <div className="mt-4 pt-4 border-t flex items-end gap-2" style={{ borderColor: '#f3f4f6' }}>
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Дата выездной проверки</p>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full h-9 rounded-lg border px-3 text-sm"
                style={{ background: '#ffffff', borderColor: '#d1d5db', color: '#111827' }}
              />
            </div>
            <button
              onClick={handleSaveDate}
              disabled={savingDate}
              className="h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50"
              style={{ background: '#0da2e7' }}
            >
              {savingDate ? '...' : 'Сохранить'}
            </button>
            <button
              onClick={() => setEditingDate(false)}
              className="h-9 px-3 rounded-lg text-sm border"
              style={{ borderColor: '#d1d5db', color: '#6b7280' }}
            >
              Отмена
            </button>
          </div>
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
      <div className="flex flex-col sm:flex-row gap-2">
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
          className="self-end sm:self-end h-9 px-4 rounded-lg text-sm font-medium text-white disabled:opacity-50"
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