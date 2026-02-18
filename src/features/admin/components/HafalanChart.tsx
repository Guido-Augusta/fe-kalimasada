import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HafalanChartProps {
  data: {
    tanggal: string;
    tambahHafalan: number;
    murajaah: number;
  }[];
  namaSantri: string;
  range: string;
  onRangeChange: (range: string) => void;
  mode: string;
  onModeChange: (mode: string) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {name: string; value: number}[];
  label?: string;
}

const chartConfig = {
  tambahHafalan: {
    label: "Tambah Hafalan",
    color: "#8957CC", // ungu
  },
  murajaah: {
    label: "Murajaah",
    color: "#FF8C42", // oranye
  },
};

export function HafalanChart({ data, namaSantri, range, onRangeChange, mode, onModeChange }: HafalanChartProps) {
  const chartData = data;

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const unitLabel = mode === "ayat" ? "Ayat" : "Halaman";
      return (
        <div className="bg-popover text-popover-foreground border rounded-md p-2 shadow-md">
          <p className="font-semibold">{label}</p>
          {payload.map((item: {name: string; value: number}, index: number) => (
            <p key={index} className="text-sm">
              {`${item.name}: ${item.value} ${unitLabel}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Hafalan {namaSantri}</CardTitle>
        <CardDescription className="my-2">
          <p>Jumlah tambah hafalan dan murajaah per hari.</p>
          <p className="text-base text-red-500">Tampilan grafik lebih optimal pada perangkat desktop (Laptop / PC).</p>
        </CardDescription>
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Select value={mode} onValueChange={onModeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Pilih mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ayat">Ayat</SelectItem>
              <SelectItem value="halaman">Halaman</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={range} onValueChange={onRangeChange} className="w-[200px] sm:w-[250px]">
            <TabsList>
              <TabsTrigger value="1w">1 Minggu</TabsTrigger>
              <TabsTrigger value="1m">1 Bulan</TabsTrigger>
              <TabsTrigger value="3m">3 Bulan</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}  className="min-h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tanggal"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
              }}
            />
            <Tooltip cursor={{ fill: "transparent" }} content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="tambahHafalan" name="Tambah Hafalan" fill="#8957CC" radius={8} />
            <Bar dataKey="murajaah" name="Murajaah" fill="#FF8C42" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
