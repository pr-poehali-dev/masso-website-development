import Icon from '@/components/ui/icon';

const AdminSettings = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: '#f3f4f6' }}
      >
        <Icon name="Settings" size={32} style={{ color: '#9ca3af' }} />
      </div>
      <h3 className="text-lg font-semibold font-sans mb-2" style={{ color: '#111827' }}>
        Настройки
      </h3>
      <p className="text-sm" style={{ color: '#9ca3af' }}>
        В разработке
      </p>
    </div>
  );
};

export default AdminSettings;
