import * as React from 'react';

declare module 'react-router' {
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string | { pathname: string; search?: string; hash?: string };
    replace?: boolean;
    state?: any;
    reloadDocument?: boolean;
  }
}

declare module 'react-router-dom' {
  export * from 'react-router';
  export { BrowserRouter, HashRouter, MemoryRouter, Link, NavLink, Form } from 'react-router';
}
