import React, { useState } from 'react';
import { Plus, DollarSign, ListChecks, MoreHorizontal } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { AddSaasProjectModal } from '../components/modals/AddSaasProjectModal';
import { useApp } from '../context/AppContext';

export function SaasView() {
  const { saasProjects, addSaasProject, updateSaasProject, deleteSaasProject } = useApp();
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const columns = [
    { key: 'Idea', label: 'Idea Phase', statuses: ['Idea'] },
    { key: 'In Progress', label: 'In Development', statuses: ['In Progress', 'Dev'] },
    { key: 'Live', label: 'Live & Growing', statuses: ['Live'] },
  ];

  const getProjectsForColumn = (col) =>
    saasProjects.filter((p) => col.statuses.includes(p.status));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-2xl font-bold">SaaS Builder</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.key} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">{col.label}</h3>
              <span className="bg-slate-100 dark:bg-slate-800 text-xs px-2 py-1 rounded-full text-slate-500">
                {getProjectsForColumn(col).length}
              </span>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {getProjectsForColumn(col).map((project) => (
                <Card
                  key={project.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow border-t-4 border-t-brand-dark dark:border-t-brand"
                  onClick={() => setEditingProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEditingProject(project); } }}
                  aria-label={`ערוך פרויקט ${project.name}`}
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
