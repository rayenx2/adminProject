"use client";
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getCategoriesOrderedByMostSold } from '../../api/api'; // Import the API function

const OrderedSoldCategory = () => {
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategoriesOrderedByMostSold();
        setCategoriesData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const totalSales = categoriesData.reduce((acc, category) => acc + parseInt(category.sales_count), 0);
  const series = categoriesData.map(category => Math.round((category.sales_count / totalSales) * 100));
  const labels = categoriesData.map(category => category.category_name);

  // Define the color palette
  const baseColors = ["#28a745", "#fd7e14", "#007bff", "#ffc107"]; // Green, Orange, Blue, Yellow

  // Function to generate a color palette
  const generateColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  };

  const colors = generateColors(labels.length); // Generate colors based on the number of categories

  const options = {
    chart: {
      type: 'donut',
      width: '500',
      height: '500',
    },
    colors: colors,
    labels: labels,
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    style: {
      colors: 'black', // Set the text color to white
    },
    legend: {
      show: true, // Show the legend
      position: 'bottom',
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Categories Sales
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>
    </div>
  );
};

export default OrderedSoldCategory;
