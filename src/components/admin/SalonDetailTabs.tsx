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
}

export const RatingTab = ({ rating }: RatingTabProps) => (
  <div
    className="rounded-xl border p-6 mt-4"
    style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
  >
    <div className="text-center py-8">
      <div
        className="text-5xl font-bold font-sans mb-2"
        style={{ color: '#0da2e7' }}
      >
        {rating}
      </div>
      <p className="text-sm" style={{ color: '#6b7280' }}>
        Текущий рейтинг салона
      </p>
      <div className="flex items-center justify-center gap-1 mt-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Icon
            key={i}
            name="Star"
            size={24}
            style={{ color: i < Math.round(Number(rating)) ? '#f59e0b' : '#e5e7eb' }}
          />
        ))}
      </div>
      <p className="text-xs mt-4" style={{ color: '#9ca3af' }}>
        Рейтинг рассчитывается по формуле: (обучение + аттестация + техники) / 3
      </p>
    </div>
  </div>
);

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
