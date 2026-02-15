import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserLogin from "@/features/authentication/pages/user.login"
// import AdminLogin from "@/features/authentication/pages/admin.login"
import NotFound from "@/features/NotFound"
import PrivateRoute from "@/middleware/privateRoute"
import AdminDashboard from "@/features/admin/pages"
import UstadzDashboard from "@/features/ustadz"
import OrtuDashboard from "@/features/ortu"
import SantriDashboard from "@/features/santri"
import Unauthorized from "@/features/Unauthorized"
import ManageUstadz from "@/features/admin/pages/ustadz/ManageUstadz"
import ManageSantri from "@/features/admin/pages/santri/ManageSantri"
import ManageOrtu from "@/features/admin/pages/ortu/ManageOrtu"
import AddUstadz from "@/features/admin/pages/ustadz/AddUstadz"
import DetailUstadz from "@/features/admin/pages/ustadz/DetailUstadz"
import EditUstadz from "@/features/admin/pages/ustadz/EditUstadz"
import AddOrtu from "@/features/admin/pages/ortu/AddOrtu"
import DetailOrtu from "@/features/admin/pages/ortu/DetailOrtu"
import EditOrtu from "@/features/admin/pages/ortu/EditOrtu"
import DetailSantri from "@/features/admin/pages/santri/DetailSantri"
import AddSantri from "@/features/admin/pages/santri/AddSantri"
import EditSantri from "@/features/admin/pages/santri/EditSantri"
import UstadzDetailSantri from "@/features/ustadz/pages/UstadzDetailSantri"
import UstadzDetailOrtu from "@/features/ustadz/pages/UstadzDetailOrtu"
import UstadzProgressHafalan from "@/features/ustadz/pages/UstadzProgressHafalan"
import UstadzAddHafalan from "@/features/ustadz/pages/UstadzAddHafalan"
import UstadzRiwayatHafalan from "@/features/ustadz/pages/UstadRiwayatHafalan"
import UstadzDetailHafalan from "@/features/ustadz/pages/UstadzDetailHafalan"
import SantriBacaSurat from "@/features/santri/pages/SantriBacaSurat"
import SantriRiwayatHafalan from "@/features/santri/pages/SantriRiwayatHafalan"
import SantriDetailHafalan from "@/features/santri/pages/SantriDetailHafalan"
import UstadPeringkatSantri from "@/features/ustadz/pages/UstadPeringkatSantri"
import SantriDetailView from "@/features/santri/pages/SantriDetailView"
import AdminPeringkatSantri from "@/features/admin/pages/santri/AdminPeringkatSantri"
import SantriDetailOrtu from "@/features/santri/pages/SantriDetailOrtu"
import OrtuDetailSantri from "@/features/ortu/pages/OrtuDetailSantri"
import OtherParentDetail from "@/features/ortu/pages/OtherParentDetail"
import OrtuProgressHafalan from "@/features/ortu/pages/OrtuProgressHafalan"
import OrtuRiwayatHafalan from "@/features/ortu/pages/OrtuRiwayatHafalan"
import OrtuDetailHafalan from "@/features/ortu/pages/OrtuDetailHafalan"
import SantriProfile from "@/features/santri/pages/SantriProfile"
import OrtuProfile from "@/features/ortu/pages/OrtuProfile"
import UstadProfile from "@/features/ustadz/pages/UstadProfile"
import UstadEditProfile from "@/features/ustadz/pages/UstadEditProfile"
import SantriEditProfile from "@/features/santri/pages/SantriEditProfile"
import OrtuEditProfile from "@/features/ortu/pages/OrtuEditProfile"
import AlquranAdmin from "@/features/admin/pages/AlquranAdmin"
import AlquranUstadz from "@/features/ustadz/pages/AlquranUstadz"
import AlquranOrtu from "@/features/ortu/pages/AlquranOrtu"
import RoleRedirect from "@/middleware/RoleRedirect"
import BacaAlquranAdmin from "@/features/admin/pages/BacaAlquranAdmin"
import BacaSurahUstadz from "@/features/ustadz/pages/BacaSurahUstadz"
import BacaAlquranOrtu from "@/features/ortu/pages/BacaAlquranOrtu"
import BacaJuzAdmin from "@/features/admin/pages/BacaJuzAdmin"
import BacaJuzUstadz from "@/features/ustadz/pages/BacaJuzUstadz"
import BacaJuzOrtu from "@/features/ortu/pages/BacaJuzOrtu"
import ForgotEmail from "@/features/authentication/pages/forgot.email"
import VerifyToken from "@/features/authentication/pages/verify.token"
import SetNewPassword from "@/features/authentication/pages/set-new.password"
import UstadChangePassword from "@/features/ustadz/pages/UstadChangePassword"
import SantriChangePassword from "@/features/santri/pages/SantriChangePassword"
import OrtuChangePassword from "@/features/ortu/pages/OrtuChangePassword"
import UstadLainDetail from "@/features/ustadz/pages/UstadLainDetail"
import UstadKelasTahapan from "@/features/ustadz/pages/UstadKelasTahapan"
import SantriDetailUstad from "@/features/santri/pages/SantriDetailUstad"
import OrtuDetailUstad from "@/features/ortu/pages/OrtuDetailUstad"
import UstadRiwayatTerakhir from "@/features/ustadz/pages/UstadRiwayatTerakhir"
import DoakKhatamSantri from "@/features/santri/pages/DoakKhatamSantri"

