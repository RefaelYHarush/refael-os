import React, { useState } from 'react';
import { Plus, DollarSign, ListChecks, MoreHorizontal } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { AddSaasProjectModal } from '../components/modals/AddSaasProjectModal';
import { useApp } from '../context/AppContext';

const COLUMN_STATUS = { 'Idea': 'Idea', 'In Progress': 'In Progress', 'Live': 'Live' };

export function SaasView() {
  const { saasProjects, addSaasProject, updateSaasProject, deleteSaasProject } = useApp();
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [dropTargetColumn, setDropTargetColumn] = useState(null);
  const [dropError, setDropError] = useState(null);

  const columns = [
    { key: 'Idea', label: 'Idea Phase', statuses: ['Idea'] },
    { key: 'In Progress', label: 'In Development', statuses: ['In Progress', 'Dev'] },
    { key: 'Live', label: 'Live & Growing', statuses: ['Live'] },
  ];

  const getProjectsForColumn = (col) =>
    saasProjects.filter((p) => col.statuses.includes(p.status));

  const handleDragStart = (e, project) => {
    e.dataTransfer.setData('application/json', JSON.stringify(project));
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', project.name);
  };

  const handleDrop = (e, col) => {
    e.preventDefault();
    setDropTargetColumn(null);
    setDropError(null);
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    try {
      const project = JSON.parse(raw);
      const newStatus = COLUMN_STATUS[col.key];
      if (newStatus && project.status !== newStatus) updateSaasProject({ ...project, status: newStatus });
    } catch {
      setDropError('שגיאה בעדכון הסטטוס – נסה שוב');
      setTimeout(() => setDropError(null), 5000);
    }
  };

  const handleDragOver = (e, col) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetColumn(col.key);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-bold">SaaS Builder</h2>
      <p className="text-sm text-slate-500 dark:text-on-brand-muted">גרור כרטיסים בין עמודות כדי לעדכן סטטוס</p>
      {dropError && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm" role="alert">
          <span>{dropError}</span>
          <button type="button" onClick={() => setDropError(null)} className="shrink-0 px-2 py-1 rounded hover:bg-amber-200 dark:hover:bg-amber-800 font-medium" aria-label="סגור">✕</button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div
            key={col.key}
            className={`space-y-4 rounded-xl transition-colors min-h-[200px] p-2 -m-2 ${dropTargetColumn === col.key ? 'bg-brand/10 dark:bg-brand/20 ring-2 ring-brand-dark dark:ring-brand' : ''}`}
            onDragOver={(e) => handleDragOver(e, col)}
            onDragLeave={() => setDropTargetColumn(null)}
            onDrop={(e) => handleDrop(e, col)}
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">{col.label}</h3>
              <span className="bg-slate-100 dark:bg-slate-800 text-xs px-2 py-1 rounded-full text-slate-500">
                {getProjectsForColumn(col).length}
              </span>
            </div>

            <div className="space-y-3 min-h-[180px]">
              {getProjectsForColumn(col).map((project) => (
                <Card
                  key={project.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, project)}
                  className="p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-t-4 border-t-brand-dark dark:border-t-brand"
                  onClick={() => setEditingProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEditingProject(project); } }}
                  aria-label={`ערוך פרויקט ${project.name}. גרור לעדכן סטטוס`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{project.name}</h4>
                    <MoreHorizontal size={16} className="text-slate-400 shrink-0" aria-hidden />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>התקדמות</span>
                      <span>{project.tasks ? Math.round((project.completed / project.tasks) * 100) : 0}%</span>
                    </div>
                    <ProgressBar
                      value={project.tasks ? (project.completed / project.tasks) * 100 : 0}
                      colorClass="bg-brand-dark dark:bg-brand"
                      heightClass="h-1.5"
                    />
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-1 text-xs font-medium text-brand-dark">
                        <DollarSign size={12} /> {project.mrr} MRR
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <ListChecks size={12} /> {project.completed}/{project.tasks}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <button
                type="button"
                onClick={() => { setEditingProject(null); setShowAddProject(true); }}
                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-sm hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> פרויקט חדש
              </button>
            </div>
          </div>
        ))}
      </div>
      {showAddProject && !editingProject && (
        <AddSaasProjectModal
          onClose={() => setShowAddProject(false)}
          onSave={(project) => {
            addSaasProject(project);
            setShowAddProject(false);
          }}
        />
      )}
      {editingProject && (
        <AddSaasProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={(updated) => {
            updateSaasProject(updated);
            setEditingProject(null);
          }}
          onDelete={(id) => {
            deleteSaasProject(id);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}
