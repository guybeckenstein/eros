import { TanStackDevtools } from '@tanstack/react-devtools';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { useState } from 'react';

import { twMerge } from 'tailwind-merge';

import Navbar from '@/components/navigation/Navbar';
import { RecruiterSidebar } from '@/components/navigation/RecruiterSidebar';
import { NotFoundComponent } from '@/components/root/NotFound';
import { RootErrorComponent } from '@/components/root/RootError';
import { FormTextField } from '@/components/ui/form/TextField';
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools';
import appCss from '@/styles.css?url';
import { getIsRouteInNavigation } from '@/utils/navigation';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField: FormTextField,
  },
  formComponents: {},
});

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Eros',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/logo.png',
        type: 'image/png',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
      },
    ],
  }),

  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: RootErrorComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isInNavigation = getIsRouteInNavigation();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen">
        <Navbar onProfileClick={() => setIsSidebarOpen(true)} />
        <div
          className={twMerge(
            'relative flex h-210 bg-neutral-100 text-neutral-900',
            isInNavigation ? 'p-4' : 'p-0',
          )}
        >
          <Outlet />
        </div>
        <RecruiterSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