export const AppRouter = () => {
  return (
      <BrowserRouter>
        <Routes>
           {/* default redirect */}
           <Route path="/" element={<RoleRedirect />} />

          {/* auth */}
          <Route path="/login" element={<UserLogin />} />
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/forgot-password" element={<ForgotEmail />} />
          <Route path="/verify-token" element={<VerifyToken />} />

          {/* admin */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} redirectPath="/login" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ustadz" element={<ManageUstadz />} />
            <Route path="/admin/ustadz/add" element={<AddUstadz />} />
            <Route path="/admin/ustadz/detail/:id" element={<DetailUstadz />} />
            <Route path="/admin/ustadz/edit/:id" element={<EditUstadz />} />
            <Route path="/admin/santri" element={<ManageSantri />} />
            <Route path="/admin/orangtua" element={<ManageOrtu />} />
            <Route path="/admin/orangtua/add" element={<AddOrtu />} />
            <Route path="/admin/orangtua/detail/:id" element={<DetailOrtu />} />
            <Route path="/admin/orangtua/edit/:id" element={<EditOrtu />} />
            <Route path="/admin/santri/add" element={<AddSantri />} />
            <Route path="/admin/santri-detail/:id" element={<DetailSantri />} />
            <Route path="/admin/santri/edit/:id" element={<EditSantri />} />
            <Route path="/admin/santri/peringkat" element={<AdminPeringkatSantri />} />
<Route path="/admin/alquran" element={<AlquranAdmin />} />
            <Route path="/admin/alquran/surah/:idSurah" element={<BacaAlquranAdmin />} />
            <Route path="/admin/alquran/juz/:idJuz" element={<BacaJuzAdmin />} />
          </Route>

          {/* ustadz */}
          <Route element={<PrivateRoute allowedRoles={["ustadz"]} />}>
            <Route path="/ustadz" element={<UstadzDashboard />} />
            <Route path="/ustadz/santri-detail/:id" element={<UstadzDetailSantri />} />
            <Route path="/ustadz/orangtua/detail/:id" element={<UstadzDetailOrtu />} />
            <Route path="/ustadz/progress/hafalan/:idSantri" element={<UstadzProgressHafalan />} />
            <Route path="/ustadz/hafalan/:idSantri/:idSurah" element={<UstadzAddHafalan />} />
            <Route path="/ustadz/riwayat/hafalan/:idSantri" element={<UstadzRiwayatHafalan />} />
            <Route path="/ustadz/riwayat/detail/:santriId/surah/:surahId" element={<UstadzDetailHafalan />} />
            <Route path="/ustadz/peringkat/santri" element={<UstadPeringkatSantri />} />
            <Route path="/ustadz/profile" element={<UstadProfile />} />
            <Route path="/ustadz/edit/profile" element={<UstadEditProfile />} />
<Route path="/ustadz/alquran" element={<AlquranUstadz />} />
            <Route path="/ustadz/alquran/surah/:idSurah" element={<BacaSurahUstadz />} />
            <Route path="/ustadz/alquran/juz/:idJuz" element={<BacaJuzUstadz />} />
            <Route path="/ustadz/change-password" element={<UstadChangePassword />} />
            <Route path="/ustadz/ustadz/detail/:id" element={<UstadLainDetail />} />
            <Route path="/ustadz/kelas/tahapan" element={<UstadKelasTahapan />} />
            <Route path="/ustadz/riwayat/terakhir" element={<UstadRiwayatTerakhir />} />
          </Route>

          {/* ortu */}
          <Route element={<PrivateRoute allowedRoles={["ortu"]} />}>
            <Route path="/ortu" element={<OrtuDashboard />} />
            <Route path="/ortu/santri-detail/:id" element={<OrtuDetailSantri />} />
            <Route path="/ortu/orangtua/detail/:id" element={<OtherParentDetail />} />
            <Route path="/ortu/progress/hafalan/:idSantri" element={<OrtuProgressHafalan />} />
            <Route path="/ortu/riwayat/hafalan/:idSantri" element={<OrtuRiwayatHafalan />} />
            <Route path="/ortu/riwayat/detail/:santriId/surah/:surahId" element={<OrtuDetailHafalan />} />
            <Route path="/ortu/profile" element={<OrtuProfile />} />
            <Route path="/ortu/edit/profile" element={<OrtuEditProfile />} />
<Route path="/ortu/alquran" element={<AlquranOrtu />} />
            <Route path="/ortu/alquran/surah/:idSurah" element={<BacaAlquranOrtu />} />
            <Route path="/ortu/alquran/juz/:idJuz" element={<BacaJuzOrtu />} />
            <Route path="/ortu/change-password" element={<OrtuChangePassword />} />
            <Route path="/ortu/ustadz/detail/:id" element={<OrtuDetailUstad />} />
          </Route>

          {/* santri */}
          <Route element={<PrivateRoute allowedRoles={["santri"]} />}>
            <Route path="/santri" element={<SantriDashboard />} />
            <Route path="/santri/baca/surah/:idSurah" element={<SantriBacaSurat />} />
            <Route path="/santri/riwayat/hafalan" element={<SantriRiwayatHafalan />} />
            <Route path="/santri/riwayat/detail/:santriId/surah/:surahId" element={<SantriDetailHafalan />} />
            <Route path="/santri/santri-detail/:id" element={<SantriDetailView />} />
            <Route path="/santri/orangtua/detail/:id" element={<SantriDetailOrtu />} />
            <Route path="/santri/profile" element={<SantriProfile />} />
            <Route path="/santri/edit/profile" element={<SantriEditProfile />} />
            <Route path="/santri/change-password" element={<SantriChangePassword />} />
            <Route path="/santri/ustadz/detail/:id" element={<SantriDetailUstad />} />
            <Route path="/santri/doa-khatam-al-quran" element={<DoakKhatamSantri />} />
          </Route>

          {/* not found */}
          <Route path="*" element={<NotFound />} />

          {/* unauthorized */}
          <Route path="unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
  )
}