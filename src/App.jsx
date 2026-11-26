import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './routes/Home';

// Not converted yet — see routes/Placeholder.jsx.
//const Landing = lazy(() => import('./routes/Landing'));
const Privacy = lazy(() => import('./routes/Privacy'));
const NotFound = lazy(() => import('./routes/NotFound'));

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <Suspense fallback={null}>
          <Routes>
            //<Route path="/app/*" element={<Home />} />
            <Route path="/*" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppProvider>
    </BrowserRouter>
  );
}
