"use client";
import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getProductsOrderedByMostSoldByWeek, getProductsOrderedByMostSoldByMonth } from "../../api/api"; // Adjust the import path as needed

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const initialOptions: ApexOptions = {
  chart: {
    type: 'bar',
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    title: {
      text: 'Quantity Sold',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: (val) => `${val} units`,
    },
  },
};

const ChartComponent: React.FC = () => {
  const [options, setOptions] = useState<ApexOptions>(initialOptions);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    {
      name: "Quantity Sold",
      data: [],
    },
  ]);
  const [dateRange, setDateRange] = useState<string>('');

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getWeekRange = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 6);
    return `${formatDate(lastWeek)} - ${formatDate(today)}`;
  };

  const getMonthRange = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return `${formatDate(startOfMonth)} - ${formatDate(today)}`;
  };

  const fetchWeeklyData = async () => {
    try {
      const data = await getProductsOrderedByMostSoldByWeek();
      const productNames = data.map((item: any) => item.title); // Change item.productName to item.title
      const quantities = data.map((item: any) => Number(item.sales_count)); // Change item.quantitySold to item.sales_count

      setSeries([
        {
          name: "Quantity Sold",
          data: quantities,
        },
      ]);
      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          categories: productNames,
        },
      }));
      setDateRange(getWeekRange());
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const data = await getProductsOrderedByMostSoldByMonth();
      const productNames = data.map((item: any) => item.title); // Change item.productName to item.title
      const quantities = data.map((item: any) => Number(item.sales_count)); // Change item.quantitySold to item.sales_count

      console.log('data',data)
      console.log('productNames',productNames)
      console.log('quantities',quantities)

      setSeries([
        {
          name: "Quantity Sold",
          data: quantities,
        },
      ]);
      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          categories: productNames,
        },
      }));
      setDateRange(getMonthRange());
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <h5 className="text-xl font-semibold text-black dark:text-white">
            Sold Products Quantity
          </h5>
      <div className="flex w-full max-w-45 justify-end">
        <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
          <button
            onClick={fetchWeeklyData}
            className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"
          >
           This Week
          </button>
          <button
            onClick={fetchMonthlyData}
            className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"
          >
           This Month
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-center font-medium text-lg">{dateRange}</p>
      </div>

      <div>
        <div id="chart">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
