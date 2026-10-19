import Navbar from '../Navbar'
import Footer from '../Footer'
import { Toaster } from '../ui/sonner'
import ScrollToTop from './ScrollToTop'

function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      <Toaster />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout