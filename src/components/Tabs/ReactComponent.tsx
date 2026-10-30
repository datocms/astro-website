import cn from 'classnames';
import React, { useState, type ReactNode } from 'react';
import s from './style.module.css';

export default function TabsReactComponent({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={s.root}>
      <div className={s.handles}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement<TabProps>(child)) {
            return undefined;
          }

          return (
            <button
              type="button"
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(s.handle, child.props.code && s.code)}
              aria-selected={activeTab === index ? 'true' : 'false'}
            >
              <span>{child.props.title}</span>
            </button>
          );
        })}
      </div>
      {React.Children.map(children, (child, index) => {
        if (activeTab !== index) {
          return null;
        }

        if (!React.isValidElement<TabProps>(child)) {
          return undefined;
        }

        return (
          <div key="content" className={s.content}>
            {child.props.children}
          </div>
        );
      })}
    </div>
  );
}

type TabProps = {
  title: string;
  code?: boolean;
  children: ReactNode;
};

export const TabReactComponent = (_props: TabProps) => {
  return <div />;
};
