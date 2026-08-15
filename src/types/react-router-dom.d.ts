import * as React from 'react';
import * as ReactRouter from 'react-router';

// Re-export everything from react-router
export * from 'react-router';

// Re-export DOM-specific components
export { BrowserRouter, HashRouter, MemoryRouter, Link, NavLink, Form } from 'react-router';

// Type declarations for react-router-dom
declare module 'react-router-dom' {
  export { BrowserRouter, HashRouter, MemoryRouter, Link, NavLink, Form } from 'react-router';
  export * from 'react-router';
}

declare module 'react-router' {
  export interface RouteObject {
    path?: string;
    index?: boolean;
    children?: React.ReactNode;
    element?: React.ReactNode;
    loader?: any;
    action?: any;
    errorElement?: React.ReactNode;
    handle?: any;
    id?: string;
  }
}
