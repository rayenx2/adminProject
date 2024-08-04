"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getSumOfAllOrdersByWeek, getSumOfAllOrdersByMonth } from "../../api/api";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "line",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2],
    curve: "smooth",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "datetime",
    labels: {
      format: 'MMM yyyy',
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
  },
};

const ChartTwo: React.FC = () => {
  const [series, setSeries] = useState([
    {
      name: "Amount",
      data: [],
    },
  ]);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const fetchData = async () => {
    try {
      let data;
      if (period === 'week') {
        data = await getSumOfAllOrdersByWeek();
        console.log('Week Data:', data);
      } else {
        data = await getSumOfAllOrdersByMonth();
        console.log('Month Data:', data);
      }
  
      const transformedData = data.map((dataPoint) => {
        const { totalsum, date } = dataPoint;
  
        // Ensure totalsum and date are defined and valid
        if (totalsum === undefined || date === undefined) {
          console.error('Invalid data point:', dataPoint);
          return null;
        }
  
        // Convert totalsum to a number
        const yValue = parseFloat(totalsum);
        if (isNaN(yValue)) {
          console.error('Invalid totalsum value:', totalsum);
          return null;
        }
  
        // Transform date if necessary
        const formattedDate = new Date(date).toISOString(); // Use ISO string format for consistency
        console.log('formattedDate', formattedDate);
  
        return {
          x: formattedDate,
          y: yValue,
        };
      }).filter(dataPoint => dataPoint !== null);
  
      console.log('Transformed Data:', transformedData);
  
      setSeries([
        {
          name: "Amount",
          data: transformedData,
        },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [period]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 flex justify-between gap-4">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Profit over Time
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name="#"
              id="#"
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
              onChange={(e) => setPeriod(e.target.value as 'week' | 'month')}
              value={period}
            >
              <option value="week" className="dark:bg-boxdark">
                This Week
              </option>
              <option value="month" className="dark:bg-boxdark">
                This Month
              </option>
            </select>
            <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.08816 9.45854 1.19113L5.14851 5.89805C5.06025 5.9746 4.92785 5.9746 4.85431 5.89805L0.912022 1.19113C0.819051 1.08816 0.500141 1.02932 0.47072 1.08816Z"
                  fill="#323232"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={335}
        width={"100%"}
      />
    </div>
  );
};

export default ChartTwo;
