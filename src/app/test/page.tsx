import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Rayen lassoud",
  description:
    "allah yehdih",
};

const Test = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="page rayen" />

      <div className="flex flex-col gap-10">
        bonjour rayen 
      </div>
    </DefaultLayout>
  );
};

export default Test;
