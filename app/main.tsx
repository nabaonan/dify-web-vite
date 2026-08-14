import React, { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

// Root layout
import AppLayout from './layout'

// Auth pages (standalone layouts)
const SignInLayout = lazy(() => import('./signin/layout'))
const SignInPage = lazy(() => import('./signin/page'))
const SignInCheckCode = lazy(() => import('./signin/check-code/page'))
const SignInInviteSettings = lazy(() => import('./signin/invite-settings/page'))

const SignUpLayout = lazy(() => import('./signup/layout'))
const SignUpPage = lazy(() => import('./signup/page'))
const SignUpCheckCode = lazy(() => import('./signup/check-code/page'))
const SignUpSetPassword = lazy(() => import('./signup/set-password/page'))

const ResetPasswordLayout = lazy(() => import('./reset-password/layout'))
const ResetPasswordPage = lazy(() => import('./reset-password/page'))
const ResetPasswordCheckCode = lazy(() => import('./reset-password/check-code/page'))
const ResetPasswordSetPassword = lazy(() => import('./reset-password/set-password/page'))

const ForgotPasswordPage = lazy(() => import('./forgot-password/page'))
const InitPage = lazy(() => import('./init/page'))
const InstallPage = lazy(() => import('./install/page'))
const ActivatePage = lazy(() => import('./activate/page'))
const OAuthCallbackPage = lazy(() => import('./oauth-callback/page'))
const DevPreviewPage = lazy(() => import('./dev-preview/page'))

// Common Layout
const CommonLayout = lazy(() => import('./(commonLayout)/layout'))
const AppsPage = lazy(() => import('./(commonLayout)/apps/page'))
const EducationApplyPage = lazy(() => import('./(commonLayout)/education-apply/page'))
const PluginsPage = lazy(() => import('./(commonLayout)/plugins/page'))
const ToolsPage = lazy(() => import('./(commonLayout)/tools/page'))

// Datasets
const DatasetsLayout = lazy(() => import('./(commonLayout)/datasets/layout'))
const DatasetsPage = lazy(() => import('./(commonLayout)/datasets/page'))
const DatasetsCreate = lazy(() => import('./(commonLayout)/datasets/create/page'))
const DatasetsConnect = lazy(() => import('./(commonLayout)/datasets/connect/page'))
const DatasetsCreateFromPipeline = lazy(() => import('./(commonLayout)/datasets/create-from-pipeline/page'))

const DatasetDetailLayout = lazy(() => import('./(commonLayout)/datasets/(datasetDetailLayout)/layout'))
const DatasetApi = lazy(() => import('./(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/api/page'))
const DatasetSettings = lazy(() => import('./(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/settings/page'))
const DatasetHitTesting = lazy(() => import('./(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/hitTesting/page'))
const DatasetPipeline = lazy(() => import('./(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/pipeline/page'))
const DatasetDocuments = lazy(() => import('./(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/documents/page'))
const DatasetDocument = lazy(() => import('./(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/documents/[documentId]/page'))
const DatasetDocSettings = lazy(() => import('./(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/documents/[documentId]/settings/page'))
const DatasetDocCreate = lazy(() => import('./(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/documents/create/page'))
const DatasetDocCreateFromPipeline = lazy(() => import('./(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/documents/create-from-pipeline/page'))

// Explore
const ExploreLayout = lazy(() => import('./(commonLayout)/explore/layout'))
const ExploreApps = lazy(() => import('./(commonLayout)/explore/apps/page'))
const ExploreInstalled = lazy(() => import('./(commonLayout)/explore/installed/[appId]/page'))

// App Detail
const AppDetailLayout = lazy(() => import('./(commonLayout)/app/(appDetailLayout)/layout'))
const AppDetailInnerLayout = lazy(() => import('./(commonLayout)/app/(appDetailLayout)/[appId]/layout'))
const AppConfiguration = lazy(() => import('./(commonLayout)/app/(appDetailLayout)/[appId]/configuration/page'))
const AppDevelop = lazy(() => import('./(commonLayout)/app/(appDetailLayout)/[appId]/develop/page'))
const AppLogs = lazy(() => import('./(commonLayout)/app/(appDetailLayout)/[appId]/logs/page'))
const AppOverview = lazy(() => import('./(commonLayout)/app/(appDetailLayout)/[appId]/overview/page'))
const AppWorkflow = lazy(() => import('./(commonLayout)/app/(appDetailLayout)/[appId]/workflow/page'))
const AppAnnotations = lazy(() => import('./(commonLayout)/app/(appDetailLayout)/[appId]/annotations/page'))

// Share Layout
const ShareLayout = lazy(() => import('./(shareLayout)/layout'))
const ChatPage = lazy(() => import('./(shareLayout)/chat/[token]/page'))
const ChatbotPage = lazy(() => import('./(shareLayout)/chatbot/[token]/page'))
const CompletionPage = lazy(() => import('./(shareLayout)/completion/[token]/page'))
const WorkflowSharePage = lazy(() => import('./(shareLayout)/workflow/[token]/page'))

const WebappSignInLayout = lazy(() => import('./(shareLayout)/webapp-signin/layout'))
const WebappSignInPage = lazy(() => import('./(shareLayout)/webapp-signin/page'))
const WebappSignInCheckCode = lazy(() => import('./(shareLayout)/webapp-signin/check-code/page'))

const WebappResetPasswordLayout = lazy(() => import('./(shareLayout)/webapp-reset-password/layout'))
const WebappResetPasswordPage = lazy(() => import('./(shareLayout)/webapp-reset-password/page'))
const WebappResetCheckCode = lazy(() => import('./(shareLayout)/webapp-reset-password/check-code/page'))
const WebappResetSetPass = lazy(() => import('./(shareLayout)/webapp-reset-password/set-password/page'))

// Account
const AccountPage = lazy(() => import('./account/(commonLayout)/page'))
const AccountLayout = lazy(() => import('./account/(commonLayout)/layout'))
const OAuthAuthorizePage = lazy(() => import('./account/oauth/authorize/page'))
const OAuthAuthorizeLayout = lazy(() => import('./account/oauth/authorize/layout'))

function SW({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><div className="text-sm text-text-tertiary">Loading...</div></div>}>{children}</Suspense>
}

const router = createBrowserRouter([
  {
    element: <SW><AppLayout /></SW>,
    children: [
      { index: true, element: <Navigate to="/apps" replace /> },

      { path: 'signin', element: <SW><SignInLayout><SignInPage /></SignInLayout></SW> },
      { path: 'signin/check-code', element: <SW><SignInLayout><SignInCheckCode /></SignInLayout></SW> },
      { path: 'signin/invite-settings', element: <SW><SignInLayout><SignInInviteSettings /></SignInLayout></SW> },

      { path: 'signup', element: <SW><SignUpLayout><SignUpPage /></SignUpLayout></SW> },
      { path: 'signup/check-code', element: <SW><SignUpLayout><SignUpCheckCode /></SignUpLayout></SW> },
      { path: 'signup/set-password', element: <SW><SignUpLayout><SignUpSetPassword /></SignUpLayout></SW> },

      { path: 'forgot-password', element: <SW><ForgotPasswordPage /></SW> },

      { path: 'reset-password', element: <SW><ResetPasswordLayout><ResetPasswordPage /></ResetPasswordLayout></SW> },
      { path: 'reset-password/check-code', element: <SW><ResetPasswordLayout><ResetPasswordCheckCode /></ResetPasswordLayout></SW> },
      { path: 'reset-password/set-password', element: <SW><ResetPasswordLayout><ResetPasswordSetPassword /></ResetPasswordLayout></SW> },

      { path: 'init', element: <SW><InitPage /></SW> },
      { path: 'install', element: <SW><InstallPage /></SW> },
      { path: 'activate', element: <SW><ActivatePage /></SW> },
      { path: 'oauth-callback', element: <SW><OAuthCallbackPage /></SW> },
      { path: 'dev-preview', element: <SW><DevPreviewPage /></SW> },

      {
        path: 'account',
        element: <SW><AccountLayout /></SW>,
        children: [
          { index: true, element: <SW><AccountPage /></SW> },
        ],
      },
      {
        path: 'account/oauth/authorize',
        element: <SW><OAuthAuthorizeLayout><OAuthAuthorizePage /></OAuthAuthorizeLayout></SW>,
      },

      {
        element: <SW><CommonLayout /></SW>,
        children: [
          { path: 'apps', element: <SW><AppsPage /></SW> },
          { path: 'education-apply', element: <SW><EducationApplyPage /></SW> },
          { path: 'plugins', element: <SW><PluginsPage /></SW> },
          { path: 'tools', element: <SW><ToolsPage /></SW> },

          {
            path: 'explore',
            element: <SW><ExploreLayout /></SW>,
            children: [
              { path: 'apps', element: <SW><ExploreApps /></SW> },
              { path: 'installed/:appId', element: <SW><ExploreInstalled /></SW> },
            ],
          },

          {
            path: 'datasets',
            element: <SW><DatasetsLayout /></SW>,
            children: [
              { index: true, element: <SW><DatasetsPage /></SW> },
              { path: 'create', element: <SW><DatasetsCreate /></SW> },
              { path: 'connect', element: <SW><DatasetsConnect /></SW> },
              { path: 'create-from-pipeline', element: <SW><DatasetsCreateFromPipeline /></SW> },
              {
                path: ':datasetId',
                element: <SW><DatasetDetailLayout /></SW>,
                children: [
                  { path: 'api', element: <SW><DatasetApi /></SW> },
                  { path: 'settings', element: <SW><DatasetSettings /></SW> },
                  { path: 'hitTesting', element: <SW><DatasetHitTesting /></SW> },
                  { path: 'pipeline', element: <SW><DatasetPipeline /></SW> },
                  { path: 'documents', element: <SW><DatasetDocuments /></SW> },
                  { path: 'documents/:documentId', element: <SW><DatasetDocument /></SW> },
                  { path: 'documents/:documentId/settings', element: <SW><DatasetDocSettings /></SW> },
                  { path: 'documents/create', element: <SW><DatasetDocCreate /></SW> },
                  { path: 'documents/create-from-pipeline', element: <SW><DatasetDocCreateFromPipeline /></SW> },
                ],
              },
            ],
          },

          {
            path: 'app/:appId',
            element: <SW><AppDetailLayout /></SW>,
            children: [
              {
                element: <SW><AppDetailInnerLayout /></SW>,
                children: [
                  { path: 'configuration', element: <SW><AppConfiguration /></SW> },
                  { path: 'develop', element: <SW><AppDevelop /></SW> },
                  { path: 'logs', element: <SW><AppLogs /></SW> },
                  { path: 'overview', element: <SW><AppOverview /></SW> },
                  { path: 'workflow', element: <SW><AppWorkflow /></SW> },
                  { path: 'annotations', element: <SW><AppAnnotations /></SW> },
                ],
              },
            ],
          },
        ],
      },

      {
        element: <SW><ShareLayout /></SW>,
        children: [
          { path: 'chat/:token', element: <SW><ChatPage /></SW> },
          { path: 'chatbot/:token', element: <SW><ChatbotPage /></SW> },
          { path: 'completion/:token', element: <SW><CompletionPage /></SW> },
          { path: 'workflow/:token', element: <SW><WorkflowSharePage /></SW> },
          { path: 'webapp-signin', element: <SW><WebappSignInLayout><WebappSignInPage /></WebappSignInLayout></SW> },
          { path: 'webapp-signin/check-code', element: <SW><WebappSignInLayout><WebappSignInCheckCode /></WebappSignInLayout></SW> },
          { path: 'webapp-reset-password', element: <SW><WebappResetPasswordLayout><WebappResetPasswordPage /></WebappResetPasswordLayout></SW> },
          { path: 'webapp-reset-password/check-code', element: <SW><WebappResetPasswordLayout><WebappResetCheckCode /></WebappResetPasswordLayout></SW> },
          { path: 'webapp-reset-password/set-password', element: <SW><WebappResetPasswordLayout><WebappResetSetPass /></WebappResetPasswordLayout></SW> },
        ],
      },
    ],
  },
])

function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}

const rootElement = document.getElementById('root')
if (rootElement)
  createRoot(rootElement).render(<App />)

export default App
