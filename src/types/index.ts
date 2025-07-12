export interface DiffLine {
  lineNumber: number;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  content: string;
}

export interface DiffStats {
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
}

export interface DiffResult {
  leftDiffs: DiffLine[];
  rightDiffs: DiffLine[];
  stats: DiffStats;
}

export interface UnifiedDiffLine {
  type: 'added' | 'removed' | 'unchanged';
  leftLineNum: number | null;
  rightLineNum: number | null;
  content: string;
}