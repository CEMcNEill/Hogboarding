import React from 'react';
import {
    ToggleLeft,
    Rewind,
    FlaskConical,
    Bug,
    MessageSquare,
    BarChart2,
    Globe,
    LayoutDashboard,
    GitBranch,
    Sparkles,
    Database,
    Users,
    Upload,
    Server,
    AppWindow,
    Shuffle,
    PieChart,
    LayoutTemplate,
    BookOpen,
    MessageCircle,
} from 'lucide-react';

export type ProductIconType =
    | 'toggle'
    | 'rewind'
    | 'flask'
    | 'bug'
    | 'message'
    | 'graph'
    | 'globe'
    | 'gauge'
    | 'pipeline'
    | 'sparkles'
    | 'database'
    | 'person'
    | 'upload'
    | 'server'
    | 'app'
    | 'cdp'
    | 'bi'
    | 'website'
    | 'docs'
    | 'community';

const iconMap: Record<ProductIconType, React.ElementType> = {
    toggle: ToggleLeft,
    rewind: Rewind,
    flask: FlaskConical,
    bug: Bug,
    message: MessageSquare,
    graph: BarChart2,
    globe: Globe,
    gauge: LayoutDashboard,
    pipeline: GitBranch,
    sparkles: Sparkles,
    database: Database,
    person: Users,
    upload: Upload,
    server: Server,
    app: AppWindow,
    cdp: Shuffle,
    bi: PieChart,
    website: LayoutTemplate,
    docs: BookOpen,
    community: MessageCircle,
};

export function ProductIcon({ type, className }: { type: string; className?: string }) {
    const Icon = iconMap[type as ProductIconType];
    if (!Icon) return null;
    return <Icon className={className} />;
}
