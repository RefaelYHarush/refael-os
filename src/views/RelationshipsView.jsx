import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Phone } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useApp } from '../context/AppContext';

function formatDate(str) {
  if (!str) return '—';
  try {
    return new Date(str + 'T12:00:00').toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return str;
  }
}

export function RelationshipsView() {
  const { relationshipItems, addRelationshipItem, updateRelationshipItem, deleteRelationshipItem } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', lastContact: '', note: '' });

  const openAdd = () => {
    setForm({ name: '', lastContact: '', note: '' });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name,
      lastContact: item.lastContact || '',
      note: item.note || '',
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name: form.name.trim(), lastContact: form.lastContact.trim() || '', note: form.note.trim() || '' };
    if (editing) {
      updateRelationshipItem({ ...editing, ...payload });
      setEditing(null);
    } else {
      addRelationshipItem(payload);
    }
    setShowForm(false);
  };

  const setLastContactToday = (item) => {
    const today = new Date().toISOString().slice(0, 10);
    updateRelationshipItem({ ...item, lastContact: today });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-on-brand">יחסים</h2>
          <p className="text-sm text-slate-500 dark:text-on-brand-muted">מעקב מגע – עם מי לדבר השבוע</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-dark text-on-brand font-bold text-sm hover:bg-brand-dark/90 transition-colors"
        >
          <Plus size={18} /> איש קשר חדש
        </button>
      </div>

      {showForm && (
        <Card className="p-5 border-t-4 border-t-brand">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">שם</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="שם האדם"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">מגע אחרון (תאריך)</span>
              <input
                type="date"
                value={form.lastContact}
                onChange={(e) => setForm((f) => ({ ...f, lastContact: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500 dark:text-on-brand-muted block mb-1">הערה (אופציונלי)</span>
              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="למשל: יום הולדת בחודש הבא"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 bg-white dark:bg-brand-surface text-slate-900 dark:text-on-brand"
              />
            </label>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded-lg bg-brand-dark text-on-brand font-medium text-sm">
                {editing ? 'עדכון' : 'הוספה'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-brand-dark/50 text-slate-600 dark:text-on-brand-muted text-sm">
                ביטול
              </button>
            </div>
          </form>
        </Card>
      )}

      {relationshipItems.length === 0 && !showForm ? (
        <Card className="p-8 text-center text-slate-500 dark:text-on-brand-muted">
          <Users size={40} className="mx-auto mb-3 opacity-50" />
          <p>אין עדיין אנשי קשר. הוסף אנשים שתרצה לשמור איתם על מגע.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {relationshipItems.map((item) => (
            <Card key={item.id} className="p-4 border-t-4 border-t-brand-dark dark:border-t-brand">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-on-brand">{item.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-on-brand-muted">
                    מגע אחרון: {formatDate(item.lastContact)}
                  </p>
                  {item.note && <p className="text-sm text-slate-400 mt-1">{item.note}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setLastContactToday(item)}
                    className="p-2 rounded-lg text-slate-400 hover:text-brand-dark dark:hover:text-brand hover:bg-brand/10 transition-colors"
                    title="סומן מגע היום"
                    aria-label="סומן מגע היום"
                  >
                    <Phone size={16} />
                  </button>
                  <button type="button" onClick={() => openEdit(item)} className="p-2 rounded-lg text-slate-400 hover:text-brand-dark dark:hover:text-brand" aria-label="ערוך">
                    <Edit2 size={16} />
                  </button>
                  <button type="button" onClick={() => deleteRelationshipItem(item.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500" aria-label="מחק">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
