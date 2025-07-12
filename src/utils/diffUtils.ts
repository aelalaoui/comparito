import { DiffResult, DiffLine, DiffStats } from '../types';

// Enhanced diff algorithm using Longest Common Subsequence (LCS)
export function calculateDiff(leftCode: string, rightCode: string): DiffResult {
  const leftLines = leftCode.split('\n');
  const rightLines = rightCode.split('\n');
  
  const leftDiffs: DiffLine[] = [];
  const rightDiffs: DiffLine[] = [];
  const stats: DiffStats = {
    added: 0,
    removed: 0,
    modified: 0,
    unchanged: 0
  };

  // Calculate LCS to find the optimal alignment
  const lcs = calculateLCS(leftLines, rightLines);
  const alignment = getAlignment(leftLines, rightLines, lcs);
  
  let leftLineNum = 1;
  let rightLineNum = 1;
  
  for (const operation of alignment) {
    switch (operation.type) {
      case 'match':
        leftDiffs.push({
          lineNumber: leftLineNum,
          type: 'unchanged',
          content: operation.leftLine!
        });
        rightDiffs.push({
          lineNumber: rightLineNum,
          type: 'unchanged',
          content: operation.rightLine!
        });
        stats.unchanged++;
        leftLineNum++;
        rightLineNum++;
        break;
        
      case 'delete':
        leftDiffs.push({
          lineNumber: leftLineNum,
          type: 'removed',
          content: operation.leftLine!
        });
        stats.removed++;
        leftLineNum++;
        break;
        
      case 'insert':
        rightDiffs.push({
          lineNumber: rightLineNum,
          type: 'added',
          content: operation.rightLine!
        });
        stats.added++;
        rightLineNum++;
        break;
        
      case 'replace':
        leftDiffs.push({
          lineNumber: leftLineNum,
          type: 'modified',
          content: operation.leftLine!
        });
        rightDiffs.push({
          lineNumber: rightLineNum,
          type: 'modified',
          content: operation.rightLine!
        });
        stats.modified++;
        leftLineNum++;
        rightLineNum++;
        break;
    }
  }

  return {
    leftDiffs,
    rightDiffs,
    stats
  };
}

interface DiffOperation {
  type: 'match' | 'delete' | 'insert' | 'replace';
  leftLine?: string;
  rightLine?: string;
}

function calculateLCS(leftLines: string[], rightLines: string[]): number[][] {
  const m = leftLines.length;
  const n = rightLines.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (leftLines[i - 1] === rightLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp;
}

function getAlignment(leftLines: string[], rightLines: string[], lcs: number[][]): DiffOperation[] {
  const operations: DiffOperation[] = [];
  let i = leftLines.length;
  let j = rightLines.length;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      // Lines match
      operations.unshift({
        type: 'match',
        leftLine: leftLines[i - 1],
        rightLine: rightLines[j - 1]
      });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || lcs[i - 1][j] >= lcs[i][j - 1])) {
      // Line deleted from left
      operations.unshift({
        type: 'delete',
        leftLine: leftLines[i - 1]
      });
      i--;
    } else if (j > 0) {
      // Line added to right
      operations.unshift({
        type: 'insert',
        rightLine: rightLines[j - 1]
      });
      j--;
    }
  }
  
  // Post-process to identify replacements (consecutive delete + insert)
  const processedOperations: DiffOperation[] = [];
  let k = 0;
  
  while (k < operations.length) {
    if (k < operations.length - 1 && 
        operations[k].type === 'delete' && 
        operations[k + 1].type === 'insert') {
      // Convert consecutive delete + insert to replace
      processedOperations.push({
        type: 'replace',
        leftLine: operations[k].leftLine,
        rightLine: operations[k + 1].rightLine
      });
      k += 2;
    } else {
      processedOperations.push(operations[k]);
      k++;
    }
  }
  
  return processedOperations;
}

export function exportDiff(leftCode: string, rightCode: string, format: 'unified' | 'side-by-side' = 'unified'): string {
  const diffResult = calculateDiff(leftCode, rightCode);
  
  if (format === 'unified') {
    return generateUnifiedDiff(leftCode, rightCode, diffResult);
  } else {
    return generateSideBySideDiff(leftCode, rightCode, diffResult);
  }
}

function generateUnifiedDiff(leftCode: string, rightCode: string, diffResult: DiffResult): string {
  const leftLines = leftCode.split('\n');
  const rightLines = rightCode.split('\n');
  let result = '';
  
  result += `--- Version Originale\n`;
  result += `+++ Version Modifiée\n`;
  
  const lcs = calculateLCS(leftLines, rightLines);
  const alignment = getAlignment(leftLines, rightLines, lcs);
  
  for (const operation of alignment) {
    switch (operation.type) {
      case 'match':
        result += ` ${operation.leftLine}\n`;
        break;
      case 'delete':
        result += `-${operation.leftLine}\n`;
        break;
      case 'insert':
        result += `+${operation.rightLine}\n`;
        break;
      case 'replace':
        result += `-${operation.leftLine}\n`;
        result += `+${operation.rightLine}\n`;
        break;
    }
  }
  
  return result;
}

function generateSideBySideDiff(leftCode: string, rightCode: string, diffResult: DiffResult): string {
  const leftLines = leftCode.split('\n');
  const rightLines = rightCode.split('\n');
  let result = '';
  
  result += `Comparaison Side-by-Side\n`;
  result += `========================\n\n`;
  
  const lcs = calculateLCS(leftLines, rightLines);
  const alignment = getAlignment(leftLines, rightLines, lcs);
  
  let lineNum = 1;
  for (const operation of alignment) {
    const lineNumStr = lineNum.toString().padStart(3, ' ');
    
    switch (operation.type) {
      case 'match':
        result += `${lineNumStr}   ${operation.leftLine} | ${operation.rightLine}\n`;
        break;
      case 'delete':
        result += `${lineNumStr} - ${operation.leftLine} |\n`;
        break;
      case 'insert':
        result += `${lineNumStr}   | + ${operation.rightLine}\n`;
        break;
      case 'replace':
        result += `${lineNumStr} - ${operation.leftLine} | + ${operation.rightLine}\n`;
        break;
    }
    lineNum++;
  }
  
  return result;
}