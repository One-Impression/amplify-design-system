/**
 * @amplify-ai/ui — Shared UI Components for Amplify Products
 *
 * Import from here, not from individual component files.
 *
 * @example
 * import { Button, Badge, Card, Input, Dialog } from '@amplify-ai/ui';
 */

// Utilities
export { cn } from './lib/cn';

// Density mode (compact / comfortable / spacious)
export { DensityProvider, useDensity } from './lib/density';
export type { Density, DensityProviderProps } from './lib/density';

// Button
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

// Badge
export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';

// Card
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/Card';
export type { CardProps, CardVariant, CardPadding, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps } from './components/Card';

// EmptyState
export { EmptyState } from './components/EmptyState';
export type { EmptyStateProps } from './components/EmptyState';

// Skeleton
export { Skeleton } from './components/Skeleton';
export type { SkeletonProps, SkeletonVariant } from './components/Skeleton';

// Input
export { Input } from './components/Input';
export type { InputProps } from './components/Input';

// Textarea
export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

// Select
export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

// SearchInput
export { SearchInput } from './components/SearchInput';
export type { SearchInputProps } from './components/SearchInput';

// Checkbox
export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

// Switch
export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

// DataTable
export { DataTable } from './components/DataTable';
export type { DataTableProps, DataTableColumn } from './components/DataTable';

// MetricCard
export { MetricCard } from './components/MetricCard';
export type { MetricCardProps, MetricCardIconVariant } from './components/MetricCard';

// Tabs
export { Tabs } from './components/Tabs';
export type { TabsProps, Tab } from './components/Tabs';

// Dialog
export { Dialog } from './components/Dialog';
export type { DialogProps } from './components/Dialog';

// Toast
export { Toast } from './components/Toast';
export type { ToastProps, ToastVariant } from './components/Toast';

// Tooltip
export { Tooltip } from './components/Tooltip';
export type { TooltipProps, TooltipSide } from './components/Tooltip';

// Avatar
export { Avatar } from './components/Avatar';
export type { AvatarProps, AvatarSize } from './components/Avatar';

// ProgressBar
export { ProgressBar } from './components/ProgressBar';
export type { ProgressBarProps, ProgressBarVariant } from './components/ProgressBar';

// Breadcrumb
export { Breadcrumb } from './components/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './components/Breadcrumb';

// Pagination
export { Pagination } from './components/Pagination';
export type { PaginationProps } from './components/Pagination';

// StatusTag
export { StatusTag } from './components/StatusTag';
export type { StatusTagProps, StatusTagStatus, StatusTagSize } from './components/StatusTag';

// Timeline
export { Timeline } from './components/Timeline';
export type { TimelineProps, TimelineEvent } from './components/Timeline';

// IconButton
export { IconButton } from './components/IconButton';
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './components/IconButton';

// Separator
export { Separator } from './components/Separator';
export type { SeparatorProps, SeparatorOrientation } from './components/Separator';

// CollapsibleNavGroup
export { CollapsibleNavGroup } from './components/CollapsibleNavGroup';
export type { CollapsibleNavGroupProps } from './components/CollapsibleNavGroup';

// Stepper
export { Stepper } from './components/Stepper';
export type { StepperProps, StepItem, StepStatus, StepperVariant } from './components/Stepper';

// Chip
export { Chip } from './components/Chip';
export type { ChipProps, ChipVariant, ChipSize } from './components/Chip';

// Slider
export { Slider } from './components/Slider';
export type { SliderProps, SliderMark } from './components/Slider';

// CollapsibleCard
export { CollapsibleCard } from './components/CollapsibleCard';
export type { CollapsibleCardProps } from './components/CollapsibleCard';

// GoalCard
export { GoalCard } from './components/GoalCard';
export type { GoalCardProps, GoalCardTagColor } from './components/GoalCard';

// ContentTypeCard
export { ContentTypeCard } from './components/ContentTypeCard';
export type { ContentTypeCardProps, ContentTypeCardBadgeColor } from './components/ContentTypeCard';

// ScriptPreviewCard
export { ScriptPreviewCard } from './components/ScriptPreviewCard';
export type { ScriptPreviewCardProps, ScriptSection } from './components/ScriptPreviewCard';

// CollapsibleSection
export { CollapsibleSection } from './components/CollapsibleSection';
export type { CollapsibleSectionProps } from './components/CollapsibleSection';

