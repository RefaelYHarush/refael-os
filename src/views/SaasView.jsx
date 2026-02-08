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
      <h2 className="text-2xl font-bold text-brand-black dark:text-on-brand">SaaS Builder</h2>
      <p className="text-sm text-brand-black/55 dark:text-on-brand-muted">גרור כרטיסים בין עמודות כדי לעדכן סטטוס</p>
      {dropError && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-card bg-brand-accent-secondary/10 border border-brand-accent-secondary/30 text-brand-accent-secondary text-sm" role="alert">
          <span>{dropError}</span>
          <button type="button" onClick={() => setDropError(null)} className="shrink-0 px-2 py-1 rounded-button hover:bg-brand-accent-secondary/20 font-medium" aria-label="סגור">✕</button>
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
              <h3 className="font-bold text-brand-black/55 dark:text-on-brand-muted text-sm uppercase tracking-wider">{col.label}</h3>
              <span className="bg-brand-black/10 dark:bg-brand/15 text-xs px-2 py-1 rounded-button font-semibold text-brand-black/65 dark:text-on-brand-muted">
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
                    <h4 className="font-bold text-brand-black dark:text-on-brand">{project.name}</h4>
                    <MoreHorizontal size={16} className="text-brand-black/45 dark:text-on-brand-muted shrink-0" aria-hidden />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-brand-black/55 dark:text-on-brand-muted">
                      <span>התקדמות</span>
                      <span>{project.tasks ? Math.round((project.completed / project.tasks) * 100) : 0}%</span>
                    </div>
                    <ProgressBar
                      value={project.tasks ? (project.completed / project.tasks) * 100 : 0}
                      colorClass="bg-brand-dark dark:bg-brand"
                      heightClass="h-1.5"
                    />
                    <div className="flex items-center justify-between pt-2 border-t border-brand-black/8 dark:border-brand/15">
                      <div className="flex items-center gap-1 text-xs font-medium text-brand-dark dark:text-brand">
                        <DollarSign size={12} /> {project.mrr} MRR
                      </div>
                      <div className="flex items-center gap-1 text-xs text-brand-black/45 dark:text-on-brand-muted">
                        <ListChecks size={12} /> {project.completed}/{project.tasks}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <button
                type="button"
                onClick={() => { setEditingProject(null); setShowAddProject(true); }}
                className="w-full py-3 border-2 border-dashed border-brand-black/15 dark:border-brand/25 rounded-card text-brand-black/45 dark:text-on-brand-muted text-sm hover:border-brand hover:text-brand-dark dark:hover:text-brand transition-colors flex items-center justify-center gap-2"
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
