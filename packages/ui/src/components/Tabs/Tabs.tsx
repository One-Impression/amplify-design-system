import React, { useState } from 'react';
import { cn } from '../../lib/cn';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  /** Controlled mode: externally managed active tab */
  activeTab?: string;
  /** Callback when tab changes (works in both controlled and uncontrolled mode) */
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onTabChange,
  className,
}) => {
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id || '');
  const isControlled = controlledTab !== undefined;
  const currentTab = isControlled ? controlledTab : internalTab;

  const handleTabClick = (tabId: string) => {
    if (!isControlled) {
      setInternalTab(tabId);
    }
    onTabChange?.(tabId);
  };

  const activeContent = tabs.find((t) => t.id === currentTab)?.content;

  return (
    <div className={cn('w-full', className)}>
      <div
        className="flex border-b border-[var(--amp-semantic-border-default)]"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={currentTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'px-4 py-2.5 text-[14px] font-medium transition-colors duration-150 relative',
              'hover:text-[var(--amp-semantic-text-primary)]',
              currentTab === tab.id
                ? 'text-[var(--amp-semantic-accent)]'
                : 'text-[var(--amp-semantic-text-secondary)]'
            )}
          >
            {tab.label}
            {currentTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--amp-semantic-accent)]" />
            )}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`tabpanel-${currentTab}`}
        aria-labelledby={`tab-${currentTab}`}
        className="pt-4"
      >
        {activeContent}
      </div>
    </div>
  );
};
