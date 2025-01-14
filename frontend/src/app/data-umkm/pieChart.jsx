"use client";

import "leaflet/dist/leaflet.css";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useWindowSize } from "@/hook/useWindowSize";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const getFillColor = (category) => {
  const colors = {
    Makanan: "#FF812F",
    Minuman: "#BAEA6B",
    Pakaian: "#FFC14D",
    Furnitur: "#FFA07A",
    Elektronik: "#FF5733",
    "Jasa & Layanan": "#8FD14F",
    Kerajinan: "#FFD966",
    "Pertanian/Perkebunan": "#F4A261",
    "Bahan Pokok": "#E76F51",
    Lainnya: "#AEDF85",
  };
  return colors[category] || "#FFFFFF";
};

const chartConfig = {
  label: "vendor",
};

const PieChartSkeleton = () => {
  return (
    <div className="bg-white h-[350px] p-6 space-y-0 text-center">
      <Skeleton className="skeleton !w-32"></Skeleton>
      <Skeleton className="skeleton !w-72"></Skeleton>
      <Skeleton className="size-[150px] skeleton"></Skeleton>
      <Skeleton className="skeleton !w-72"></Skeleton>
      <Skeleton className="skeleton !w-32"></Skeleton>
    </div>
  );
};

const PieChartComponent = ({ data, className, selectedProvince }) => {
  const screenWidth = useWindowSize();

  const categoryData = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const result = Object.keys(categoryData).map((category) => {
    return {
      category: category,
      vendor: categoryData[category],
      fill: getFillColor(category),
    };
  });

  if (data.length == 0) return <PieChartSkeleton />;

  return (
    <Card className="border shadow-sm bg-third border-muted h-[350px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Statistik UMKM</CardTitle>
        <CardDescription className="text-center">
          Eksplorasi Ragam Usaha Lokal di{" "}
          <span className="capitalize">{selectedProvince}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className={cn("mx-auto aspect-square", className)}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={result}
              dataKey="vendor"
              nameKey="category"
              innerRadius={screenWidth < 768 ? 55 : 50}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold fill-foreground"
                        >
                          {data.length}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="text-xs fill-muted-foreground"
                        >
                          UMKM
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-center">
        Lihat bagaimana UMKM tersebar di berbagai kategori usaha di{" "}
        {selectedProvince}.
      </CardFooter>
    </Card>
  );
};

export default PieChartComponent;
