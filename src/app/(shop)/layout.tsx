import { Footer, Sidebar, TopMenu } from "../../components";

export default function ShopLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="min-h-screen">

      <TopMenu />
      <Sidebar />

      <div className="px-0 sm:px-10">
        { children }
      </div>

      <Footer />
    </div>
  );
}