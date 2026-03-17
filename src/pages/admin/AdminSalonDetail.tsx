import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminFetch } from '@/lib/admin-api';
import { toast } from 'sonner';
import SalonDetailHeader from '@/components/admin/SalonDetailHeader';
import SalonInfoTab from '@/components/admin/SalonInfoTab';
import {
  SpecialistsTab,
  AccessTab,
  RatingTab,
  CommentsTab,
} from '@/components/admin/SalonDetailTabs';

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

interface SalonDetail {
  id: number;
  name: string;
  city: string | null;
  owner_name: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  techniques: string | null;
  tariff: string;
  status: string;
  rating: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  specialists: Specialist[];
  comments: Comment[];
  access_list: Access[];
}

const AdminSalonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [salon, setSalon] = useState<SalonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<Record<string, string | undefined>>({});
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const fetchSalon = async () => {
    try {
      const url = `https://functions.poehali.dev/ce43779d-d06c-464a-bd6d-4e57e0ebc300?id=${id}`;
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      if (data.salon) {
        setSalon(data.salon);
        setEditData({
          name: data.salon.name,
          city: data.salon.city || '',
          owner_name: data.salon.owner_name || '',
          phone: data.salon.phone || '',
          email: data.salon.email || '',
          description: data.salon.description || '',
          techniques: data.salon.techniques || '',
          tariff: data.salon.tariff,
          status: data.salon.status,
        });
      }
    } catch {
      toast.error('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalon();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await adminFetch('salons', {
        method: 'PUT',
        body: JSON.stringify({ id: Number(id), ...editData }),
      });
      if (data.salon) {
        toast.success('Салон обновлен');
        setSalon({ ...salon!, ...data.salon });
        setEditing(false);
      } else {
        toast.error(data.error || 'Ошибка обновления');
      }
    } catch {
      toast.error('Ошибка соединения');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const data = await adminFetch('salons', {
        method: 'PUT',
        body: JSON.stringify({ id: Number(id), status: newStatus }),
      });
      if (data.salon) {
        toast.success('Статус обновлен');
        setSalon({ ...salon!, ...data.salon });
        setEditData({ ...editData, status: newStatus });
      }
    } catch {
      toast.error('Ошибка смены статуса');
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setAddingComment(true);
    toast.info('Функция добавления комментариев будет доступна после создания backend endpoint');
    setAddingComment(false);
    setNewComment('');
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="text-center py-20">
        <Icon name="AlertCircle" size={40} className="mx-auto" style={{ color: '#ef4444' }} />
        <p className="text-sm mt-3" style={{ color: '#6b7280' }}>Салон не найден</p>
        <button
          onClick={() => navigate('/admin/salons')}
          className="mt-4 text-sm underline"
          style={{ color: '#0da2e7' }}
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SalonDetailHeader
        salonId={salon.id}
        salonName={salon.name}
        salonStatus={salon.status}
        editing={editing}
        saving={saving}
        onBack={() => navigate('/admin/salons')}
        onStatusChange={handleStatusChange}
        onEditStart={() => setEditing(true)}
        onEditCancel={() => setEditing(false)}
        onSave={handleSave}
      />

      <Tabs defaultValue="info">
        <TabsList
          className="rounded-lg p-1"
          style={{ background: '#f3f4f6' }}
        >
          <TabsTrigger
            value="info"
            className="rounded-md text-sm data-[state=active]:shadow-sm"
            style={{ color: '#6b7280' }}
          >
            Информация
          </TabsTrigger>
          <TabsTrigger
            value="specialists"
            className="rounded-md text-sm data-[state=active]:shadow-sm"
            style={{ color: '#6b7280' }}
          >
            Специалисты ({salon.specialists.length})
          </TabsTrigger>
          <TabsTrigger
            value="access"
            className="rounded-md text-sm data-[state=active]:shadow-sm"
            style={{ color: '#6b7280' }}
          >
            Доступы ({salon.access_list.length})
          </TabsTrigger>
          <TabsTrigger
            value="rating"
            className="rounded-md text-sm data-[state=active]:shadow-sm"
            style={{ color: '#6b7280' }}
          >
            Рейтинг
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="rounded-md text-sm data-[state=active]:shadow-sm"
            style={{ color: '#6b7280' }}
          >
            Комментарии ({salon.comments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <SalonInfoTab
            editing={editing}
            editData={editData}
            onFieldChange={handleFieldChange}
            salon={salon}
          />
        </TabsContent>

        <TabsContent value="specialists">
          <SpecialistsTab specialists={salon.specialists} />
        </TabsContent>

        <TabsContent value="access">
          <AccessTab accessList={salon.access_list} />
        </TabsContent>

        <TabsContent value="rating">
          <RatingTab rating={salon.rating} />
        </TabsContent>

        <TabsContent value="comments">
          <CommentsTab
            comments={salon.comments}
            newComment={newComment}
            addingComment={addingComment}
            onNewCommentChange={setNewComment}
            onAddComment={handleAddComment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSalonDetail;