// StepPill
export { StepPill } from './components/StepPill';
export type { StepPillProps, StepPillItem, StepPillStatus } from './components/StepPill';

// TrustBar
export { TrustBar } from './components/TrustBar';
export type { TrustBarProps, TrustItem } from './components/TrustBar';

// RecoReason
export { RecoReason } from './components/RecoReason';
export type { RecoReasonProps } from './components/RecoReason';

// AddonTeaser
export { AddonTeaser } from './components/AddonTeaser';
export type { AddonTeaserProps, AddonItem } from './components/AddonTeaser';

// PackageCard
export { PackageCard } from './components/PackageCard';
export type { PackageCardProps } from './components/PackageCard';

// ScrapeAnimation
export { ScrapeAnimation } from './components/ScrapeAnimation';
export type { ScrapeAnimationProps, ScrapeStep, ScrapeStepStatus } from './components/ScrapeAnimation';

// InsightBanner
export { InsightBanner } from './components/InsightBanner';
export type { InsightBannerProps } from './components/InsightBanner';

// FlexiSelector
export { FlexiSelector } from './components/FlexiSelector';
export type { FlexiSelectorProps, FlexiOption } from './components/FlexiSelector';

// ProductUrlInput
export { ProductUrlInput } from './components/ProductUrlInput';
export type { ProductUrlInputProps } from './components/ProductUrlInput';

// WalletCard
export { WalletCard } from './components/WalletCard';
export type { WalletCardProps } from './components/WalletCard';

// ActionFooter
export { ActionFooter } from './components/ActionFooter';
export type { ActionFooterProps } from './components/ActionFooter';

// PricePill
export { PricePill } from './components/PricePill';
export type { PricePillProps } from './components/PricePill';

// ─── Phase B Wave 2 — Conversational primitives ───────────────────────────

// MessageBubble
export { MessageBubble } from './components/MessageBubble';
export type {
  MessageBubbleProps,
  MessageBubbleVariant,
  MessageBubbleStatus,
  MessageBubbleReaction,
} from './components/MessageBubble';

// ChatInput
export { ChatInput } from './components/ChatInput';
export type { ChatInputProps, ChatInputHandle } from './components/ChatInput';

// TypingIndicator
export { TypingIndicator } from './components/TypingIndicator';
export type { TypingIndicatorProps, TypingIndicatorSize } from './components/TypingIndicator';

// ─── Phase B Wave 2 — Motion primitives ───────────────────────────────────

// Reveal
export { Reveal } from './components/Reveal';
export type { RevealProps, RevealDirection, RevealTrigger } from './components/Reveal';

// Stagger
export { Stagger } from './components/Stagger';
export type { StaggerProps } from './components/Stagger';

// Parallax
export { Parallax } from './components/Parallax';
export type { ParallaxProps, ParallaxDirection } from './components/Parallax';

// AnimatedNumber
export { AnimatedNumber } from './components/AnimatedNumber';
export type { AnimatedNumberProps, AnimatedNumberFormatter } from './components/AnimatedNumber';

// ScrollProgress
export { ScrollProgress } from './components/ScrollProgress';
export type {
  ScrollProgressProps,
  ScrollProgressVariant,
  ScrollProgressPosition,
} from './components/ScrollProgress';

// --- Phase B Wave 3 — Data viz primitives ---

// LineChart
export { LineChart } from './components/LineChart';
export type { LineChartProps, LineChartSeries } from './components/LineChart';

// BarChart
export { BarChart } from './components/BarChart';
export type { BarChartProps, BarChartSeries, BarChartLayout } from './components/BarChart';

// PieChart
export { PieChart } from './components/PieChart';
export type { PieChartProps, PieChartSlice, PieChartVariant } from './components/PieChart';

// Sparkline
export { Sparkline } from './components/Sparkline';
export type { SparklineProps, SparklineVariant } from './components/Sparkline';

// Heatmap
export { Heatmap } from './components/Heatmap';
export type { HeatmapProps, HeatmapCell, HeatmapVariant } from './components/Heatmap';

// Funnel
export { Funnel } from './components/Funnel';
export type { FunnelProps, FunnelStage } from './components/Funnel';

// KPI
export { KPI } from './components/KPI';
export type { KPIProps, KPISize, KPITrend } from './components/KPI';

// ProgressRing
export { ProgressRing } from './components/ProgressRing';
export type { ProgressRingProps, ProgressRingSize, ProgressRingVariant } from './components/ProgressRing';
