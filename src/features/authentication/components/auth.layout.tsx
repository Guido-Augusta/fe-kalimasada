export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <main className="grid h-screen md:grid-cols-2">
          <section className="hidden md:flex flex-col justify-between p-10 bg-violet-600 text-yellow-400">
            <h1 className="font-bold text-5xl">Tahfidz App</h1>
            <img src="/images/al-quran.png" alt="" className="w-3/4 m-auto" />
            <p className="text-lg font-semibold">
              Aplikasi untuk mencatat hafalan Al-quran di pondok pesantren kalimasada
            </p>
          </section>
          <section className="flex flex-col items-center justify-center relative">
            <h1 className="md:hidden text-2xl font-bold mb-6 text-wrap text-violet-600">Tahfidz App - Kalimasada</h1>
            {children}
          </section>
      </main>
  );
};