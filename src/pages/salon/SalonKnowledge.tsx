import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { salonFetch } from '@/lib/salon-api';

interface Article {
  id: number;
  title: string;
  body: string | null;
  category: string;
  reading_time: number;
}

const categories = [
  { value: '', label: 'Все' },
  { value: 'продажи', label: 'Продажи' },
  { value: 'ошибки', label: 'Ошибки' },
  { value: 'диагностика', label: 'Диагностика' },
  { value: 'работа с клиентами', label: 'Работа с клиентами' },
];

const categoryIcons: Record<string, string> = {
  'продажи': 'TrendingUp',
  'ошибки': 'AlertTriangle',
  'диагностика': 'Stethoscope',
  'работа с клиентами': 'Users',
};

const SalonKnowledge = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (cat) params.category = cat;
    salonFetch('knowledge', params)
      .then(res => setArticles(res.articles || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cat]);

  if (loading) return <div className="flex justify-center py-20"><Icon name="Loader2" size={32} className="animate-spin" style={{ color: '#0da2e7' }} /></div>;

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c.value}
            onClick={() => setCat(c.value)}
            className="h-9 px-4 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: cat === c.value ? '#0da2e7' : '#ffffff',
              color: cat === c.value ? '#ffffff' : '#6b7280',
              border: `1px solid ${cat === c.value ? '#0da2e7' : '#e5e7eb'}`,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <Icon name="BookOpen" size={40} className="mx-auto" style={{ color: '#d1d5db' }} />
          <p className="text-sm mt-3" style={{ color: '#9ca3af' }}>Нет статей в этой категории</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(article => (
            <div
              key={article.id}
              className="rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
              style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              onClick={() => setOpenId(openId === article.id ? null : article.id)}
            >
              <div className="p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#f0f9ff' }}>
                    <Icon name={categoryIcons[article.category] || 'FileText'} size={18} style={{ color: '#0da2e7' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#111827' }}>{article.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#6b7280' }}>{article.category}</span>
                      <span className="text-xs" style={{ color: '#d1d5db' }}>{article.reading_time} мин</span>
                    </div>
                  </div>
                </div>
                <Icon
                  name={openId === article.id ? 'ChevronUp' : 'ChevronDown'}
                  size={18}
                  style={{ color: '#9ca3af' }}
                />
              </div>
              {openId === article.id && article.body && (
                <div className="px-5 pb-5 pt-0 border-t" style={{ borderColor: '#f3f4f6' }}>
                  <p className="text-sm leading-relaxed pt-4 whitespace-pre-line" style={{ color: '#374151' }}>{article.body}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalonKnowledge;
