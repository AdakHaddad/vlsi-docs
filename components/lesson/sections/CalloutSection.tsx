import { ContentSection } from '@/lib/types';
import { Info, AlertTriangle, Lightbulb, Cpu } from 'lucide-react';

type CalloutType = Extract<ContentSection, { kind: 'callout' }>;

export default function CalloutSection({ section }: { section: CalloutType }) {
  let styles = '';
  let icon = null;

  switch (section.variant) {
    case 'info':
      styles = 'border-info-border bg-info-bg text-info-text';
      icon = <Info className="w-6 h-6 flex-shrink-0" />;
      break;
    case 'warning':
      styles = 'border-warning-border bg-warning-bg text-warning-text';
      icon = <AlertTriangle className="w-6 h-6 flex-shrink-0" />;
      break;
    case 'tip':
      styles = 'border-success-border bg-success-bg text-success-text';
      icon = <Lightbulb className="w-6 h-6 flex-shrink-0" />;
      break;
    case 'hardware':
      styles = 'border-hw-border bg-hw-bg text-hw-text';
      icon = <Cpu className="w-6 h-6 flex-shrink-0" />;
      break;
  }

  // Parse basic bold markdown
  const parseText = (text: string) => {
    return text.split('**').map((part, i) => (
      i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
    ));
  };

  return (
    <div className={`flex gap-4 p-6 rounded-r-lg border-l-4 my-6 ${styles}`}>
      {icon}
      <div className="leading-relaxed">
        {parseText(section.text)}
      </div>
    </div>
  );
}
