import React from 'react';
import { DollarSign, Rocket, Heart, TrendingUp, Trophy } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useApp } from '../context/AppContext';

const ICON_MAP = {
  DollarSign,
  Rocket,
  Heart,
  TrendingUp,
  Trophy,
};

export function VisionView() {
  const { visionMilestones } = useApp();

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-black">מפת הדרכים ל-2M$</h2>
        <p className="text-slate-500">החזון הגדול מפורק לאבני דרך. כל יום הוא צעד בדרך לשם.</p>
      </div>

      <div className="relative border-r-2 border-slate-200 dark:border-slate-800 mr-4 md:mr-0 md:mx-auto space-y-12">
        {visionMilestones.map((milestone, index) => {
          const IconComponent = ICON_MAP[milestone.icon] || Trophy;
          return (
            <div key={index} className="relative flex flex-col md:flex-row items-center md:even:flex-row-reverse gap-8 md:gap-16">
              <div className="absolute right-[-9px] md:right-1/2 md:translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-brand-dark border-4 border-brand shadow-ring-brand" />

              <div className="md:w-1/2 flex md:justify-end md:even:justify-start pr-8 md:pr-0 md:pl-0 md:even:pl-0">
                <span className="text-4xl font-black text-slate-200 dark:text-slate-800">{milestone.year}</span>
              </div>

              <div className="md:w-1/2 flex md:justify-start md:even:justify-end pr-8 md:pr-0">
                <Card
                  className={`p-6 w-full max-w-sm relative overflow-hidden group hover:border-brand transition-colors ${
                    milestone.achieved ? 'border-brand bg-brand/10' : ''
                  }`}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand group-hover:h-full transition-all" />
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <IconComponent size={24} className="text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{milestone.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          milestone.achieved ? 'bg-brand/20 text-brand-dark' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {milestone.achieved ? 'הושלם' : 'בתהליך'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
