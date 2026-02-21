import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import VehiclesPage from '@/components/pages/VehiclesPage';
import VehicleDetailPage from '@/components/pages/VehicleDetailPage';
import TripsPage from '@/components/pages/TripsPage';
import TripDetailPage from '@/components/pages/TripDetailPage';
import DriversPage from '@/components/pages/DriversPage';
import DriverDetailPage from '@/components/pages/DriverDetailPage';
import MaintenancePage from '@/components/pages/MaintenancePage';
import ExpensesPage from '@/components/pages/ExpensesPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import ContactPage from '@/components/pages/ContactPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "vehicles",
        element: <VehiclesPage />,
        routeMetadata: {
          pageIdentifier: 'vehicles',
        },
      },
      {
        path: "vehicles/:id",
        element: <VehicleDetailPage />,
        routeMetadata: {
          pageIdentifier: 'vehicle-detail',
        },
      },
      {
        path: "trips",
        element: <TripsPage />,
        routeMetadata: {
          pageIdentifier: 'trips',
        },
      },
      {
        path: "trips/:id",
        element: <TripDetailPage />,
        routeMetadata: {
          pageIdentifier: 'trip-detail',
        },
      },
      {
        path: "drivers",
        element: <DriversPage />,
        routeMetadata: {
          pageIdentifier: 'drivers',
        },
      },
      {
        path: "drivers/:id",
        element: <DriverDetailPage />,
        routeMetadata: {
          pageIdentifier: 'driver-detail',
        },
      },
      {
        path: "maintenance",
        element: <MaintenancePage />,
        routeMetadata: {
          pageIdentifier: 'maintenance',
        },
      },
      {
        path: "expenses",
        element: <ExpensesPage />,
        routeMetadata: {
          pageIdentifier: 'expenses',
        },
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
        routeMetadata: {
          pageIdentifier: 'analytics',
        },
      },
      {
        path: "contact",
        element: <ContactPage />,
        routeMetadata: {
          pageIdentifier: 'contact',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
