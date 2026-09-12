export interface ProjectMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface Project {
  id: string;
  category: 'genai' | 'aerospace' | 'cloud';
  tag: string;
  filename: string;
  title: string;
  description: string;
  shortDescription?: string;
  detailedDescription?: string;
  architectureFlow?: string[];
  keyHighlights?: string[];
  problemSolved?: string;
  techStackList?: string[];
  metricsData?: ProjectMetric[];
  metricLabel: string;
  metricValue: string;
  metricHighlight: string;
  stack: string;
  statusBadge: string;
  hasAudioVisualizer?: boolean;
}

export interface PipelineStage {
  id: number;
  stageNum: string;
  title: string;
  stat: string;
  color: string;
  log: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  codeTag: string;
  badge?: string;
  icon: string;
  accentColor: string;
  footerLabel: string;
  footerValue: string;
  colSpan?: string;
  skills: {
    name: string;
    detail: string;
    color: string;
    icon?: string;
  }[];
}

export interface Credential {
  id: string;
  institution: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  icon: string;
}

export interface NavItem {
  id: string;
  num: string;
  name: string;
  shortcut: string;
  icon: string;
  color?: string;
}
