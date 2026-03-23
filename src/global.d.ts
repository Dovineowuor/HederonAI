import * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'hashgraph-wallet-connect': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        theme?: 'light' | 'dark';
        'btn-text'?: string;
        class?: string;
      }, HTMLElement>;
      'hashgraph-agent-profile': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        uaid?: string;
        size?: 'sm' | 'md' | 'lg';
        class?: string;
      }, HTMLElement>;
    }
  }
}

// Silence implicit lodash type errors
declare module 'lodash';
