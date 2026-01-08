import { Card } from "../ui/card";

export default function DoaKhatam() {
  return (
    <Card className="p-4 border border-violet-600/90">
      <h1 className="text-center font-bold text-2xl">Doa Khatam Al-Qur'an</h1>
      <p className="text-right md:text-3xl text-2xl leading-14 md:leading-20 font-arabic" dir="rtl">اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ وَاجْعَلْهُ لِي إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نُسِّيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ الْعَالَمِينَ</p>
      <p className="text-left text-base text-green-600 italic">Arab latin: Allhummarhamni bilquran. Waj'alhu lii imaman wa nuran wa hudan wa rohmah. Allhumma dzakkirni minhu maa nasiitu wa 'allimnii minhu maa jahiltu warzuqnii tilawatahu aana-allaili wa'atrofannahaar waj'alhu li hujatan ya rabbal 'alamin.</p>
      <p className="text-left text-base text-gray-800">Terjemahan: Ya Allah, rahmatilah aku dengan Al-Quran. Jadikanlah ia sebagai pemimpin, cahaya, petunjuk, dan rahmat bagiku. Ya Allah, ingatkanlah aku atas apa yang terlupakan darinya. Ajarilah aku atas apa yang belum tahu darinya. Berikanlah aku kemampuan membacanya sepanjang malam dan ujung siang. Jadikanlah ia sebagai pembelaku, wahai tuhan semesta alam.</p>
    </Card>
  )
}
