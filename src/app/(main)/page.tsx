"use client"
import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DollarSign,
  Globe,
  Users,
} from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
}

interface KpiData {
    monthlyPatients: number;
    monthlyRevenue: number;
    topCountries: { name: string; value: number }[];
    revenueByMonth: { month: string; revenue: number }[];
}

export default function DashboardPage() {
    const [kpiData, setKpiData] = React.useState<KpiData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchKpiData = async () => {
            try {
                const response = await fetch('/api/kpi');
                const data = await response.json();
                setKpiData(data);
            } catch (error) {
                console.error("Failed to fetch KPI data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchKpiData();
    }, []);


  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-32" /> : (
                <>
                    <div className="text-2xl font-bold">${kpiData?.monthlyRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                    </p>
                </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-24" /> : (
                <>
                    <div className="text-2xl font-bold">+{kpiData?.monthlyPatients}</div>
                    <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                    </p>
                </>
             )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Country</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-28" /> : (
                <>
                    <div className="text-2xl font-bold">{kpiData?.topCountries[0].name}</div>
                    <p className="text-xs text-muted-foreground">
                    {kpiData?.topCountries[0].value} patients this month
                    </p>
                </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? <Skeleton className="h-[350px] w-full" /> : (
                 <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kpiData?.revenueByMonth}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis
                                tickFormatter={(value) => `$${Number(value) / 1000}k`}
                            />
                            <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Patients by Country</CardTitle>
            <CardDescription>
              Top countries by patient volume this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-40 w-full" /> : (
                <div className="space-y-4">
                {kpiData?.topCountries.map((country) => (
                    <div key={country.name} className="flex items-center">
                    <div>{country.name}</div>
                    <div className="ml-auto font-medium">{country.value}</div>
                    </div>
                ))}
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
