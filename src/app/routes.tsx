import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CommissionsPage } from './pages/CommissionsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CelebratePage } from './pages/CelebratePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'portfolio', Component: PortfolioPage },
      { path: 'portfolio/:slug', Component: ProjectDetailPage },
      { path: 'shop', Component: ShopPage },
      { path: 'shop/:slug', Component: ProductDetailPage },
      { path: 'commissions', Component: CommissionsPage },
      { path: 'celebrate', Component: CelebratePage },
      { path: 'about', Component: AboutPage },
      { path: 'contact', Component: ContactPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
