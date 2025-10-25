import { useUserLiveliness } from '../hooks/useUserLiveliness';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle } from 'lucide-react';

interface LivelinessIndicatorProps {
  onInactive?: () => void;
}

export function LivelinessIndicator({ 
  onInactive 
}: LivelinessIndicatorProps) {
  const { isActive, showWarning, timeUntilInactive } = useUserLiveliness(onInactive);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  if (!isActive) {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <AlertTriangle className="h-3 w-3" />
        Inactive
      </Badge>
    );
  }

  if (showWarning) {
    return (
      <Badge variant="outline" className="gap-1.5 border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <AlertTriangle className="h-3 w-3 animate-pulse" />
        {formatTime(timeUntilInactive)}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
      <Activity className="h-3 w-3" />
      Active
    </Badge>
  );
}

